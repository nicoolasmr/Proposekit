'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

interface StripeFormProps {
    clientSecret: string
    onSuccess: () => void
}

export default function StripeForm({ clientSecret, onSuccess }: StripeFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)

        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success('Cartão validado com sucesso!')
            // Here we would call an API to save the card_last4 to our DB
            // but the SetupIntent usually handles the PM attachment on Stripe's side.
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 border-black/10 rounded-none bg-secondary/30">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#1A1A1A',
                                '::placeholder': { color: '#A0A0A0' },
                                fontFamily: 'var(--font-geist-sans), sans-serif',
                            },
                        },
                    }}
                />
            </Card>
            <Button
                type="submit"
                disabled={!stripe || loading}
                className="w-full premium-button h-16"
            >
                {loading ? 'Confirmando...' : 'Confirmar dados de pagamento'}
            </Button>
            <p className="text-[10px] uppercase tracking-widest text-center text-muted-foreground opacity-50">
                Liberação: 1 crédito gratuito
            </p>
        </form>
    )
}
