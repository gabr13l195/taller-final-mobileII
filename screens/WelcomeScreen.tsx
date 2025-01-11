import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { db } from '../config/Config';
import { ref, get } from 'firebase/database';
import Operaciones from './Operaciones';

const Tab = createBottomTabNavigator();

function OperacionesScreen() {
    return (
        <View style={styles.screenContainer}>
            <Text>Operaciones</Text>
        </View>
    );
}

function HistorialScreen() {
    return (
        <View style={styles.screenContainer}>
            <Text>Historial</Text>
        </View>
    );
}

function PerfilScreen({ route }: any) {
    const { cedula } = route.params;
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        // Obtener los datos del usuario desde la base de datos
        const usuariosRef = ref(db, 'usuarios');
        get(usuariosRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const usuarios = snapshot.val();
                    const usuario = Object.keys(usuarios).find(
                        (key) => usuarios[key].cedula === cedula
                    );

                    if (usuario) {
                        setUserData(usuarios[usuario]);
                    } else {
                        Alert.alert('Error', 'Usuario no encontrado.');
                    }
                } else {
                    Alert.alert('Error', 'No hay usuarios registrados.');
                }
            })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
    }, [cedula]);

    return (
        <View style={styles.screenContainer}>
            {userData ? (
                <>
                    <Text>Nombre: {userData.nombre}</Text>
                    <Text>Correo: {userData.correo}</Text>
                    <Text>Edad: {userData.edad}</Text>
                    <Text>Ciudad: {userData.ciudad}</Text>
                    <Text>Cédula: {userData.cedula}</Text>
                </>
            ) : (
                <Text>Cargando información...</Text>
            )}
        </View>
    );
}

export default function WelcomeScreen({ route, navigation }: any) {
    const { cedula } = route.params;

    return (
        <Tab.Navigator>
            <Tab.Screen name="Operaciones" component={Operaciones} />
            <Tab.Screen name="Historial" component={HistorialScreen} />
            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                initialParams={{ cedula }} // Pasamos la cédula del usuario a la pantalla de perfil
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
});

