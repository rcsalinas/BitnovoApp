import React from "react";
import { Text, TouchableOpacity } from "react-native";
import ArrowDown from "../assets/images/arrow-down.svg";

const FiatDropdown = ({
	handleMakeModalVisible,
	currency,
}: {
	handleMakeModalVisible: () => void;
	currency: string | null;
}) => {
	return (
		<TouchableOpacity
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingHorizontal: 12,
				paddingVertical: 6,
				backgroundColor: "#F6F8FB",
				borderRadius: 24,
				marginRight: 16,
			}}
			onPress={handleMakeModalVisible}
		>
			<Text
				style={{
					color: "#1A2B49",
					fontWeight: "600",
					marginRight: 4,
				}}
			>
				{currency || "USD"}
			</Text>
			<ArrowDown width={16} height={16} />
		</TouchableOpacity>
	);
};

export default FiatDropdown;
