import useComments from "../hooks/UseComments";
import React from "react";
import userImage from '../../../assets/img/user-img.png'
import userGirl from '../../../assets/img/user-girl.png'
import CommentForm from "./CommentForm";
import { MessageCircle } from "lucide-react";
const CommentList = ({ campaignId }) => {
  const profile = JSON.parse(localStorage.getItem("profileInfo")) || {
    id: "guest",
    name: "Invitado",
    role: "guest",
    email: null,
    sexo: null
  };
  const comments = useComments(campaignId);

  return (
    <div style={{ backgroundColor: 'white', borderColor: 'black' }} className="rounded-lg p-3">
      <div className="flex justify-between">
        <div className="flex flex-row justify-center items-center mb-3 gap-2">
          <MessageCircle size={24} fill='black' color='black' />
          <h3 className="text-2xl font-semibold text-start text-gray-800 ">Comentarios</h3>
        </div>
        <p className="text-base text-lg mt-3">{comments.length} comentarios</p>
      </div>
      {/* Título agregado */}
      <hr style={{ color: 'black' }} className="bg-black rounded-full h-1 border-none" />

      <div className="relative">
        <ul style={{ height: 450 }} className="space-y-2 max-h-[450px]  overflow-y-auto p-4 pr-2">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start space-x-4">

              <div class="flex items-start gap-2.5">
                {
                  profile.sexo === 'H' ?( <img class="w-10 h-10 rounded-full" src={userImage} alt="Jese image" />):
                  (<img class="w-10 h-10 rounded-full" src={userGirl} alt="Jese image" />)
                }
               
                <div class="flex flex-col gap-1 w-full max-w-[320px]">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{c.autor}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {new Date(c.fecha).toLocaleString('es-ES', {
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }).replace(',', '')}
                    </span>
                  </div>
                  <div style={{ maxWidth: 600 }} class="flex flex-col leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }} class="text-sm font-normal text-gray-900 dark:text-white text-wrap text-ellipsis">{c.texto}</p>
                  </div>
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Entregado</span>
                </div>


              </div>

            </li>
          ))}
        </ul>
        <CommentForm campaignId={campaignId} />
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>




  );
};

export default CommentList;
