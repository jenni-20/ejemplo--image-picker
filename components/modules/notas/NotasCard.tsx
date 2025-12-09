import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Notas } from "./domain/nota.interface";

type Props = {
    nota: Notas;
    onEdit: () => void;
    onDelete: () => void;
};

export default function NoteCard({ nota, onEdit, onDelete }: Props) {

    // Formatear fecha de manera segura
    let formattedDate = "";

    if (nota.date) {
        const d = nota.date instanceof Date ? nota.date : new Date(nota.date as any);

        if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{nota.title}</Text>
                {/* ANTES: new Date(nota.date).toLocaleDateString() */}
                <Text style={styles.date}>{formattedDate}</Text>
            </View>

            <Text style={styles.description} numberOfLines={3}>
                {nota.description}
            </Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 4,
    },
    date: {
        fontSize: 12,
        color: "#9ca3af",
        marginLeft: 12,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
        gap: 8,
        opacity: 0.95,
    },
    editBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#4dabf7",
        borderRadius: 6,
        marginRight: 8,
    },
    deleteBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#ff6b6b",
        borderRadius: 6,
    },
    editText: { color: "#fff", fontWeight: "bold" },
    deleteText: { color: "#fff", fontWeight: "bold" },
});
