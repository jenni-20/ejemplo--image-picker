import Account from "@/components/modules/auth/Account"
import Login from "@/components/modules/auth/Login"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export default function AccountScreen() {
    //Acceder a la sesion
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    //si no hay sesion, mostrar el login

    if (!session) {
        return <Login />
    }
    
    return (
        <Account
            session={session}

        />
    );
}