import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, TextInput, Text, ActivityIndicator } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Avatar } from './Avatar';

type Props = {
    session: Session;
};

export default function Account({ session }: Props) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            getProfile();
        }
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No hay usuario en la sesión');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', session.user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username || '');
                setWebsite(data.website || '');
                setAvatarUrl(data.avatar_url || null);
            }
        } catch (error: any) {
            console.log(error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No hay usuario en la sesión');

            const updates = {
                id: session.user.id,
                username,
                website,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            Alert.alert('Éxito', 'Perfil actualizado');
        } catch (error: any) {
            console.log(error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar
                    size={120}
                    url={avatarUrl}
                    onUpload={(url: string) => {
                        setAvatarUrl(url);
                        updateProfile();
                    }}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <Text style={styles.label}>Correo</Text>
                    <Text style={styles.value}>{session.user.email}</Text>

                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Escribe tu usuario"
                    />

                    <Text style={styles.label}>Sitio web</Text>
                    <TextInput
                        style={styles.input}
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="https://..."
                    />

                    <TouchableOpacity style={styles.buttonPrimary} onPress={updateProfile}>
                        <Text style={styles.buttonText}>Guardar perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSecondary} onPress={signOut}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
        gap: 12,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    value: {
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 12,
    },
    buttonPrimary: {
        backgroundColor: '#3b82f6',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonSecondary: {
        backgroundColor: '#ef4444',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
