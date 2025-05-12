import { StackScreenProps } from "@react-navigation/stack";

import WhatsappShareInput from "@/components/WhatsappShareInput";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	Clipboard,
	Linking,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import ExportIcon from "../assets/images/export.svg";
import LinkIcon from "../assets/images/link.svg";
import MoneyTime from "../assets/images/money-time.svg";
import ScanBarcode from "../assets/images/scan-barcode.svg";
import SmsIcon from "../assets/images/sms.svg";
import WalletAdd from "../assets/images/wallet-add.svg";
import { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "PaymentShare">;

const FIAT_CURRENCIES = [
	{ code: "EUR", name: "Euro", symbol: "€" },
	{ code: "USD", name: "US Dollar", symbol: "$" },
	{ code: "GBP", name: "British Pound", symbol: "£" },
];

const getCurrencySymbol = (code: string | null) => {
	const found = FIAT_CURRENCIES.find((c) => c.code === code);
	return found ? found.symbol : "€";
};

const PaymentShareScreen: React.FC<Props> = ({ navigation, route }) => {
	const { paymentId, webUrl, amount, currency } = route.params;
	const [paymentStatus, setPaymentStatus] = useState<string>("Pendiente");

	useEffect(() => {
		const newSocket = new WebSocket(
			`wss://payments.pre-bnvo.com/ws/merchant/${paymentId}`
		);

		newSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.status === "completed") {
				setPaymentStatus("Completado");
				navigation.navigate("PaymentCompleted", {
					amount: data.amount,
					currency: data.currency,
				});
			}
		};

		return () => {
			newSocket.close();
		};
	}, [paymentId, navigation]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => null,
		});
	}, [navigation, currency]);

	const sharePaymentLink = async (message: string) => {
		try {
			await Share.share({ message });
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
			{/* Card */}
			<View style={styles.card}>
				<View
					style={{
						alignItems: "center",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						gap: 10,
					}}
				>
					<MoneyTime width={58} height={58} />
					<View>
						<Text style={styles.cardTitle}>Solicitud de pago</Text>
						<Text style={styles.cardAmount}>
							{Number(amount).toLocaleString("es-ES", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}{" "}
							{getCurrencySymbol(currency)}
						</Text>
					</View>
				</View>
				<Text style={styles.cardSubtitle}>
					Comparte el enlace de pago con el cliente
				</Text>
			</View>

			{/* Link row */}
			<View style={styles.linkRow}>
				<TouchableOpacity
					style={styles.linkInput}
					activeOpacity={0.8}
					onPress={copyToClipboard}
				>
					<LinkIcon
						width={20}
						height={20}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={styles.linkText}
						numberOfLines={1}
						ellipsizeMode="middle"
					>
						{webUrl}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.barCodeButton}
					onPress={() =>
						navigation.navigate("QRDisplay", {
							amount: amount,
							webUrl: webUrl,
							identifier: paymentId,
							currency: currency,
						})
					}
				>
					<ScanBarcode width={24} height={24} />
				</TouchableOpacity>
			</View>

			{/* Share buttons */}
			<TouchableOpacity
				style={styles.shareButton}
				onPress={() => {
					const subject = encodeURIComponent("Solicitud de pago");
					const body = encodeURIComponent(
						`¡He solicitado un pago! Consulta aqui: ${webUrl}`
					);
					const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
					Linking.openURL(mailtoUrl);
				}}
			>
				<SmsIcon width={20} height={20} style={{ marginRight: 12 }} />
				<Text style={styles.shareButtonText}>
					Enviar por correo electrónico
				</Text>
			</TouchableOpacity>

			<WhatsappShareInput webUrl={webUrl} />

			<TouchableOpacity
				style={styles.shareButton}
				onPress={() =>
					sharePaymentLink(
						`¡He realizado un pago! Consulta aquí: ${webUrl}`
					)
				}
			>
				<ExportIcon
					width={20}
					height={20}
					style={{ marginRight: 12 }}
				/>
				<Text style={styles.shareButtonText}>
					Compartir con otras aplicaciones
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.newRequestButton}
				onPress={() => navigation.navigate("PaymentCreation")}
			>
				<Text style={styles.newRequestText}>Nueva solicitud</Text>
				<WalletAdd width={20} height={20} style={{ marginLeft: 8 }} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingBottom: 40,
		backgroundColor: "#fff",
	},
	card: {
		backgroundColor: "#F6F8FB",
		borderRadius: 16,
		alignItems: "center",
		marginBottom: 24,
		height: 114,
		justifyContent: "center",
	},
	cardTitle: {
		fontSize: 14,
		color: "#647184",
		fontWeight: "400",
		marginBottom: 4,
	},
	cardAmount: {
		fontSize: 32,
		color: "#002859",
		fontWeight: "700",
		marginBottom: 4,
	},
	cardSubtitle: {
		fontSize: 14,
		color: "#647184",
		marginTop: 4,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	linkInput: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E3E6ED",
		borderRadius: 8,
		paddingHorizontal: 12,
		height: 56,
		marginRight: 8,
	},
	linkText: {
		flex: 1,
		fontSize: 15,
		color: "#1A2B49",
	},
	barCodeButton: {
		width: 56,
		height: 56,
		borderRadius: 8,
		backgroundColor: "#035AC5",
		alignItems: "center",
		justifyContent: "center",
	},
	shareButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E3E6ED",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginBottom: 12,
		height: 56,
	},
	shareButtonText: {
		fontSize: 15,
		color: "#1A2B49",
		fontWeight: "500",
	},
	newRequestButton: {
		marginTop: "auto",
		backgroundColor: "#F6F8FB",
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	newRequestText: {
		color: "#035AC5",
		fontWeight: "700",
		fontSize: 16,
	},
});

export default PaymentShareScreen;
