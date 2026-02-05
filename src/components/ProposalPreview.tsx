import { ProposalContent } from '@/lib/proposal-engine'

export default function ProposalPreview({ content, clientName }: { content: ProposalContent; clientName: string }) {
    return (
        <div className="bg-white border border-[#e5e5e5] shadow-2xl max-w-3xl mx-auto p-12 md:p-24 font-serif relative overflow-hidden text-[#333]">
            {/* Header */}
            <div className="space-y-12 mb-16 border-b border-black pb-12">
                <div className="flex justify-between items-start">
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Proposta Comercial</p>
                    <div className="text-right">
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Para</p>
                        <p className="text-lg italic">{clientName}</p>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl leading-tight font-serif tracking-tight pr-12">
                    Plano de Trabalho
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                    {content.introduction}
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">

                {/* 1. Contexto */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">1. Contexto e Objetivo</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.context}
                    </p>
                </section>

                {/* 2. Escopo */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">2. Escopo do Projeto</h3>
                    <ul className="space-y-4">
                        {content.scope.map((item, i) => (
                            <li key={i} className="flex gap-4 text-lg text-muted-foreground leading-relaxed">
                                <span className="block mt-2 w-1.5 h-1.5 rounded-full bg-black/20 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 3. Não Incluso (Conditional) */}
                {content.outOfScope && (
                    <section className="space-y-4">
                        <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">3. O que não está incluso</h3>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {content.outOfScope}
                        </p>
                    </section>
                )}

                {/* 4. Operação */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? '4' : '3'}. Operação e Comunicação
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.operation}
                    </p>
                </section>

                {/* 5. Investimento */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? '5' : '4'}. Investimento
                    </h3>
                    <div className="bg-[#f9f9f9] p-8 border-l-4 border-black">
                        <p className="text-xl leading-relaxed font-medium">
                            {content.investment}
                        </p>
                    </div>
                </section>

                {/* 6. Condições */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? '6' : '5'}. Condições Comerciais
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.commercialConditions}
                    </p>
                </section>

                {/* 7. Prazo */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? '7' : '6'}. Prazo Estimado
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.timeline}
                    </p>
                </section>

                {/* 8. Próximos Passos */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? '8' : '7'}. Próximos Passos
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.nextSteps}
                    </p>
                </section>

            </div>

            <footer className="pt-24 mt-12 border-t border-border/40 text-[10px] font-sans uppercase tracking-widest text-center opacity-30">
                Gerado via ProposeKit — Licença Premium
            </footer>
        </div>
    )
}
