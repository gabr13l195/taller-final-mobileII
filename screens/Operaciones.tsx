import { Alert, Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React, { useState } from 'react';

export default function Operaciones() {
    const [idOperacion, setIdOperacion] = useState('');
    const [monto, setMonto] = useState('');
    const [tipoOperacion, setTipoOperacion] = useState('');
    const [comentario, setComentario] = useState('');

    // Función para validar y ejecutar la operación
    function ejecutarOperacion() {
        // Verificar que todos los campos estén completos
        if (!idOperacion || !monto || !tipoOperacion || !comentario) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        // Verificar que el monto sea un número positivo
        if (isNaN(Number(monto)) || Number(monto) < 0) {
            Alert.alert('Error', 'El monto debe ser un valor numérico positivo.');
            return;
        }

        // Si el monto es mayor a $500, mostrar un mensaje de confirmación
        if (Number(monto) > 500) {
            Alert.alert(
                'Confirmación',
                'El monto de la operación es mayor a $500. ¿Deseas continuar?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Sí',
                        onPress: () => {
                            // Continuar con la operación
                            Alert.alert('Operación Ejecutada', 'La operación se ha ejecutado con éxito.');
                            // Aquí puedes guardar la operación en la base de datos o en el historial
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            // Si el monto es menor o igual a $500, ejecutar la operación directamente
            Alert.alert('Operación Ejecutada', 'La operación se ha ejecutado con éxito.');
            // Aquí puedes guardar la operación en la base de datos o en el historial
        }
    }

    return (
        <View style={styles.container}>
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
                placeholder="Tipo Operación"
                value={tipoOperacion}
                onChangeText={setTipoOperacion}
            />
            <TextInput
                style={styles.input}
                placeholder="Comentario"
                value={comentario}
                onChangeText={setComentario}
            />

            <Button title="Ejecutar" onPress={ejecutarOperacion} />
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
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
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
});
