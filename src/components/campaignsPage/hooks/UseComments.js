import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const useComments = (campaignId) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!campaignId) return;

    // Cargar comentarios iniciales
    axios.get(`http://localhost:8080/api/campaign/${campaignId}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(response => {
      setComments(response.data);
      console.log(response.data);
    })
    .catch(error => console.error("Error al obtener comentarios", error));

    const token = localStorage.getItem("token");

    // Configurar WebSocket con STOMP usando SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${token}`), // Token en la URL
      onConnect: () => {
        console.log("Conectado a WebSocket");
        client.subscribe(`/topic/campaign/${campaignId}`, (message) => {
          console.log("Mensaje recibido:", message.body);  // Verificar que el mensaje está llegando
          const newComment = JSON.parse(message.body);
          setComments((prev) => [...prev, newComment]);
        });
      },
      onDisconnect: () => {
        console.log("Desconectado de WebSocket");
      },
      onStompError: (frame) => {
        console.error("Error STOMP", frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [campaignId]);

  return comments;
};

export default useComments;
