import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Get or Create Stripe Customer
        const { data: billing } = await supabase
            .from('billing_customers')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single()

        let customerId = billing?.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_user_id: user.id }
            })
            customerId = customer.id

            await supabase
                .from('billing_customers')
                .insert({ user_id: user.id, stripe_customer_id: customerId })
        }

        // 2. Create SetupIntent
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
        })

        return NextResponse.json({
            clientSecret: setupIntent.client_secret,
        })
    } catch (error: any) {
        console.error('SetupIntent Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
