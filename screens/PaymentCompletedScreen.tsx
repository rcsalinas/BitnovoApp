import { StackScreenProps } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import BitnovoPayLogo from "../assets/images/Bitnovo pay.svg";
import SentSuccessfull from "../assets/images/sent-successfull.svg";
import { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "PaymentCompleted">;

const PaymentCompletedScreen: React.FC<Props> = ({ navigation }) => {
	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => null,
			headerTitle: () => <BitnovoPayLogo width={88} height={32} />,
			headerTitleAlign: "center",
			headerStyle: {
				backgroundColor: "#fff",
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 1,
			},
		});
	}, [navigation]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.content}>
					<SentSuccessfull
						width={204}
						height={158}
						style={{ marginBottom: 24 }}
					/>
					<Text style={styles.title}>Pago recibido</Text>
					<Text style={styles.subtitle}>
						El pago se ha confirmado con éxito
					</Text>
				</View>
				<View style={styles.footer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => navigation.navigate("PaymentCreation")}
						activeOpacity={0.8}
					>
						<Text style={styles.buttonText}>Finalizar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 20,
		margin: 8,
		overflow: "hidden",
	},
	header: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 24,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		color: "#1A2B49",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 15,
		color: "#647184",
		textAlign: "center",
	},
	footer: {
		padding: 24,
	},
	button: {
		backgroundColor: "#F6F8FB",
		borderRadius: 8,
		paddingVertical: 16,
		alignItems: "center",
	},
	buttonText: {
		color: "#035AC5",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default PaymentCompletedScreen;
