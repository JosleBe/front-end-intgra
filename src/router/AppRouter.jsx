import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import LoginPage from "../components/auth/LoginPage";
import ProfilePage from "../components/userPages/ProfilePage"
import Layout from "../layouts/Layout";
import ErrorPage from "../components/errorPage/ErrorPage";
import RegisterCampaign from "../components/campaignsPage/pages/RegisterCampaign";
import EditProfie from "../components/userPages/EditProfie";
import CampaignMain from "../components/campaignsPage/pages/CampaignMain";
import Ubicaciones from "../components/ubicaciones/Locations";
import RecuperarContraseña from "../components/auth/RecuperarContraseña";
import MyUbications from "../components/ubicaciones/MyLocations";
import Chat from "../components/chatInbox/Chat";
import ViewCampaign from "../components/campaignsPage/pages/ViewCampaign"
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
    path: "/view-campaign",
    element: (
      <Layout>
       <ViewCampaign />
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
