import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { auth, db } from '../config/Config';
import { ref, push, get, remove } from 'firebase/database';

export default function Operaciones({ navigation }: any) {
    const [idOperacion, setIdOperacion] = useState('');
    const [monto, setMonto] = useState('');
    const [tipoOperacion, setTipoOperacion] = useState('');
    const [comentario, setComentario] = useState('');

    const userId = auth.currentUser?.uid;

    const guardarOperacionEnFirebase = async () => {
        if (!userId) {
            Alert.alert('Error', 'No se pudo identificar al usuario.');
            return;
        }

        try {
            const userHistorialRef = ref(db, `usuarios/${userId}/historialOperaciones`);
            const snapshot = await get(userHistorialRef);
            const historialActual = snapshot.val() || {};

            const operacionesKeys = Object.keys(historialActual);
            if (operacionesKeys.length >= 10) {
                const oldestKey = operacionesKeys[0];
                await remove(ref(db, `usuarios/${userId}/historialOperaciones/${oldestKey}`));
            }

            const nuevaOperacion = {
                idOperacion,
                monto: parseFloat(monto),
                tipoOperacion,
                comentario,
                fecha: new Date().toISOString(),
            };

            await push(userHistorialRef, nuevaOperacion);
            navigation.navigate('Historial');
            Alert.alert('Éxito', 'Operación guardada correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la operación.');
        }
    };

    function validarYGuardar() {
        if (!idOperacion || !monto || !tipoOperacion || !comentario) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        const montoNumerico = parseFloat(monto);
        if (isNaN(montoNumerico)) {
            Alert.alert('Error', 'El monto debe ser un número válido.');
            return;
        }

        if (montoNumerico < 0) {
            Alert.alert('Error', 'El monto no puede ser negativo.');
            return;
        }

        if (montoNumerico > 500) {
            Alert.alert(
                'Monto alto',
                'El monto supera los $500. ¿Deseas continuar?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Continuar', onPress: guardarOperacionEnFirebase },
                ]
            );
            return;
        }

        guardarOperacionEnFirebase();
    }

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Login'); // Redirige al inicio de sesión
            })
            .catch((error) => {
                Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
            });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Operaciones</Text>

                <TextInput
                    style={styles.input}
                    placeholder="ID Operación"
                    value={idOperacion}
                    onChangeText={setIdOperacion}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Monto"
                    value={monto}
                    onChangeText={setMonto}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tipo de Operación"
                    value={tipoOperacion}
                    onChangeText={setTipoOperacion}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Comentario"
                    value={comentario}
                    onChangeText={setComentario}
                />

                {/* Botón de ejecutar */}
                <TouchableOpacity style={styles.button} onPress={validarYGuardar}>
                    <Text style={styles.buttonText}>Ejecutar</Text>
                </TouchableOpacity>

                {/* Botón de cerrar sesión */}
                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
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
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#54E346', // Verde para el botón principal
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: '#FF5C5C', // Rojo para el botón de logout
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
