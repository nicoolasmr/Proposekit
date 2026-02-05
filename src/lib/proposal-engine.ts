
export type Proposal = {
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

export function generateProposalText(proposal: Proposal): ProposalContent {
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
