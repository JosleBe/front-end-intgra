import { useEffect, useState } from "react";
import { Textarea } from "@material-tailwind/react";
import { LockKeyhole, SendHorizontal, X } from "lucide-react";
import UserService from "../../../service/UserService";
import CampaignService from '../../../service/CampaignService'
const CommentForm = ({ campaignId }) => {
  const [texto, setText] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("profileInfo"));
  const { email } = user;

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await UserService.getAllAdmins(localStorage.getItem("token"));
        setAdmins(data);
      } catch (error) {
        console.error("Error al obtener admins:", error);
      }
    };

    if (open && admins.length === 0) {
      fetchAdmins();
    }
  }, [open, admins.length]);
  const handleUpload = async () => {
    const url = await CampaignService.handleUpload(image, setUploading);
    console.log("Imagen subida:", url);
  };

  const handleSubmit = async () => {
    await CampaignService.handleSubmit(texto, image, campaignId, setText, setImage);
    console.log("Comentario enviado");
  };
  const handlePrivateMessage = async () => {
    await CampaignService.handlePrivate(
      newMessage,
      email,
      admins,
      CampaignService.getChatId,
      setNewMessage,
      setShowModal
    );
  };


  return (
    <div className="mb-4">
      <label htmlFor="chat" className="sr-only">Tu mensaje</label>
      <div className="flex items-center p-1 rounded-2xl bg-white border border-gray-200 shadow-sm">

        {/* Botón para cargar imagen */}
        <button
          type="button"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition"
          onClick={() => document.getElementById('imageInput').click()}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 20 18">
            <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          id="chat"
          value={texto}
          onChange={(e) => setText(e.target.value)}
          rows="1"
          className="flex-1 mx-2 p-2 text-sm text-gray-700 bg-transparent outline-none resize-none"
          placeholder="Escribe un comentario..."
        />

        {/* Botón de candado (mensaje privado) */}
        <button
          type="button"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition"
          onClick={() => setShowModal(true)}
        >
          <LockKeyhole />
        </button>

        {/* Botón para enviar */}
        <button
          type="button"
          disabled={uploading || !texto.trim()}
          value={texto}
          onClick={handleSubmit}
          className="p-2 text-blue-500 rounded-full hover:bg-gray-100 transition"
        >
          <SendHorizontal fill="gray" color="gray" />
        </button>
      </div>

      {/* Input oculto para subir imagen */}
      <input
        type="file"
        id="imageInput"
        onChange={(e) => setImage(e.target.files[0])}
        className="hidden"
      />

      {/* Modal de mensaje privado */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Enviar un mensaje privado al responsable de esta campaña
            </h2>
            <Textarea label="Mensaje" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                <X />
              </button>
              <button
                type="button"
                onClick={handlePrivateMessage}
                className="p-2 text-blue-500 rounded-full hover:bg-gray-100 transition"
              >
                <SendHorizontal fill="gray" color="gray" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
