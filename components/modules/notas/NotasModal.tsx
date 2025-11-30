import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Notas } from "./domain/nota.interface";

type Props = {
    nota: Notas | null;
    onSave: (nota: Notas) => void;
    onCancel: () => void;
};

export default function NoteModal({ nota, onSave, onCancel }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        if (nota) {
            setTitle(nota.title);
            setDescription(nota.description);
            setDate(new Date(nota.date));
        }
    }, [nota]);

    if (!nota) {
        return null;
    }

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert("Error", "El título no puede estar vacío.");
            return;
        }

        const updatedNota: Notas = {
            ...nota,
            title,
            description,
            date,
        };

        onSave(updatedNota);
    };

    return (
        <Modal visible={!!nota} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>
                        {nota.id === "0" ? "Agregar nueva nota" : "Editar Nota"}
                    </Text>

                    <TextInput
                        placeholder="Título"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="Descripción"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={5}
                        style={[styles.input, { minHeight: 100 }]}
                        placeholderTextColor="#999"
                    />
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBox: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 14,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#f1f3f5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        color: "#000",
        fontFamily: "System",
    },
    dateSection: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: "600",
        color: "#2D3748",
    },
    dateBtn: {
        backgroundColor: "#e9ecef",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    dateBtnText: {
        color: "#495057",
        fontWeight: "600",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 16,
        gap: 10,
    },
    cancelBtn: {
        backgroundColor: "#ec3b3bff",
        padding: 10,
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    saveBtn: {
        backgroundColor: "#0aa91dff",
        padding: 10,
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    cancelText: { color: "#000", fontWeight: "bold" },
    saveText: { color: "#fff", fontWeight: "bold" },
});