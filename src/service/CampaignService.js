import axios from "axios";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.config"; // Asegúrate de importar la configuración de Firebase correctamente

const BASE_URL = "http://localhost:8080/api";

const AdminService = {
  getAllAdmins: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/adminuser/all-admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener admins:", error);
      throw error;
    }
  },
  getAllCampaigns: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/campaign`, {
      });
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener las campañas:", error);
      throw error;
    }
  },

  handleUpload: async (image, setUploading) => {
    if (!image) return "";
    setUploading(true);
    const imageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    setUploading(false);
    return url;
  },

  handleSubmit: async (texto, image, campaignId, setText, setImage) => {
    if (!texto.trim()) return;
    const imagen = await AdminService.handleUpload(image);
    const token = localStorage.getItem("token");
    const profile = JSON.parse(localStorage.getItem("profileInfo"));
    const name = profile?.name;

    const comment = { autor: name, texto, imagen };

    await axios.post(
      `${BASE_URL}/campaign/${campaignId}/comments`,
      comment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setText("");
    setImage(null);
  },

  handlePrivate: async (newMessage, email, admins, getChatId, setNewMessage, setShowModal) => {
    console.log("enviar prin");
    
    if (newMessage.trim() === "" || admins.length === 0) return;
    try {
      for (const admin of admins) {
        const chatId = getChatId(email, admin.email);
        
        const message = {
          text: newMessage,
          sender: email,
          recipient: admin.email,
          timestamp: serverTimestamp(),
        };
        await addDoc(collection(db, `chats/${chatId}/messages`), message);
        await axios.post(`${BASE_URL}/send`, {
          emisorEmail: email,
          receptorEmail: admin.email,
          texto: newMessage,
        });
      }

      setNewMessage("");
      setShowModal(false);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  },

  getChatId: (userEmail, recipientEmail) => {
    return userEmail < recipientEmail
      ? `${userEmail}_to_${recipientEmail}`
      : `${recipientEmail}_to_${userEmail}`;
  },
};

export default AdminService;
