//selector de imagen
/**
 * mostrar apciones de origen:
 *  -desde la galeria
 *  -desde la camara
 * si el origen es camara, lanzar el componente de camara
 * si el origen es galeria, seleccionar imagen
 *
 *si se tiene imagen seleccionada / capturada
--abrir el visualizador de imagen

cuando se acepte (guardar), retornar la imagen al GalleryView
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ExpoImagePicker from 'expo-image-picker';
import { ImagePreview } from "./ImgePriview";
import { CamaraComponent } from "./CamaraCompone";

type props ={
    onImageSelected:(uri:string)=>void;
}

export function ImagePicker({onImageSelected} :props) {
    const [open, setOpen] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);


    const pickImage = async () => {
        const perm = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== "granted") {
        Alert.alert("Permiso denegado", "Activa el acceso a la galería.");
        return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
        setImage(result.assets[0].uri);
    }
};

const onNewImage = () => {
    setImage(null);
    };

    const onSave = (uri: string) => {
    onImageSelected(uri);

    Alert.alert('Foto guardada');
    setOpen(false);
    setImage(null);
    setCameraOpen(false);
    };


    const onTakedPicture = (uri:string) => {
    setCameraOpen(false);
    setImage(uri);
    };


    const openCamera = async () => {
    const perm = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") {
        Alert.alert("Permiso denegado", "Activa el acceso a la cámara.");
        return;
    }
    setCameraOpen(true);
    };

    const renderMenu = (
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.title}>Origen de la imagen</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openCamera}>
                <Text style={styles.button}>Camara</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
                <Text style={styles.button}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    );
    return (
    <>
    <TouchableOpacity onPress={()=> setOpen(true)}>
        <Ionicons name="camera-outline" size={32} color="green" />
        </TouchableOpacity>
        <Modal visible={open} 
        transparent 
        animationType="slide">
        {/* si no hay imagen, y camara cerrada, mostrar menu */}
        {!image && !cameraOpen ? renderMenu : null }
        {/* si la camara esta abierta, mostrar CamaraComponent */}
        {cameraOpen ? (
            <CamaraComponent
            onCancel ={() => setCameraOpen(false)}
            onTakedPicture={onTakedPicture}
        />
        ) : null}

        {/* si hay imagen seleccionada, mostrar el preview */}
        {!!image ? (
        <ImagePreview
            uri={image}
            onCancel={() => setImage(null)}
            onSave={onSave}
            newPhoto={onNewImage}
            />
            ) : null}
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalContainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    alignItems: 'center',
    },
    modalContent: {
    backgroundColor: '#f0f0f0',
    width: '80%',
    padding: 20,
    display: 'flex',
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    },
    title:{
    fontSize: 24,
    fontWeight: '700',
    },
    buttonContainer:{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    },
    button: {
    color: 'darkblue',
    fontWeight: '700',
    fontSize: 22,
    },
    cancelButton: {
    color: 'red',
    fontWeight: '700',
    fontSize: 20,
    },
});
