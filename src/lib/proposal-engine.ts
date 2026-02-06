
import OpenAI from 'openai'
import { SupabaseClient } from '@supabase/supabase-js'

export type Proposal = {
    id?: string // Added ID for updates
    client_name: string
    title: string | null
    objective: string | null
    urgency_reason: string | null
    cost_of_inaction: string | null
    scope: string | null
    out_of_scope: string | null
    communication: string | null
    decision_maker: string | null
    dependencies: string | null
    project_value: number | null
    payment_conditions: string | null
    deadline: string | null
    created_at: string
    // Closing Kit Fields
    mode?: string | null
    closing_enabled?: boolean
    deposit_required?: boolean
    deposit_type?: string | null
    deposit_value?: number | null
    public_title?: string | null
    // Upsells
    upsell_options?: {
        title: string
        value: number
        text?: string
    }[] | null
    // OpenAI Cache
    ai_content?: ProposalContent | null
}

export type ProposalContent = {
    introduction: string
    context: string
    scope: string[]
    outOfScope: string | null
    operation: string
    investment: string
    commercialConditions: string
    timeline: string
    nextSteps: string
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // Note: We should ideally only call this server-side
})

/**
 * Main function to get proposal content.
 * Strategy:
 * 1. Check if 'ai_content' is already cached in the proposal object.
 * 2. If yes, return it.
 * 3. If no, try to generate using OpenAI.
 * 4. If OpenAI fails or key is missing, fallback to Legacy Template.
 * 5. If generated via AI and Supabase client is provided, save to DB.
 */
export async function generateProposalText(
    proposal: Proposal,
    supabase?: SupabaseClient
): Promise<ProposalContent> {
    // 1. Cache Hit
    if (proposal.ai_content) {
        return proposal.ai_content
    }

    // 2. Try AI Generation
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY missing, using legacy template.')
            return generateProposalTextLegacy(proposal)
        }

        const aiContent = await generateProposalTextAI(proposal)

        // 3. Save to DB (Cache)
        if (supabase && proposal.id) {
            await supabase
                .from('proposals')
                .update({ ai_content: aiContent })
                .eq('id', proposal.id)
        }

        return aiContent

    } catch (error) {
        console.error('Error generating AI proposal:', error)
        // 4. Fallback
        return generateProposalTextLegacy(proposal)
    }
}

async function generateProposalTextAI(proposal: Proposal): Promise<ProposalContent> {
    const rawScope = proposal.scope || ''
    const rawScopeItems = rawScope.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean)

    const systemPrompt = `
    You are a senior specialized consultant writing a high-end commercial proposal.
    Your tone is professional, persuasive, and authoritative.
    
    Output structured JSON matching this schema:
    {
      "introduction": "string",
      "context": "string (understanding of the problem)",
      "scope": ["string", "string"],
      "outOfScope": "string or null",
      "operation": "string (how it works)",
      "investment": "string (formatted value)",
      "commercialConditions": "string",
      "timeline": "string",
      "nextSteps": "string"
    }

    Instructions:
    - Use Brazilian Portuguese.
    - Expand on the user's brief inputs to make them sound more substantial and premium.
    - Do NOT invent specific deliverables not mentioned, but enhance the wording of existing ones.
    - For 'cost_of_inaction', emphasize the loss/risk powerfully.
    `

    const userPrompt = `
    Client: ${proposal.client_name}
    Project: ${proposal.title}
    Objective: ${proposal.objective}
    Urgency: ${proposal.urgency_reason}
    Cost of Inaction: ${proposal.cost_of_inaction}
    Scope Input: ${proposal.scope}
    Out of Scope: ${proposal.out_of_scope}
    Communication/Operation: ${proposal.communication}
    Dependencies: ${proposal.dependencies}
    Decision Maker: ${proposal.decision_maker}
    Value: ${proposal.project_value}
    Payment Terms: ${proposal.payment_conditions}
    Deadline: ${proposal.deadline}
    `

    const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Or gpt-3.5-turbo if cost is a concern
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
    })

    const result = completion.choices[0].message.content
    if (!result) throw new Error('Empty response from OpenAI')

    return JSON.parse(result) as ProposalContent
}

export function generateProposalTextLegacy(proposal: Proposal): ProposalContent {
    // 1. Capa / Introdução
    const introduction = `Esta proposta descreve os termos para a execução do projeto ${proposal.title || 'de Consultoria'}, desenvolvido sob medida para ${proposal.client_name}.`

    // 2. Contexto e Objetivo
    const context = `O objetivo central deste trabalho é ${proposal.objective || 'atender à demanda solicitada'}. ` +
        (proposal.urgency_reason ? `Entendemos que este projeto é prioritário pois ${proposal.urgency_reason}. ` : '') +
        (proposal.cost_of_inaction ? `Além disso, identificamos que a inércia neste momento pode resultar em ${proposal.cost_of_inaction}.` : '')

    // 3. Escopo do Projeto (list format)
    const scopeItems = proposal.scope
        ? proposal.scope.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean)
        : ['Execução dos serviços conforme alinhamento inicial.']

    // 4. O que não está incluso
    const outOfScope = proposal.out_of_scope
        ? `Para evitar dúvidas futuras e garantir o foco na entrega contratada, este projeto não contempla: ${proposal.out_of_scope}.`
        : null

    // 5. Operação e Comunicação
    const operation = `A gestão do projeto será realizada através de ${proposal.communication || 'canais oficiais'} para garantir o registro e a fluidez das informações. ` +
        (proposal.decision_maker ? `A aprovação final dos entregáveis caberá a ${proposal.decision_maker}. ` : '') +
        (proposal.dependencies ? `Para o sucesso do cronograma, mapeamos as seguintes dependências cruciais: ${proposal.dependencies}.` : '')

    // 6. Investimento
    const valueFormatted = proposal.project_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'
    const investment = `O investimento total para a execução deste projeto é de R$ ${valueFormatted}.`

    // 7. Condições Comerciais
    const commercialConditions = proposal.payment_conditions || 'A combinar.'

    // 8. Prazo e Cronograma
    const timeline = `Estima-se a conclusão do projeto em ${proposal.deadline || 'datas a definir'}, condicionado à aprovação dos entregáveis e disponibilização dos acessos necessários.`

    // 9. Próximos Passos
    const nextSteps = 'Para dar início ao projeto, é necessário confirmar esta proposta e seguir com o acordo conforme as condições descritas acima.'

    return {
        introduction,
        context,
        scope: scopeItems,
        outOfScope,
        operation,
        investment,
        commercialConditions,
        timeline,
        nextSteps
    }
}
