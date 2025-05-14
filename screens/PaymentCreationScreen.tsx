import FiatDropdown from "@/components/FiatDropdown";
import FiatsModal from "@/components/FiatsModal";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { RootStackParamList } from "../types/navigation";

type PaymentCreationScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"PaymentCreation"
>;
type Props = { navigation: PaymentCreationScreenNavigationProp };

const FIAT_CURRENCIES = [
	{ code: "EUR", name: "Euro", symbol: "€" },
	{ code: "USD", name: "US Dollar", symbol: "$" },
	{ code: "GBP", name: "British Pound", symbol: "£" },
];

const getCurrencySymbol = (code: string | null) => {
	const found = FIAT_CURRENCIES.find((c) => c.code === code);
	return found ? found.symbol : "€";
};

const PaymentCreationScreen: React.FC<Props> = ({ navigation }) => {
	const [amount, setAmount] = useState("");
	const [concept, setConcept] = useState("");
	const [currency, setCurrency] = useState<string>("EUR");
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Importe a pagar",
			headerTitleAlign: "center",
			headerRight: () => (
				<FiatDropdown
					handleMakeModalVisible={() => setModalVisible(true)}
					currency={currency}
				/>
			),
			headerLeft: () => null,
		});
	}, [navigation, currency]);

	const handleCurrencySelect = (code: string) => {
		setCurrency(code);
		setModalVisible(false);
	};

	const createPayment = async () => {
		if (!amount || !concept || !currency) {
			Alert.alert(
				"Faltan datos",
				"Introduce importe, concepto y divisa."
			);
			return;
		}

		setLoading(true);

		const payload = new FormData();
		payload.append("expected_output_amount", amount);
		payload.append("fiat", currency);
		payload.append("notes", concept);

		try {
			const response = await fetch(
				"https://payments.pre-bnvo.com/api/v1/orders/",
				{
					method: "POST",
					headers: {
						"X-Device-Id": "d497719b-905f-4a41-8dbe-cf124c442f42",
						"Content-Type": "multipart/form-data",
					},
					body: payload,
				}
			);

			console.log(response);

			const responseJson = await response.json();

			if (response.ok) {
				navigation.navigate("PaymentShare", {
					paymentId: responseJson.identifier,
					webUrl: responseJson.web_url,
					amount: amount,
					currency: currency,
				});
			} else {
				Alert.alert("Error", responseJson.message);
			}
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "Ha ocurrido un error al crear el pago.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: "#fff" }}
			behavior="height"
		>
			<View style={styles.container}>
				{/* Amount */}
				<View style={styles.amountContainer}>
					<TextInput
						style={[
							styles.amountInput,
							{ color: amount ? "#035AC5" : "#C7D0E1" },
						]}
						value={amount}
						onChangeText={(text) => {
							let sanitized = text.replace(/[^0-9.,]/g, "");

							sanitized = sanitized.replace(
								/([.,])(?=.*[.,])/g,
								""
							);

							sanitized = sanitized.replace(".", ",");
							const parts = sanitized.split(",");

							parts[0] = parts[0].slice(0, 10);

							if (parts.length === 2) {
								parts[1] = parts[1].slice(0, 2);
								sanitized = parts[0] + "." + parts[1];
							} else {
								sanitized = parts[0];
							}
							setAmount(sanitized);
						}}
						keyboardType="decimal-pad"
						placeholder="0.00"
						placeholderTextColor="#C7D0E1"
						textAlign="center"
						autoFocus
						inputMode="decimal"
					/>
					<Text
						style={[
							styles.amountCurrency,
							{ color: amount ? "#035AC5" : "#C7D0E1" },
						]}
					>
						{getCurrencySymbol(currency)}
					</Text>
				</View>

				{/* Concept */}
				<Text style={styles.label}>Concepto</Text>
				<View style={{ height: 160 }}>
					<TextInput
						style={[
							styles.input,
							{
								minHeight: 48,
								maxHeight: 120,
								textAlignVertical: "top",
							},
						]}
						placeholder="Añade descripción del pago"
						placeholderTextColor="#B0B8C1"
						value={concept}
						onChangeText={setConcept}
						multiline
						maxLength={140}
						editable={!loading}
					/>
					<Text
						style={{
							alignSelf: "flex-end",
							color: "#647184",
							fontSize: 13,
							marginTop: 8,
							marginRight: 4,
						}}
					>
						{concept.length}/140 caracteres
					</Text>
				</View>

				{/* Modal for currency selection */}
				<FiatsModal
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					currencies={FIAT_CURRENCIES}
					selectedCurrency={currency}
					onSelect={handleCurrencySelect}
				/>
			</View>
			<TouchableOpacity
				style={[
					styles.button,
					(!(amount && concept && currency) || loading) &&
						styles.buttonDisabled,
				]}
				onPress={createPayment}
				disabled={!(amount && concept && currency) || loading}
				activeOpacity={0.8}
			>
				{loading ? (
					<ActivityIndicator color="#035AC5" />
				) : (
					<Text
						style={[
							styles.buttonText,
							(!(amount && concept && currency) || loading) &&
								styles.buttonTextDisabled,
						]}
					>
						Continuar
					</Text>
				)}
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: "#fff",
	},
	amountContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 32,
		marginBottom: 32,
		flexDirection: "row",
	},
	amountText: {
		fontSize: 48,
		fontWeight: "700",
		letterSpacing: 1,
	},
	label: {
		fontWeight: "700",
		color: "#002859",
		marginBottom: 8,
		marginTop: 0,
		fontSize: 15,
	},
	input: {
		borderWidth: 1,
		borderColor: "#E3E6ED",
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 8,
		fontSize: 16,
		color: "#1A2B49",
	},
	button: {
		backgroundColor: "#035AC5",
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 16,
		width: "90%",
		alignSelf: "center",
		position: "absolute",
		top: "60%",
		zIndex: 1,
	},
	buttonDisabled: {
		backgroundColor: "#E3EFFF",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 17,
	},
	buttonTextDisabled: {
		color: "#8CA9D5",
	},
	amountInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		flex: 1,
	},
	amountInput: {
		fontSize: 48,
		fontWeight: "700",
		letterSpacing: 1,
		borderWidth: 0,
		padding: 0,
		backgroundColor: "transparent",
	},
	amountCurrency: {
		fontSize: 48,
		fontWeight: "700",
	},
});

export default PaymentCreationScreen;
