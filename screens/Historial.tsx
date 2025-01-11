import React, { useEffect, useState } from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet,} from 'react-native';
import { auth, db } from '../config/Config';
import { ref, get } from 'firebase/database';

export default function Historial() {
    const [historial, setHistorial] = useState<any[]>([]);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const userHistorialRef = ref(db, `usuarios/${userId}/historialOperaciones`);

        get(userHistorialRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const operaciones = snapshot.val();
                    const historialArray = Object.keys(operaciones).map((key) => ({
                        id: key,
                        ...operaciones[key],
                    }));
                    setHistorial(historialArray);
                } else {
                    setHistorial([]); 
                }
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo cargar el historial: ${error.message}`);
            });
    }, [userId]);

    const mostrarComentario = (comentario: string) => {
        Alert.alert('Comentario de la operación', comentario);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => mostrarComentario(item.comentario)}
        >
            <Text style={styles.itemText}>
                ID: {item.idOperacion} - Monto: ${item.monto} - Tipo: {item.tipoOperacion}
            </Text>
            <Text style={styles.itemDate}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Operaciones</Text>
            {historial.length > 0 ? (
                <FlatList
                    data={historial}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <Text style={styles.noDataText}>No hay operaciones registradas.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    itemContainer: {
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDate: {
        fontSize: 14,
        color: '#555',
    },
});
