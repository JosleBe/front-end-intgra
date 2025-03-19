import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import LoginPage from "../components/auth/LoginPage";
import ProfilePage from "../components/userPages/ProfilePage"
import Layout from "../layouts/Layout";
import ErrorPage from "../components/errorPage/ErrorPage";
import RegisterCampaign from "../components/campaignsPage/RegisterCampaign";
import EditProfie from "../components/userPages/EditProfie";
import CampaignMain from "../components/campaignsPage/CampaignMain";
import Ubicaciones from "../components/ubicaciones/Ubicaciones";
import RecuperarContraseña from "../components/auth/RecuperarContraseña";
import MyUbications from "../components/ubicaciones/MyUbications";
import Chat from "../components/chatInbox/Chat";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ), // Con sidebar
  },
  {
    path: "/campaigns",
    element: (
      <Layout>
       <CampaignMain />
      </Layout>
      )
  },
  {
    path: "/campaigns-register",
    element: (
      <Layout>
       <RegisterCampaign />
      </Layout>
      )
  },
  {
    path: "/editProfile",
    element: (
      <Layout>
        <EditProfie />
      </Layout>
    ), // Con sidebar
  },
  {
    path: "/chat",
    element: (
      <Layout>
        <Chat/>
      </Layout>
    ), // Con sidebar
  },
  {
    path :"/pageError",
    element: (
      <ErrorPage/>
    )
  },
  {
    path: "/ubicaciones",
    element: (
      <Layout>
       <Ubicaciones />
      </Layout>
      )
  },
  {
    path: "/ubicaciones-registrar",
    element: (
      <Layout>
       <MyUbications />
      </Layout>
      )
  },
  {
    path: "/recuperar-contra",
    element: (
     
       <RecuperarContraseña />
   
      )
  },
 
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
