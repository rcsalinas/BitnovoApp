import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../types/navigation";

type PaymentCompletedScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"PaymentCompleted"
>;
type Props = {
	navigation: PaymentCompletedScreenNavigationProp;
	route: { params: { amount: string; currency: string } };
};

const PaymentCompletedScreen: React.FC<Props> = ({ navigation, route }) => {
	const { amount, currency } = route.params;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>¡Pago Completado!</Text>
			<Text style={styles.message}>
				Tu pago de {amount} {currency} ha sido recibido con éxito.
			</Text>

			<Button
				title="Volver a Crear Pago"
				onPress={() => navigation.navigate("PaymentCreation")}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	message: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
});

export default PaymentCompletedScreen;
