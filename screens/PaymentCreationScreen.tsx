import { StackNavigationProp } from "@react-navigation/stack";

import FiatDropdown from "@/components/FiatDropdown";
import FiatsModal from "@/components/FiatsModal";
import React, { useLayoutEffect, useState } from "react";
import {
	Alert,
	Button,
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
	{ code: "EUR", name: "Euro" },
	{ code: "USD", name: "US Dollar" },
	{ code: "GBP", name: "British Pound" },
];

const PaymentCreationScreen: React.FC<Props> = ({ navigation }) => {
	const [amount, setAmount] = useState("");
	const [concept, setConcept] = useState("");
	const [currency, setCurrency] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Crear pago",
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

		const payload = new FormData();
		payload.append("expected_output_amount", amount);
		payload.append("fiat", currency);
		payload.append("notes", concept);

		// Call the API
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

			const responseJson = await response.json();

			if (response.ok) {
				// Navigate to the Share screen with required data
				navigation.navigate("PaymentShare", {
					paymentId: responseJson.identifier,
					webUrl: responseJson.web_url,
				});
			} else {
				Alert.alert("Error", responseJson.message);
			}
		} catch (error) {
			Alert.alert("Error", "Ha ocurrido un error al crear el pago.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Importe a pagar</Text>
			<TextInput
				style={styles.input}
				keyboardType="decimal-pad"
				placeholder="0.00"
				value={amount}
				onChangeText={setAmount}
			/>

			<Text style={styles.label}>Concepto</Text>
			<TextInput
				style={styles.input}
				placeholder="Añade descripción del pago"
				value={concept}
				onChangeText={setConcept}
			/>

			<Text style={styles.label}>Divisa FIAT</Text>
			<TouchableOpacity
				style={styles.currencySelect}
				onPress={() => setModalVisible(true)}
			>
				<Text>{currency ? currency : "Selecciona divisa"}</Text>
			</TouchableOpacity>

			<FiatsModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				currencies={FIAT_CURRENCIES}
				selectedCurrency={currency}
				onSelect={handleCurrencySelect}
			/>

			<Button title="Continuar" onPress={createPayment} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
	label: { marginTop: 16, fontWeight: "bold" },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 8,
		borderRadius: 5,
		marginTop: 4,
	},
	currencySelect: {
		padding: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		marginTop: 4,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		width: 300,
	},
	currencyItem: { padding: 12, fontSize: 16 },
});

export default PaymentCreationScreen;
