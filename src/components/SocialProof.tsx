import { Zap, Shield, Globe, Award } from 'lucide-react'

export function SocialProof() {
    const brands = [
        { name: "Global Scale", icon: Globe },
        { name: "Secure Data", icon: Shield },
        { name: "Fast Close", icon: Zap },
        { name: "Top Rated", icon: Award },
    ]

    return (
        <section className="py-12 border-y border-border/40 bg-secondary/5">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <p className="text-center text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground opacity-60 mb-8">
                    Trusted by high-authority freelance networks
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {brands.map((Brand, idx) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <Brand.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-serif text-lg italic text-muted-foreground group-hover:text-primary transition-colors">
                                {Brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
