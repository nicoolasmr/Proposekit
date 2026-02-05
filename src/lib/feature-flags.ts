import { createClient } from './supabase/server'

export async function isFeatureEnabled(userId: string, key: string): Promise<boolean> {
    // If no user, cannot check feature flags (safe default: false)
    if (!userId) return false

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feature_flags')
        .select('enabled')
        .eq('user_id', userId)
        .eq('key', key)
        .single()

    if (error || !data) {
        return false
    }

    return data.enabled === true
}

export async function getFeatureFlags(userId: string): Promise<Record<string, boolean>> {
    if (!userId) return {}

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feature_flags')
        .select('key, enabled')
        .eq('user_id', userId)

    if (error || !data) {
        return {}
    }

    return data.reduce((acc, curr) => {
        acc[curr.key] = curr.enabled
        return acc
    }, {} as Record<string, boolean>)
}
