import { useEffect } from "react";

type UsePaymentWebSocketProps = {
	paymentId: string;
	onCompleted: (data: { amount: string; currency: string }) => void;
};

export function usePaymentWebSocket({
	paymentId,
	onCompleted,
}: UsePaymentWebSocketProps) {
	useEffect(() => {
		const newSocket = new WebSocket(
			`wss://payments.pre-bnvo.com/ws/merchant/${paymentId}`
		);

		newSocket.onopen = () => {
			console.log("WebSocket connected");
		};

		newSocket.onmessage = (event) => {
			console.log("WebSocket message received:", event.data);
			const data = JSON.parse(event.data);
			if (data.status === "CO") {
				onCompleted({
					amount: data.fiat_amount,
					currency: data.fiat,
				});
			}
		};

		newSocket.onerror = (error) => {
			console.log("WebSocket error:", error);
		};

		newSocket.onclose = (event) => {
			console.log("WebSocket closed:", event.code, event.reason);
		};

		return () => {
			newSocket.close();
		};
	}, [paymentId, onCompleted]);
}
