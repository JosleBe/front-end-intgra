import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, MessagesSquare, Send } from 'lucide-react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { db } from '../../config/firebase.config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const user = JSON.parse(localStorage.getItem("profileInfo"));
  const { email } = user;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/${email}/contacts`);
        if (response.data) {
          setContacts(response.data);
        }
      } catch (error) {
        console.error("Error al cargar los contactos:", error);
      }
    };
    fetchContacts();
  }, [email]);

  useEffect(() => {
    if (!activeChat) return;

    const chatId = getChatId(email, activeChat.email);
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [activeChat, email]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeChat) return;

    const chatId = getChatId(email, activeChat.email);

    const message = {
      text: newMessage,
      sender: email,
      recipient: activeChat.email,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), message);
      await axios.post('http://localhost:8080/api/send', {
        emisorEmail: email,
        receptorEmail: activeChat.email,
        texto: newMessage,
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const getChatId = (userEmail, recipientEmail) => {
    return userEmail < recipientEmail
      ? `${userEmail}_to_${recipientEmail}`
      : `${recipientEmail}_to_${userEmail}`;
  };
    // Filtrar contactos según el texto de búsqueda
    const filteredContacts = contacts.filter(contact => 
      contact.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex h-100 bg-gradient-to-r from-gray-300 to-gray-400">
      <div className="w-80 bg-white p-4 rounded-l-lg shadow-md overflow-y-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h2 className="text-2xl font-bold text-black mb-4">Mensajes</h2>
          <MessageCircle size={34} fill='black' color='black' />
        </div>

        <form className="flex items-center max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Buscar contacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Actualizar el estado de búsqueda
            />
          </div>
        </form>

        <ul className="space-y-3">
          <p className="text-lg font-bold text-center mt-2 text-gray-800 tracking-wide">Contactos</p>
          {filteredContacts.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron contactos.</p>
          ) : (
            filteredContacts.map((contact) => (
              <li
                key={contact.email}
                className={`p-3 cursor-pointer flex items-center gap-2 rounded-lg transition-all duration-300 shadow-sm
                  ${activeChat?.email === contact.email ? "bg-black text-white shadow-md scale-105" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={() => setActiveChat(contact)}
              >
                <MessagesSquare size={27} fill='whi' />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{contact.nombre}</span>
                  <span className={`text-sm ${activeChat?.email === contact.email ? "text-white" : "text-black"}`}>
                    {contact.email}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="w-5/6 flex flex-col h-full rounded-r-lg shadow-md">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === messages.length - 1 ? messagesEndRef : null}
              className={`p-3 rounded-lg max-w-md ${msg.sender === email ? "bg-white text-gray-800 ml-auto shadow-sm" : "bg-gray-100 text-gray-800"}`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-sm">{msg.sender === email ? "Yo" : msg.sender}</span>
                <span className="text-xs text-gray-500">
                  {msg.timestamp?.seconds
                    ? formatDistanceToNow(new Date(msg.timestamp.seconds * 1000), { addSuffix: true, locale: es })
                    : "Fecha desconocida"}
                </span>
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {activeChat && (
          <div className="p-4 bg-white border-t flex items-center">
            <Input
              className="flex-1 mr-3 py-2 px-4 border rounded-full shadow-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              size="sm"
            />
            <Button
              onClick={handleSendMessage}
              variant="solid"
              className="p-3 rounded-full transition-all bg-black hover:bg-gray-300 shadow-md"
            >
              <Send size={15} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
