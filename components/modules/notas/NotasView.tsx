import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import NotasCard from "./NotasCard";
import NoteModal from "./NotasModal";
import { Notas } from "./domain/nota.interface";
import { saveNote } from "./infraestruture/datasourse";

// inicializar una nueva notas
const addNotas: Notas = {
    id: "0",
    title: "",
    description: "",
    date: new Date(),
};

export function NotasView() {
    // nota que se va a editarr o crear
    // lo vamos a usar para abrir o cerrar el modal
    const [selectedNote, setSelectedNote] = useState<Notas | null>(null);

    //recibir la nota
    const onNotechanged = (nota: Notas) => {
        //agregar la nota a la colecion de notas
        //mandar a guardar la nota en la BD
        saveNote(nota)
            .then(result => {
                if (result) {
                    //si al nota es nueva agregar al estado de notas
                    if (result.id === "0") {
                        setNotes([
                            result,
                            ...notes,
                        ])
                    }
                }
            })
    }
    const [notes, setNotes] = useState<Notas[]>([
        {
            id: "1",
            title: "Ejemplo de nota",
            description: "Este es un ejemplo de nota",
            date: new Date(),
        }
    ]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);


    //carga las notas cuand se ingresa a esta pantalla
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (!user) {
            // Usuario no autenticado; mostrar la nota de ejemplo
            setLoading(false);
            return;
        }

        const { data: notesData, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id)
            .order("fecha", { ascending: false });

        if (error) {
            Alert.alert("Error", "No se pudieron cargar las notas.");
            // No sobrescribir notas en caso de error; mantener el ejemplo
        } else if (notesData && notesData.length > 0) {
            // Solo actualizar si hay notas en la base de datos
            setNotes(notesData as Notas[]);
        }
        // Si notesData está vacío, mantener la nota de ejemplo en el estado
        setLoading(false);
    };

    const handleAddNew = () => {
        setSelectedNote(addNotas);
        setIsEditing(false);
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

    const handleSave = async () => {
        if (!selectedNote) {
            Alert.alert("Error", "No hay nota seleccionada.");
            return;
        }

        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) {
            Alert.alert("Usuario no autenticado", "Inicia sesión para guardar notas.");
            return;
        }

        const noteToSave = {
            title: selectedNote.title,
            description: selectedNote.description,
            date: selectedNote.date,
            user_id: user.id,
        };

        if (isEditing) {

            const { error } = await supabase
                .from("notes")
                .update(noteToSave)
                .eq("id", selectedNote.id);
            if (error) Alert.alert("Error", "No se pudo actualizar la nota.");
        } else {

            const { error } = await supabase.from("notes").insert(noteToSave);
            if (error) Alert.alert("Error", "No se pudo guardar la nota.");
        }

        setSelectedNote(null);
        fetchNotes();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis notitas</Text>

            {loading ? (
                <Text>Cargando notas...</Text>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <NotasCard
                            nota={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}

                    ListEmptyComponent={<Text style={styles.emptyText}>No tienes notas todavía.</Text>}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddNew}>
                <Ionicons name="add"
                    size={30}
                    color="white" />
            </TouchableOpacity>

            {selectedNote && (
                <NoteModal
                    nota={selectedNote}
                    onSave={(updatedNote: Notas) => {
                        const handleSaveModal = async () => {
                            const { data } = await supabase.auth.getUser();
                            const user = data?.user;
                            if (!user) {
                                Alert.alert("Usuario no autenticado", "Inicia sesión para guardar notas.");
                                return;
                            }

                            const noteToSave = {
                                title: updatedNote.title,
                                description: updatedNote.description,
                                date: updatedNote.date,
                                user_id: user.id,
                            };

                            if (isEditing) {
                                const { error } = await supabase
                                    .from("notes")
                                    .update(noteToSave)
                                    .eq("id", updatedNote.id);
                                if (error) Alert.alert("Error", "No se pudo actualizar la nota.");
                            } else {
                                const { error } = await supabase.from("notes").insert(noteToSave);
                                if (error) Alert.alert("Error", "No se pudo guardar la nota.");
                            }

                            setSelectedNote(null);
                            fetchNotes();
                        };
                        handleSaveModal();
                    }}
                    onCancel={() => setSelectedNote(null)}
                />
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
        color: '#2D3748',
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
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d',
    },
});