import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import ArrowBack from "../assets/images/arrow-back.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import EuroIcon from "../assets/images/euro-icon.svg";
import GbpIcon from "../assets/images/gbp-icon.svg";
import TickCircle from "../assets/images/tick-circle.svg";
import UsdIcon from "../assets/images/usd-icon.svg";

import SearchInput from "./SearchInput";

type Currency = {
	code: string;
	name: string;
};

type Props = {
	visible: boolean;
	onClose: () => void;
	currencies: Currency[];
	selectedCurrency: string | null;
	onSelect: (code: string) => void;
};

const FiatsModal: React.FC<Props> = ({
	visible,
	onClose,
	currencies,
	selectedCurrency,
	onSelect,
}) => {
	const [search, setSearch] = React.useState("");
	const insets = useSafeAreaInsets();

	const filteredCurrencies = React.useMemo(
		() =>
			currencies.filter(
				(c) =>
					c.name.toLowerCase().includes(search.toLowerCase()) ||
					c.code.toLowerCase().includes(search.toLowerCase())
			),
		[currencies, search]
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={false}
			presentationStyle="fullScreen"
		>
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: "#fff",
					paddingTop: insets.top,
				}}
				edges={["top", "left", "right"]}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						padding: 20,
						paddingBottom: 10,
					}}
				>
					<TouchableOpacity
						onPress={onClose}
						style={{ marginRight: 16 }}
					>
						<ArrowBack width={28} height={28} />
					</TouchableOpacity>
					<Text
						style={{
							flex: 1,
							fontSize: 20,
							fontWeight: "700",
							color: "#1A2B49",
							textAlign: "center",
						}}
					>
						Selecciona una divisa
					</Text>
					<View style={{ width: 40 }} />
				</View>
				{/* Search (disabled) */}
				<SearchInput editable value={search} onChangeText={setSearch} />
				{/* Currency List */}
				<FlatList
					data={filteredCurrencies}
					keyExtractor={(item) => item.code}
					renderItem={({ item }) => {
						let Icon = EuroIcon;
						if (item.code === "USD") Icon = UsdIcon;
						if (item.code === "GBP") Icon = GbpIcon;
						const isSelected = selectedCurrency === item.code;
						return (
							<TouchableOpacity
								onPress={() => onSelect(item.code)}
								style={{
									flexDirection: "row",
									alignItems: "center",
									paddingHorizontal: 20,
									paddingVertical: 16,
									backgroundColor: "#fff",
								}}
							>
								<Icon width={32} height={32} />
								<View style={{ marginLeft: 16, flex: 1 }}>
									<Text
										style={{
											fontWeight: "700",
											fontSize: 16,
											color: "#1A2B49",
										}}
									>
										{item.name}
									</Text>
									<Text
										style={{
											color: "#B0B8C1",
											fontSize: 14,
										}}
									>
										{item.code}
									</Text>
								</View>
								{isSelected ? (
									<TickCircle width={16} height={16} />
								) : (
									<ArrowRight width={16} height={16} />
								)}
							</TouchableOpacity>
						);
					}}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 1,
								backgroundColor: "#F6F8FB",
								marginLeft: 68,
							}}
						/>
					)}
				/>
			</SafeAreaView>
		</Modal>
	);
};

export default FiatsModal;
