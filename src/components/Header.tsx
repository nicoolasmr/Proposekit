'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        // Check initial scroll
        handleScroll()

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`py-8 px-8 md:px-16 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-background/80 backdrop-blur-md border-b border-border/40 py-6'
                    : 'bg-transparent border-transparent py-12'
                }`}
        >
            <Link href="/" className="font-serif text-2xl tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2 italic">
                PROPOSE<span className="font-sans font-bold not-italic tracking-normal">KIT</span>
            </Link>
            <nav className="flex items-center gap-12">
                <Link href="/login" className="text-[10px] font-sans tracking-[0.3em] uppercase font-bold hover:opacity-50 transition-opacity">Login</Link>
                <Link href="/checkout">
                    <Button variant="premium-outline" size="sm">
                        Criar Proposta
                    </Button>
                </Link>
            </nav>
        </header>
    )
}
