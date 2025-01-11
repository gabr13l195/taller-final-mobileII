import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/Config';
import { ref, set } from 'firebase/database';

export default function RegisterScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [cedula, setCedula] = useState('');

    function register() {
        // Verificar que todos los campos estén completos
        if (!correo || !contraseña || !nombre || !edad || !ciudad || !cedula) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        // Verificar que el correo tenga un formato válido
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
            Alert.alert('Error', 'Correo electrónico inválido.');
            return;
        }

        // Verificar que la edad esté entre 1 y 100
        const edadNum = parseInt(edad, 10);
        if (isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
            Alert.alert('Error', 'La edad debe ser un número entre 1 y 100.');
            return;
        }

        // Crear un nuevo usuario con correo y contraseña
        createUserWithEmailAndPassword(auth, correo, contraseña)
            .then((userCredential) => {
                const user = userCredential.user;
                // Crear un nuevo usuario en la base de datos
                const usuariosRef = ref(db, 'usuarios/' + cedula);
                set(usuariosRef, {
                    nombre,
                    edad: edadNum,
                    ciudad,
                    correo,
                })
                    .then(() => {
                        Alert.alert('Éxito', 'Usuario registrado exitosamente');
                        navigation.navigate('Login');
                    })
                    .catch((error) => {
                        Alert.alert('Error', 'Hubo un problema al registrar al usuario: ' + error.message);
                    });
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'El correo electrónico ya está en uso.');
                } else {
                    Alert.alert('Error', 'Hubo un problema al registrar al usuario: ' + error.message);
                }
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                onChangeText={(texto) => setNombre(texto)}
                value={nombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Edad"
                onChangeText={(texto) => setEdad(texto)}
                value={edad}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Ciudad"
                onChangeText={(texto) => setCiudad(texto)}
                value={ciudad}
            />
            <TextInput
                style={styles.input}
                placeholder="Cédula"
                onChangeText={(texto) => setCedula(texto)}
                value={cedula}
                keyboardType="numeric"
            />
            <Button title="Registrar" onPress={register} />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Ya tienes cuenta? Inicia sesión aquí</Text>
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
