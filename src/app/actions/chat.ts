'use server'

import { createClient } from '@/lib/supabase/server'

export async function createChatSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // We only create DB sessions if user is logged in
    if (!user) return null

    const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id })
        .select()
        .single()

    if (error) throw error
    return data.id
}

export async function saveChatMessage(sessionId: string, role: 'system' | 'user', content: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('chat_messages')
        .insert({
            chat_session_id: sessionId,
            role,
            content
        })

    if (error) throw error
}
