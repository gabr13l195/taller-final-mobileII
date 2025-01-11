import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/Config';
import { ref, get } from 'firebase/database';

export default function LoginScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    function login() {
        // Verificar que ambos campos estén completos
        if (!correo || !contraseña) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        // Intentar iniciar sesión con las credenciales proporcionadas
        signInWithEmailAndPassword(auth, correo, contraseña)
            .then(() => {
                // Buscar usuario por correo en la base de datos
                const usuariosRef = ref(db, 'usuarios');
                get(usuariosRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const usuarios = snapshot.val();
                            const cedulaUsuario = Object.keys(usuarios).find(
                                (cedula) => usuarios[cedula].correo === correo
                            );

                            if (cedulaUsuario) {
                                // Navegar a WelcomeScreen con la cédula
                                navigation.navigate('Welcome', { cedula: cedulaUsuario });
                            } else {
                                Alert.alert('Error', 'No se encontró la cédula del usuario.');
                            }
                        } else {
                            Alert.alert('Error', 'No hay usuarios registrados.');
                        }
                    })
                    .catch((error) => {
                        Alert.alert('Error', error.message);
                    });
            })
            .catch((error) => {
                // Verificar el error de Firebase y mostrar mensajes personalizados
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error', 'Correo electrónico inválido.');
                } else if (error.code === 'auth/wrong-password') {
                    Alert.alert('Error', 'Contraseña incorrecta.');
                } else {
                    Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta de nuevo.');
                }
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                onChangeText={(texto) => setCorreo(texto)}
                value={correo}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                onChangeText={(texto) => setContraseña(texto)}
                value={contraseña}
                secureTextEntry
            />
            <Button title="Login" onPress={login} />
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.linkText}>No tienes cuenta? Regístrate aquí</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    linkText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 20,
    },
});

