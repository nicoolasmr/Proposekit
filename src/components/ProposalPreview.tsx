'use client'

import { motion } from 'framer-motion'

type ProposalProps = {
    data: {
        service: string
        client: string
        value: string
        deadline: string
        payment: string
    }
}

export default function ProposalPreview({ data }: ProposalProps) {
    return (
        <div className="bg-white border border-[#e5e5e5] shadow-2xl max-w-2xl mx-auto p-12 md:p-24 font-serif relative overflow-hidden">
            {/* Blurred overlay for paywall effect if needed */}

            <div className="space-y-16">
                <header className="border-b border-black pb-8">
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] mb-4">Proposta Comercial</p>
                    <h1 className="text-4xl md:text-5xl leading-tight">{data.service}</h1>
                </header>

                <section className="grid grid-cols-2 gap-12 text-sm">
                    <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Para</p>
                        <p className="text-xl">{data.client}</p>
                    </div>
                    <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Data</p>
                        <p className="text-xl">{new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl border-b border-[#f0f0f0] pb-2">Escopo do Serviço</h2>
                    <p className="text-muted leading-relaxed italic">
                        Esta proposta contempla a execução de {data.service} para {data.client}, seguindo os mais altos padrões de qualidade e entrega.
                    </p>
                </section>

                <section className="bg-[#fcfcfc] p-8 border-l-4 border-black">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Investimento Total</p>
                            <p className="text-3xl">{data.value}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Prazo</p>
                            <p className="text-lg">{data.deadline}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl">Condições de Pagamento</h2>
                    <p className="text-muted">{data.payment}</p>
                </section>

                <footer className="pt-16 text-[10px] font-sans uppercase tracking-widest text-center opacity-30">
                    Gerado via ProposeKit — Licença Premium
                </footer>
            </div>
        </div>
    )
}
