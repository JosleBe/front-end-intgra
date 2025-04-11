import axios from 'axios';
const BASE_URL = "http://localhost:3002";
const donationService = {
    payTo: async (pago) => {
        
        try {
            const response = await axios.post(`${BASE_URL}/create-order`, pago);
            console.log("Respuesta de la orden:", response.data);

            if (response.data.status === 'CREATED' && response.data.links) {
                const approvalUrl = response.data.links.find(link => link.rel === "approve")?.href;
                if (approvalUrl) {
                    window.location.href = approvalUrl; 
                } else {
                    console.error("No se encontró un link de aprobación en la respuesta.");
                }
            } else {
                console.error("La orden no fue creada correctamente.");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error.response?.data || error.message);
        }
    },
    capturePayment: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/capture-order?token=${token}`);
            console.log("Respuesta de captura:", response.data);
            if (response.data.status === 'COMPLETED') {
                const idCampana = response.data.idCampana;
                const idUsuario = response.data.idUsuario;
                await donationService.registerDonation({
                    ...response.data,
                    idCampana,
                    idUsuario
                });

               
            } else {
                console.error("El pago no fue completado.");
            }
        } catch (error) {
            console.error("Error al capturar el pago:", error);
        }
    },
    fetchTransactionDetails: async (transactionId) =>  {
        if (transactionId) {
            try {
                const response = await axios.get(`http://localhost:3002/transaction/${transactionId}`);
                return response.data;
            } catch (error) {
                console.error("Error obteniendo los detalles de la transacción:", error);
            }
        }
    },
 /*
    public class DonationEntity {
        @Id
        private String id;
        private String campaignId;
        private String donorId;
        private double amount;
        private String email;
        private String phone;
        private String name;
        private LocalDateTime donationDate;
    }
        */
    
    registerDonation: async  (transactionData) => {
      const profile = JSON.parse(localStorage.getItem("profileInfo"));
      const token = localStorage.getItem("token"); 
            const payload = {
                campaignId: transactionData.campaignId,
                amount: parseFloat(transactionData.amount),
                donationDate: transactionData.create_time, 
                donorId: profile.id,
                email: profile.email,
                phone: profile.phone,
                name: profile.name,     
            };
        
            try {
                const response = await fetch("http://localhost:8080/api/donations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}`  },
                    body: JSON.stringify(payload),
                });
        
                const data = await response.json();
                console.log("Donación registrada:", data);
            } catch (error) {
                console.error("Error registrando la donación:", error);
            }
    }, 
 
};

export default donationService;
