import { Brain, Palette, MousePointerClick } from 'lucide-react'

export function FeaturesGrid() {
    const features = [
        {
            icon: Brain,
            title: "Inteligência Estrutural",
            description: "Nossa IA não apenas escreve; ela estrutura seu argumento de vendas baseado em psicologia de fechamento de alto ticket."
        },
        {
            icon: Palette,
            title: "Design Imersivo",
            description: "Abandone o PDF estático. Entregue uma experiência web fluida que se adapta a qualquer dispositivo com elegância editorial."
        },
        {
            icon: MousePointerClick,
            title: "Kit de Fechamento",
            description: "Transforme a proposta em contrato. O cliente assina digitalmente (com validade jurídica) e realiza o pagamento da entrada via Pix instantâneo."
        },
        {
            icon: Brain, // Using Brain temporarily or maybe another icon like 'RefreshCw' if available, but Brain is fine or I can check import.
            title: "Controle de Escopo",
            description: "Evite o 'scope creep'. Gere aditivos de contrato (Change Requests) com um clique e aprove alterações de valor sem refazer a proposta."
        }
    ]

    return (
        <section className="py-32 px-8 md:px-16 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-16">
                    {features.map((feature, idx) => (
                        <div key={idx} className="space-y-6 group">
                            <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-serif italic">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
