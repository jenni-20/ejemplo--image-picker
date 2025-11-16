import { router } from "expo-router"
import { TouchableOpacity, StyleSheet, View, Text } from "react-native"

export function HomeView() {
    //vista principal donde el usuario va a poder llavarlo a:
    //*link para ver la galeria
    //*limk para ver la cueta

    return (
        <View style={styles.container}>
            {/* BOTÓN CUENTA DE USUARIO (solo junté el Text con el onPress) */}
            <TouchableOpacity
                onPress={() => router.push('/account')}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Cuenta de usuario</Text>
            </TouchableOpacity>

            {/* BOTÓN GALERÍA */}
            <TouchableOpacity
                onPress={() => router.push('/gallery')}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Galería</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 60,
    },
    button: {
        backgroundColor: '#0b6cc8ff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
})
