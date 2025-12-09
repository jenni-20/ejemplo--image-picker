import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
    uri: string;
    onCancel: () => void;
    newPhoto: () => void;
    onSave: (uri: string) => void;
};

export function ImagePreview({ uri, onCancel, newPhoto, onSave }: Props) {

    const uploadImage = async (uri: string) => {
        try {
            const fileData = await fetch(uri).then(res => res.arrayBuffer());

            // Subir directamente a la raíz del bucket
            const fileName = `public/photo-${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from("galeria")
                .upload(fileName, fileData, {
                    contentType: "image/jpg",

                });

            if (error) {
                console.error("Error al subir:", error.message);
            } else {
                console.log("Imagen subida correctamente:", fileName);

                // Obtener URL pública
                const { data } = supabase.storage
                    .from("galeria")
                    .getPublicUrl(fileName);

                console.log("URL pública obtenida:", data.publicUrl);
                const { data: insertData, error: dbError } = await supabase
                    .from("images")
                    .insert([{
                        id: fileName,
                        url: data.publicUrl
                    }]);

                // Guardar en el estado local (opcional)
                onSave(data.publicUrl);
            }
        } catch (error) {
            console.error("Error en uploadImage:", error);
        }
    };



    return (
        <View style={styles.container}>
            <Image style={styles.photo} source={{ uri }} />
            <View style={styles.buttons}>
                <TouchableOpacity onPress={onCancel}>
                    <Ionicons name="close" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => uploadImage(uri)}>
                    <Ionicons name="save-outline" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={newPhoto}>
                    <Ionicons name="camera-outline" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "black",
    },
    photo: {
        height: "100%",
        objectFit: "contain",
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "space-around",
    },
});