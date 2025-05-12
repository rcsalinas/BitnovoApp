export type RootStackParamList = {
	PaymentCreation: undefined;
	PaymentShare: {
		paymentId: string;
		webUrl: string;
		amount: string;
		currency: string;
	};
	QRDisplay: {
		identifier: string;
		webUrl: string;
		amount: string;
		currency: string;
		paymentId: string;
	};
	PaymentCompleted: { amount: string; currency: string };
};
