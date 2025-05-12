import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import ArrowDown from "../assets/images/arrow-down.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import GreatBritainIcon from "../assets/images/great-britain-icon.svg";
import GreeceIcon from "../assets/images/greece.svg";
import GuatemalaIcon from "../assets/images/guatemala-icon.svg";
import GuineaIcon from "../assets/images/guinea-icon.svg";
import GuyanaIcon from "../assets/images/guyana-icon.svg";
import HondurasIcon from "../assets/images/honduras.svg";
import HongKongIcon from "../assets/images/hong-kong.svg";
import SentSuccessfull from "../assets/images/sent-successfull.svg";
import SpainIcon from "../assets/images/spain-icon.svg";
import TickCircle from "../assets/images/tick-circle.svg";
import WhatsappIcon from "../assets/images/whatsapp.svg";

const COUNTRY_CODES = [
	{ code: "+34", name: "España", Icon: SpainIcon },
	{ code: "+240", name: "Equatorial Guinea", Icon: GuineaIcon },
	{ code: "+30", name: "Grecia", Icon: GreeceIcon },
	{ code: "+500", name: "South Georgia and the S.", Icon: GreatBritainIcon },
	{ code: "+502", name: "Guatemala", Icon: GuatemalaIcon },
	{ code: "+592", name: "Guyana", Icon: GuyanaIcon },
	{ code: "+852", name: "Hong Kong", Icon: HongKongIcon },
	{ code: "+504", name: "Honduras", Icon: HondurasIcon },
];

type Props = {
	webUrl: string;
};

const WhatsappShareInput: React.FC<Props> = ({ webUrl }) => {
	const [inputMode, setInputMode] = useState(false);
	const [countryModalVisible, setCountryModalVisible] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [search, setSearch] = useState("");
	const [successModalVisible, setSuccessModalVisible] = useState(false);

	const filteredCountries = COUNTRY_CODES.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.code.includes(search)
	);

	return (
		<>
			{!inputMode ? (
				<TouchableOpacity
					style={styles.shareButton}
					onPress={() => setInputMode(true)}
				>
					<WhatsappIcon
						width={20}
						height={20}
						style={{ marginRight: 12 }}
					/>
					<Text style={styles.shareButtonText}>
						Enviar a número de WhatsApp
					</Text>
				</TouchableOpacity>
			) : (
				<View style={styles.whatsappInputRow}>
					<TouchableOpacity
						style={styles.countrySelector}
						onPress={() => setCountryModalVisible(true)}
					>
						<WhatsappIcon
							width={20}
							height={20}
							style={{ marginRight: 12 }}
						/>
						<Text style={styles.countryCode}>
							{selectedCountry.code}
						</Text>
						<ArrowDown
							width={14}
							height={14}
							style={{ marginLeft: 4 }}
						/>
					</TouchableOpacity>
					<TextInput
						style={styles.phoneInput}
						placeholder="300 678 9087"
						keyboardType="phone-pad"
						value={phoneNumber}
						onChangeText={setPhoneNumber}
					/>
					<TouchableOpacity
						style={styles.sendButton}
						disabled={!phoneNumber}
						onPress={() => setSuccessModalVisible(true)}
					>
						<Text style={styles.sendButtonText}>Enviar</Text>
					</TouchableOpacity>
				</View>
			)}

			<Modal
				visible={countryModalVisible}
				animationType="slide"
				transparent={false}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity
							onPress={() => setCountryModalVisible(false)}
						>
							<Text style={styles.backArrow}>{"←"}</Text>
						</TouchableOpacity>
						<Text style={styles.modalTitle}>Seleccionar país</Text>
					</View>
					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Buscar"
							value={search}
							onChangeText={setSearch}
							keyboardType="numeric"
						/>
					</View>
					<FlatList
						data={filteredCountries}
						keyExtractor={(item) => item.code}
						renderItem={({ item }) => {
							const isSelected =
								selectedCountry.code === item.code;
							return (
								<TouchableOpacity
									style={[styles.countryRow]}
									onPress={() => {
										setSelectedCountry(item);
										setCountryModalVisible(false);
									}}
								>
									<item.Icon
										width={24}
										height={24}
										style={{ marginRight: 12 }}
									/>
									<Text style={styles.countryCode}>
										{item.code}
									</Text>
									<Text style={styles.countryName}>
										{item.name}
									</Text>
									{isSelected ? (
										<TickCircle
											width={16}
											height={16}
											style={{ marginLeft: "auto" }}
										/>
									) : (
										<ArrowRight
											width={16}
											height={16}
											style={{ marginLeft: "auto" }}
										/>
									)}
								</TouchableOpacity>
							);
						}}
					/>
				</View>
			</Modal>
			<Modal
				visible={successModalVisible}
				animationType="fade"
				transparent
			>
				<View style={styles.successModalOverlay}>
					<BlurView
						intensity={15}
						tint="systemMaterialDark"
						style={StyleSheet.absoluteFill}
					/>
					<View style={styles.successModalBottomContent}>
						<SentSuccessfull
							width={80}
							height={80}
							style={{ marginBottom: 16 }}
						/>
						<Text style={styles.successTitle}>
							Solicitud enviada
						</Text>
						<Text style={styles.successMessage}>
							Tu solicitud de pago enviada ha sido enviada con
							éxito por WhatsApp.
						</Text>
						<TouchableOpacity
							style={styles.successButton}
							onPress={() => setSuccessModalVisible(false)}
						>
							<Text style={styles.successButtonText}>
								Entendido
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
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
	whatsappInputRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E3E6ED",
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 8,
		marginBottom: 12,
		height: 56,
	},
	countrySelector: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginRight: 8,
	},

	phoneInput: {
		flex: 1,
		fontSize: 15,
		color: "#1A2B49",
		paddingHorizontal: 8,
	},
	sendButton: {
		backgroundColor: "#035AC5",
		borderRadius: 6,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: 53,
		height: 24,
	},
	sendButtonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 12,
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: 48,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingBottom: 12,
	},
	backArrow: {
		fontSize: 24,
		marginRight: 12,
		color: "#1A2B49",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1A2B49",
	},
	searchContainer: {
		paddingHorizontal: 20,
		paddingBottom: 8,
	},
	searchInput: {
		backgroundColor: "#F6F8FB",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		color: "#1A2B49",
	},
	countryRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F6F8FB",
	},
	countryCode: {
		fontSize: 16,
		color: "#1A2B49",
		fontWeight: "700",
		marginRight: 12,
	},
	countryName: {
		fontSize: 16,
		color: "#1A2B49",
		flex: 1,
	},
	successModalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	successModalBottomContent: {
		width: "100%",
		height: 413,
		backgroundColor: "#fff",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-end",
		paddingBottom: 84,
	},
	successTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#1A2B49",
		marginBottom: 8,
		textAlign: "center",
	},
	successMessage: {
		fontSize: 15,
		color: "#647184",
		textAlign: "center",
		marginBottom: 24,
	},
	successButton: {
		backgroundColor: "#035AC5",
		borderRadius: 6,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: 320,
		height: 56,
	},
	successButtonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
		textAlign: "center",
	},
});

export default WhatsappShareInput;
