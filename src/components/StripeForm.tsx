'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StripeForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)

        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard`,
            },
            redirect: 'if_required'
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else if (setupIntent && setupIntent.status === 'succeeded') {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="p-4 border border-border/40 bg-background/50">
                <PaymentElement />
            </div>

            <div className="space-y-6">
                <Button
                    type="submit"
                    variant="premium"
                    className="w-full h-20 text-base"
                    disabled={!stripe || loading}
                >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Validar Identidade'}
                </Button>

                <p className="text-[10px] text-center uppercase tracking-[0.3em] font-bold opacity-20">
                    Acesso imediato após validação
                </p>
            </div>
        </form>
    )
}
