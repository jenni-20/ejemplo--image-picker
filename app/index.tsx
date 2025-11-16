import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { HomeView } from '@/components/modules/home/HomeView'
import Login from '@/components/modules/auth/Login'

export default function App() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <View>
            {session && session.user ?
                <HomeView /> : <Login />}
        </View>
    )
};