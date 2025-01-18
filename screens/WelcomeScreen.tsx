import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Operaciones from './Operaciones';
import HistorialScreen from './Historial';
import Perfil from './Perfil';

const Tab = createBottomTabNavigator();

export default function WelcomeScreen({ route }: any) {
    const { cedula } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false, // Oculta la barra superior para todas las pestañas
            }}
        >
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
