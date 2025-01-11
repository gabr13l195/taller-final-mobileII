import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView,ScrollView,} from 'react-native';
import { auth, db } from '../config/Config';
import { ref, push, get, update, remove } from 'firebase/database';

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

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                <Button 
                    title="Ejecutar" 
                    onPress={validarYGuardar} 
                    color={"#54E346"}/>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
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
});
