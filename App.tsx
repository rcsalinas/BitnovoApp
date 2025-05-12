import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import PaymentCompletedScreen from "./screens/PaymentCompletedScreen";
import PaymentCreationScreen from "./screens/PaymentCreationScreen";
import PaymentShareScreen from "./screens/PaymentShareScreen";
import QRDisplayScreen from "./screens/QRDisplayScreen";
import { RootStackParamList } from "./types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="PaymentCreation">
				<Stack.Screen
					name="PaymentCreation"
					component={PaymentCreationScreen}
					options={{ title: "Crear Pago" }}
				/>
				<Stack.Screen
					name="PaymentShare"
					component={PaymentShareScreen}
					options={{ title: "Compartir Pago" }}
				/>
				<Stack.Screen
					name="QRDisplay"
					component={QRDisplayScreen}
					options={{ title: "Ver QR" }}
				/>
				<Stack.Screen
					name="PaymentCompleted"
					component={PaymentCompletedScreen}
					options={{ title: "Pago Completado" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
