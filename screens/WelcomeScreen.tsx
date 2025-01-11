import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../config/Config';

export default function WelcomeScreen({ route, navigation }: any) {
    const { cedula } = route.params;
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        const usuariosRef = ref(db, 'usuarios/' + cedula);
        get(usuariosRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUsuario(snapshot.val());
                } else {
                    alert('No se encontraron datos del usuario.');
                }
            })
            .catch((error) => {
                alert('Error al cargar los datos del usuario: ' + error.message);
            });
    }, [cedula]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido {usuario ? usuario.nombre : 'Cargando...'}</Text>
            {usuario && (
                <View>
                    <Text style={styles.text}>Edad: {usuario.edad}</Text>
                    <Text style={styles.text}>Ciudad: {usuario.ciudad}</Text>
                </View>
            )}
            <Button title="Cerrar sesión" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    },
});
