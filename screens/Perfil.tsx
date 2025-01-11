import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ref, get } from 'firebase/database';
import { auth, db } from '../config/Config';

export default function PerfilScreen() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;

                if (user && user.email) {
                    const usuariosRef = ref(db, 'usuarios');
                    const snapshot = await get(usuariosRef);

                    if (snapshot.exists()) {
                        const usuarios = snapshot.val();
                        const userCedula = Object.keys(usuarios).find(
                            (cedula) => usuarios[cedula].correo === user.email
                        );

                        if (userCedula) {
                            setUserData({
                                ...usuarios[userCedula],
                                cedula: userCedula,
                            });
                        } else {
                            Alert.alert('Error', 'No se encontró información del usuario.');
                        }
                    } else {
                        Alert.alert('Error', 'No hay usuarios registrados en la base de datos.');
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando información del usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Nombre: </Text>
                    {userData.nombre}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Correo: </Text>
                    {userData.correo}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Edad: </Text>
                    {userData.edad}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Ciudad: </Text>
                    {userData.ciudad}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Cédula: </Text>
                    {userData.cedula}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#AAD3DF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        width: '100%',
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    label: {
        fontWeight: 'bold',
        color: '#000',
    },
    loadingText: {
        fontSize: 18,
        color: '#777',
    },
});
