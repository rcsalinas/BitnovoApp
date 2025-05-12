import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "QRDisplay">;

const QRDisplayScreen: React.FC<Props> = ({ route }) => {
	const { webUrl } = route.params;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Código QR para Pago</Text>
			<QRCode
				value={webUrl}
				size={200}
				backgroundColor="white"
				color="black"
			/>
			<Text style={styles.description}>
				Escanea el código QR para realizar el pago.
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		marginTop: 16,
		textAlign: "center",
	},
});

export default QRDisplayScreen;
