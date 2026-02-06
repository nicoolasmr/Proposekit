'use client'
import { useState } from 'react'
import { ProposalContent } from '@/lib/proposal-engine'
import { Plus, Check, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProposalPreview({
    content,
    clientName,
    upsellOptions
}: {
    content: ProposalContent;
    clientName: string;
    upsellOptions?: { title: string; value: number }[] | null
}) {
    const [selectedUpsells, setSelectedUpsells] = useState<number[]>([])

    // Helper to parse base value (assuming format "R$ 1.500,00" or similar in text)
    // This is heuristic-based if we rely on the generated text string.
    // Ideally we should pass the numeric `project_value` separately too.
    // But for this feature, we might need to parse.
    // Actually, `content.investment` is a full sentence.
    // "O investimento total ... é de R$ 15.000,00."
    // Let's assume we want to show a "Total Estimado" at the bottom or just show the Upsells adding up.

    // To do this properly, we should probably pass the numeric `baseValue` as a prop too.
    // But since I can't easily change the Server Component -> Client Component interface without huge refactor,
    // I will render the Upsells as a separate block that shows "Adicionais Disponíveis".

    const toggleUpsell = (index: number) => {
        setSelectedUpsells(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const upsellTotal = upsellOptions?.reduce((acc, opt, idx) => {
        if (selectedUpsells.includes(idx)) return acc + opt.value
        return acc
    }, 0) || 0

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

                {/* UPSELLS SECTION */}
                {upsellOptions && upsellOptions.length > 0 && (
                    <section className="space-y-6">
                        <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                            {content.outOfScope ? '6' : '5'}. Opcionais (Upsell)
                        </h3>
                        <div className="grid gap-4">
                            {upsellOptions.map((opt, idx) => {
                                const isSelected = selectedUpsells.includes(idx)
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => toggleUpsell(idx)}
                                        className={cn(
                                            "cursor-pointer border p-6 flex items-center justify-between transition-all duration-300 group hover:border-black/30",
                                            isSelected ? "bg-black text-white border-black" : "bg-white border-border/60"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className={cn("text-lg font-serif italic", isSelected ? "text-white" : "text-black")}>
                                                {opt.title}
                                            </p>
                                            <p className={cn("text-xs font-sans uppercase tracking-widest", isSelected ? "opacity-70" : "opacity-40")}>
                                                Adicionar ao pacote
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className={cn("font-serif text-lg", isSelected ? "text-white" : "text-black")}>
                                                + {opt.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                            <div className={cn(
                                                "w-8 h-8 flex items-center justify-center border transition-all",
                                                isSelected ? "bg-white border-white" : "border-black/10 group-hover:border-black/30"
                                            )}>
                                                {isSelected ? <Check className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 opacity-30" />}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Dynamic Footer for Upsell */}
                        <div className="mt-8 p-6 bg-secondary/20 flex justify-between items-center">
                            <p className="text-sm font-sans uppercase tracking-widest opacity-60">Valor Adicional Selecionado</p>
                            <p className="text-2xl font-serif italic text-black">
                                + {upsellTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </section>
                )}

                {/* 6. Condições */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? (upsellOptions && upsellOptions.length > 0 ? '7' : '6') : (upsellOptions && upsellOptions.length > 0 ? '6' : '5')}. Condições Comerciais
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.commercialConditions}
                    </p>
                </section>

                {/* 7. Prazo */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? (upsellOptions && upsellOptions.length > 0 ? '8' : '7') : (upsellOptions && upsellOptions.length > 0 ? '7' : '6')}. Prazo Estimado
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {content.timeline}
                    </p>
                </section>

                {/* 8. Próximos Passos */}
                <section className="space-y-4">
                    <h3 className="font-sans text-xs uppercase tracking-[0.1em] font-bold border-b border-border pb-2 mb-4">
                        {content.outOfScope ? (upsellOptions && upsellOptions.length > 0 ? '9' : '8') : (upsellOptions && upsellOptions.length > 0 ? '8' : '7')}. Próximos Passos
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
