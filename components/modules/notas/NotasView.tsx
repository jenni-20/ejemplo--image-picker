import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NotasCard from "./NotasCard";
import NoteModal from "./NotasModal";
import { Notas } from "./domain/nota.interface";

// inicializar una nueva notas
const addNotas: Notas = {
    id: "0",
    title: "",
    description: "",
    date: new Date(),
};

export function NotasView() {
    //estado para registro de notas
    const [notes, setNotes] = useState<Notas[]>([]);

    //estado para editar o crear nota
    //se va a usar para abrir o cerrar el modal
    const [selectedNote, setSelectedNote] = useState<Notas | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const addNote = () => {
        //inicializar una nueva nota
        setSelectedNote({
            id: "",
            title: "",
            description: "",
            date: new Date(), // fecha actual
        });
        setIsEditing(false);
    };

    const onCancelModal = () => {
        setSelectedNote(null);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        // cargar las notas cuando se ingrese a esta pantalla (efecto cuando se ingrese a la pantalla)
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (!user) {
            // Usuario no autenticado
            setLoading(false);
            return;
        }

        const { data: notesData, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id)
            .order("fecha", { ascending: false });

        console.log("Fetched notes raw:", { notesData, error });

        if (error) {
            Alert.alert("Error", "No se pudieron cargar las notas.");
        } else if (notesData && notesData.length > 0) {

            const mapped: Notas[] = notesData.map((nota: any) => ({
                id: nota.id,
                title: nota.title,
                description: nota.description,
                date: nota.fecha ?? null,
            }));

            console.log("mapped notes:", mapped);
            setNotes(mapped);
        } else {
            setNotes([]);
        }

        setLoading(false);
    };

    const handleEdit = (note: Notas) => {
        setSelectedNote(note);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Eliminar Nota", "¿Estás seguro de que quieres eliminar esta nota?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    const { error } = await supabase.from("notes").delete().eq("id", id);
                    if (error) {
                        Alert.alert("Error", "No se pudo eliminar la nota.");
                    } else {
                        fetchNotes();
                    }
                },
            },
        ]);
    };

    // guardar desde el modal
    const handleSave = async (updatedNote?: Notas) => {
        const note = updatedNote ?? selectedNote;
        if (!note) {
            Alert.alert("Error", "No hay nota seleccionada.");
            return;
        }

        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) {
            Alert.alert("Usuario no autenticado", "Inicia sesión para guardar notas.");
            return;
        }


        // Si es nueva nota, usamos ahora; si edita, intentamos usar la que trae.
        let fechaValue: string;

        if (note.date instanceof Date && !isNaN(note.date.getTime())) {
            fechaValue = note.date.toISOString();
        } else if (typeof note.date === "string" && note.date.trim() !== "" && !isNaN(new Date(note.date).getTime())) {
            fechaValue = new Date(note.date).toISOString();
        } else {
            fechaValue = new Date().toISOString();
        }

        const noteToSave = {
            title: note.title,
            description: note.description,
            fecha: fechaValue,
            user_id: user.id,
        };

        if (isEditing && note.id) {
            const { error } = await supabase
                .from("notes")
                .update(noteToSave)
                .eq("id", note.id);

            if (error) {
                console.log("Update error:", JSON.stringify(error));
                Alert.alert("Error", "No se pudo actualizar la nota.");
            }
        } else {
            const { data, error } = await supabase
                .from("notes")
                .insert(noteToSave)
                .select();

            console.log("Insert result:", { data, error });

            if (error) {
                Alert.alert("Error", "No se pudo guardar la nota.");
            }
        }

        setSelectedNote(null);
        fetchNotes();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis notitas </Text>

            {loading ? (
                <Text></Text>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={({ item }) => (
                        <NotasCard
                            nota={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.id!)}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tienes notas todavía.</Text>}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={addNote}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {selectedNote && (
                <NoteModal nota={selectedNote} onSave={handleSave} onCancel={onCancelModal} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#a3cbf3ff",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 70,
        color: "#2D3748",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0b9862ff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#6c757d",
    },
});
