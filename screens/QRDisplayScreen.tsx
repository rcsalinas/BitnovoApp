import { StackScreenProps } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ArrowBack from "../assets/images/arrow-back.svg";
import BitnovoPayLogo from "../assets/images/bit-icon.jpg";
import InfoIcon from "../assets/images/info-circle.svg";
import { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "QRDisplay">;

const QRDisplayScreen: React.FC<Props> = ({ navigation, route }) => {
	const { webUrl, amount, currency } = route.params;

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					style={{ marginLeft: 16, marginBottom: 8 }}
					onPress={navigation.goBack}
				>
					<ArrowBack width={28} height={28} />
				</TouchableOpacity>
			),
			title: "",
		});
	}, [navigation, currency]);

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.infoBox}>
					<InfoIcon
						width={18}
						height={18}
						style={{ marginRight: 8 }}
					/>
					<Text style={styles.infoText}>
						Escanea el QR y serás redirigido a la pasarela de pago
						de Bitnovo Pay.
					</Text>
				</View>
				<View style={styles.qrWrapper}>
					<QRCode
						value={webUrl}
						size={300}
						backgroundColor="white"
						color="#1A2B49"
						logo={BitnovoPayLogo}
						logoBackgroundColor="transparent"
					/>
				</View>
				<Text style={styles.amount}>
					{Number(amount).toLocaleString("es-ES", {
						style: "currency",
						currency: currency,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Text>
				<Text style={styles.subtitle}>
					Esta pantalla se actualizará automáticamente.
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		alignItems: "center",
		padding: 0,
		height: "100%",
	},
	card: {
		flex: 1,
		backgroundColor: "#035AC5",
		padding: 24,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	infoBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E6F0FA",
		borderRadius: 6,
		paddingVertical: 14,
		paddingHorizontal: 12,
		marginBottom: 20,
		width: "100%",
	},
	infoText: {
		color: "#1A2B49",
		fontSize: 13,
		flex: 1,
	},
	qrWrapper: {
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: 16,
		marginBottom: 24,
		width: 339,
		height: 324,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	amount: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 28,
		marginBottom: 20,
	},
	subtitle: {
		color: "#E6F0FA",
		fontSize: 14,
		textAlign: "center",
	},
});

export default QRDisplayScreen;
