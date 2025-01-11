import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import Operaciones from './Operaciones';
import HistorialScreen from './Historial'; 
import Perfil from './Perfil';

const Tab = createBottomTabNavigator();

export default function WelcomeScreen({ route }: any) {
    const { cedula } = route.params;

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Operaciones"
                component={Operaciones}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" color={color} size={size} /> 
                    ),
                }}
            />

            <Tab.Screen
                name="Historial"
                component={HistorialScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="card" color={color} size={size} /> 
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ cedula }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} /> 
                    ),
                }}
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
