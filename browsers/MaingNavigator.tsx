import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen'; // Asegúrate de importar WelcomeScreen
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegisterScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </Stack.Navigator>
    );
}

export default function Navegador() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}


