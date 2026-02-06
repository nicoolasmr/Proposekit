
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Schema for Proposal Data Extraction
export const proposalSchema = z.object({
    client_name: z.string().optional().describe('Name of the client company or person'),
    title: z.string().optional().describe('Title of the project or service'),
    objective: z.string().optional().describe('Main goal/objective of the project'),
    urgency_reason: z.string().optional().describe('Why is this project urgent?'),
    cost_of_inaction: z.string().optional().describe('What happens if they do nothing? (Risks/Losses)'),
    scope: z.string().optional().describe('List of deliverables or scope items'),
    out_of_scope: z.string().optional().describe('What is explicitly NOT included and why'),
    communication: z.string().optional().describe('How communication and meetings will work'),
    decision_maker: z.string().optional().describe('Who approves the project'),
    dependencies: z.string().optional().describe('What is needed from the client side'),
    project_value: z.number().optional().describe('Total value of the project (numeric)'),
    payment_conditions: z.string().optional().describe('Payment terms (e.g. 50/50, 30 days)'),
    deadline: z.string().optional().describe('Estimated timeline or deadline'),
});

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, currentData } = await req.json();

    const systemPrompt = `
    You are an aggressive, high-stakes sales consultant for 'ProposeKit'. 
    Your goal is to write a high-value commercial proposal for the user.
    
    You must extract specific details to fill the proposal database.
    
    CORE BEHAVIORS:
    1. **Be Direct & Authoritative**: Do not be polite. Be efficient. You are the expert.
    2. **Drill Down**: If the user gives a vague answer (e.g. "We want more sales"), ATTACK it. Ask "How much? By when? What is the current baseline?".
    3. **Focus on Pain**: Obsess over the 'Cost of Inaction'. Make the user verbalize what they lose if they don't hire this service.
    4. **One Thing at a Time**: Do not ask 5 questions. Ask 1 probing question.
    5. **Extract Continuously**: As soon as you hear a piece of info, call the 'update_proposal' tool.
    
    REQUIRED FIELDS TO EXTRACT (in roughly this order, but be flexible):
    - Client Name & Project Title
    - Real Objective (The "Why")
    - Urgency (Why now?) & Cost of Inaction (Crucial!)
    - Scope (Deliverables)
    - Value (Price) & Payment Terms
    - Timeline
    
    When you believe you have enough information to build a V1 proposal, ask the user if they want to generate the final document.
  `;

    const result = await streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
        tools: {
            update_proposal: tool({
                description: 'Update the proposal draft with new information extracted from the conversation.',
                parameters: proposalSchema,
                execute: async (newData) => {
                    // In a real app we might save to DB here, but for now we just return it
                    // so the client can update its local state.
                    return { updated: true, fields: Object.keys(newData) };
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
