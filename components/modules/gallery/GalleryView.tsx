//galeria
//botón para añadir la imagen

import { StyleSheet, View, FlatList, Image, Pressable, Alert, Text, ImageBackground } from "react-native";
import { ImagePicker } from "./componets/ImagePicker";
import { useState } from "react";

export function GalleryView() {
  //coleccion de imagenes(estados)
    const [images, setImages] = useState<string[]>([]);

  //recibir la nueva imagen
const onAdded = (uri: string) => {
    //Agregar la nueva imagen a la coleccion
    setImages([uri, ...images]);
};

  //funcion para eliminar imagen (opcional)
const onRemove = (uri: string) => {
    Alert.alert("Eliminar imagen", "¿Quieres quitar esta imagen?", [
    { text: "Cancelar", style: "cancel" },
    {
        text: "Eliminar",
        style: "destructive",
        onPress: () => setImages(images.filter((u) => u !== uri)),
    },
    ]);
};

return (
    <ImageBackground
    source={{
        uri: "https://i.pinimg.com/736x/d5/df/0e/d5df0e61f9e15f0c9b060c80a9e93175.jpg",
        }}
        style={styles.background}
        >
        <View style={styles.container}>
        {/* selector de imagen */}
        <ImagePicker onImageSelected={onAdded} />

            {/* implemetar la galeria (flatList) */}
            <FlatList
            data={images}
            keyExtractor={(uri, i) => uri + i}
            numColumns={4}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <Pressable style={styles.card} onLongPress={() => onRemove(item)}>
                <Image source={{ uri: item }} style={styles.img} />
                </Pressable>
            )}

            />
            </View>
        </ImageBackground>
    );
}

const SIZE = 100;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        paddingTop: 60,
        paddingHorizontal: 16,
        flex: 1,
    },
    listContent: {
        paddingTop: 12,
        paddingBottom: 24,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 10,
    },
    card: {
        width: SIZE,
        height: SIZE,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#f3f4f6aa", 
    },
    img: {
        width: "100%",
        height: "100%",
    },
    emptyText: {
        textAlign: "center",
        color: "#ffffff",
        marginTop: 20,
        fontWeight: "600",
    },
    });
//