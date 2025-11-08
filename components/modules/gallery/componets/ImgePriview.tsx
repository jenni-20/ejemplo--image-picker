// ImgenPriview.tsx
// Visualizador de imagen seleccionada / capturada

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";

type props = {
  uri: string;
  onCancel: () => void;
  onSave: (uri: string) => void;
  onNewImage: () => void;
};

export function ImagePreview({
  uri,
  onCancel,
  onSave,
  onNewImage,
}: props) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Sección de botones: cerrar, guardar, elegir otra */}
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onCancel} style={styles.buttonIcon}>
          <Ionicons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSave(uri)} style={styles.buttonIcon}>
          <Ionicons name="save-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onNewImage} style={styles.buttonIcon}>
          <Ionicons name="camera-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  buttons: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
});
