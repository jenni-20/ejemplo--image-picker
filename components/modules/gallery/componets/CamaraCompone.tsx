// CamaraComponent.tsx
// Visualizar la camara y tomar la foto
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { View, Button, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* Props:
  - onCancel
  - onTakedPicture(uri:string)
*/
type Props = {
  onCancel: () => void;
  onTakedPicture: (uri: string) => void;
};

export function CamaraComponent({ onCancel, onTakedPicture }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const ref = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Se requiere acceso a la cámara</Text>
        <Button onPress={requestPermission} title="Autorizar cámara" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    // Si la cámara aún no montó
    if (!ref.current) return;
    const photo = await ref.current.takePictureAsync({
      quality: 1, // opcional: máxima calidad
      skipProcessing: true, // opcional: más rápido en Android
    });

    // Enviar al componente padre la uri del archivo
    if (photo?.uri) {
      onTakedPicture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={ref} style={styles.camera} facing={facing} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onCancel} style={styles.button}>
          <Ionicons name="close" size={35} color="#d81111ff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={takePicture} style={styles.button}>
          <Ionicons name="camera" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
          <Ionicons name="camera-reverse-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
