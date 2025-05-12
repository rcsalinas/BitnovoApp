import FiatDropdown from "@/components/FiatDropdown";
import FiatsModal from "@/components/FiatsModal";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
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

			const responseJson = await response.json();

			if (response.ok) {
				navigation.navigate("PaymentShare", {
					paymentId: responseJson.identifier,
					webUrl: responseJson.web_url,
				});
			} else {
				Alert.alert("Error", responseJson.message);
			}
		} catch (error) {
			Alert.alert("Error", "Ha ocurrido un error al crear el pago.");
		} finally {
			setLoading(false); // NEW
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: "#fff" }}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.container}>
				{/* Amount */}
				<View style={styles.amountContainer}>
					<View style={styles.amountInputWrapper}>
						<TextInput
							style={[
								styles.amountInput,
								{ color: amount ? "#035AC5" : "#C7D0E1" },
							]}
							value={amount}
							onChangeText={setAmount}
							keyboardType="decimal-pad"
							placeholder="0.00"
							placeholderTextColor="#C7D0E1"
							textAlign="center"
							autoFocus
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

				{/* Continue Button */}
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

				{/* Hidden input for amount (to show numpad) */}
				<TextInput
					style={{
						height: 0,
						width: 0,
						opacity: 0,
						position: "absolute",
					}}
					keyboardType="decimal-pad"
					value={amount}
					onChangeText={setAmount}
					autoFocus={false}
					editable={false}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "#fff",
	},
	amountContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 32,
		marginBottom: 32,
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
		justifyContent: "center",
	},
	amountInput: {
		fontSize: 48,
		fontWeight: "700",
		letterSpacing: 1,
		borderWidth: 0,
		padding: 0,
		backgroundColor: "transparent",
		width: 160,
	},
	amountCurrency: {
		fontSize: 48,
		fontWeight: "700",
		marginLeft: 4,
	},
});

export default PaymentCreationScreen;
