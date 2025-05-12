import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
	Button,
	Clipboard,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { RootStackParamList } from "../types/navigation";

type PaymentShareScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"PaymentShare"
>;
type Props = {
	navigation: PaymentShareScreenNavigationProp;
	route: { params: { paymentId: string; webUrl: string; amount: string } };
};

const PaymentShareScreen: React.FC<Props> = ({ navigation, route }) => {
	const { paymentId, webUrl, amount } = route.params;
	const [paymentStatus, setPaymentStatus] = useState<string>("Pendiente");
	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		// WebSocket for listening to payment status updates
		const newSocket = new WebSocket(
			`wss://payments.pre-bnvo.com/ws/merchant/${paymentId}`
		);
		setSocket(newSocket);

		newSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.status === "completed") {
				setPaymentStatus("Completado");
				// Navigate to the completed screen
				navigation.navigate("PaymentCompleted");
			}
		};

		return () => {
			newSocket.close();
		};
	}, [paymentId, navigation]);

	const sharePaymentLink = async () => {
		try {
			await Share.share({
				message: `¡He realizado un pago! Consulta aquí: ${webUrl}`,
			});
		} catch (error) {
			console.log("Error sharing:", error);
		}
	};

	const copyToClipboard = async () => {
		await Clipboard.setString(webUrl);
		alert("Enlace copiado al portapapeles");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Solicitud de pago</Text>
			<Text style={styles.amount}>{amount} €</Text>
			<Text style={styles.link}>
				Comparte el enlace de pago con el cliente:
			</Text>

			<View style={styles.linkContainer}>
				<Text style={styles.linkText}>{webUrl}</Text>
				<TouchableOpacity onPress={copyToClipboard}>
					<Text style={styles.copyButton}>📋</Text> {/* Copy icon */}
				</TouchableOpacity>
			</View>

			<Button
				title="Enviar por correo electrónico"
				onPress={sharePaymentLink}
			/>
			<Button
				title="Enviar a número de WhatsApp"
				onPress={sharePaymentLink}
			/>
			<Button
				title="Compartir con otras aplicaciones"
				onPress={sharePaymentLink}
			/>

			<TouchableOpacity
				style={styles.newRequestButton}
				onPress={() => navigation.navigate("PaymentCreation")}
			>
				<Text style={styles.newRequestText}>Nueva solicitud</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	amount: {
		fontSize: 20,
		marginBottom: 10,
	},
	link: {
		fontSize: 16,
		marginBottom: 10,
	},
	linkContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	linkText: {
		flex: 1,
		fontSize: 16,
	},
	copyButton: {
		fontSize: 20,
		marginLeft: 10,
	},
	newRequestButton: {
		marginTop: 20,
		padding: 10,
		backgroundColor: "#D9E8FF",
		borderRadius: 5,
	},
	newRequestText: {
		textAlign: "center",
		fontSize: 16,
	},
});

export default PaymentShareScreen;
