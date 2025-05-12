export type RootStackParamList = {
	PaymentCreation: undefined;
	PaymentShare: { paymentId: string; webUrl: string };
	QRDisplay: { identifier: string; webUrl: string };
	PaymentCompleted: undefined;
};
