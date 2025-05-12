import React from "react";
import { TextInput, View } from "react-native";
import SearchNormal from "../assets/images/search-normal.svg";

type Props = {
	placeholder?: string;
	editable?: boolean;
	value?: string;
	onChangeText?: (text: string) => void;
};

const SearchInput: React.FC<Props> = ({
	placeholder = "Buscar",
	editable = false,
	value,
	onChangeText,
}) => (
	<View
		style={{
			marginHorizontal: 20,
			marginBottom: 12,
			backgroundColor: "#fff",
			borderRadius: 8,
			borderWidth: 1,
			borderColor: "#E3E6ED",
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 12,
			height: 44,
		}}
	>
		<SearchNormal width={20} height={20} style={{ marginRight: 8 }} />
		<TextInput
			style={{
				flex: 1,
				fontSize: 16,
				color: "#6B7683",
				backgroundColor: "transparent",
				paddingVertical: 0,
			}}
			placeholder={placeholder}
			placeholderTextColor="#6B7683"
			editable={editable}
			value={value}
			onChangeText={onChangeText}
		/>
	</View>
);

export default SearchInput;
