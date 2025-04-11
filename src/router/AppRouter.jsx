import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import LoginPage from "../components/auth/LoginPage";
import ProfilePage from "../components/userPages/ProfilePage";
import Layout from "../layouts/Layout";
import ErrorPage from "../components/errorPage/ErrorPage";
import RegisterCampaign from "../components/campaignsPage/pages/RegisterCampaign";
import EditProfie from "../components/userPages/EditProfie";
import CampaignMain from "../components/campaignsPage/pages/CampaignMain";
import Ubicaciones from "../components/ubicaciones/Locations";
import RecuperarContraseña from "../components/auth/RecuperarContraseña";
import MyUbications from "../components/ubicaciones/MyLocations";
import Chat from "../components/chatInbox/Chat";
import ViewCampaign from "../components/campaignsPage/pages/ViewCampaign";
import Record from "../components/record/Record";
import RecordView from "../components/record/RecordView";
import Donation from "../components/donation/Donation";
import CampaignEdit from "../components/campaignsPage/pages/CampaignEdit";
import Usuarios from "../components/usuarios/Usuarios";
import Register from "../components/auth/Register";
import ProtectedRoute from "../layouts/ProtectedRoute"; // 👈 Aquí importamos el protector

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout>
          <ProfilePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/campaigns",
    element: (

        <Layout>
          <CampaignMain />
        </Layout>

    ),
  },
  {
    path: "/campaigns-register",
    element: (
      <ProtectedRoute>
        <Layout>
          <RegisterCampaign />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/editProfile",
    element: (
      <ProtectedRoute>
        <Layout>
          <EditProfie />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Layout>
          <Chat />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pageError",
    element: <ErrorPage />,
  },
  {
    path: "/ubicaciones",
    element: (
      <ProtectedRoute>
        <Layout>
          <Ubicaciones />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ubicaciones-registrar",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyUbications />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/view-campaign",
    element: (
 
        <Layout>
          <ViewCampaign />
        </Layout>

    ),
  },
  {
    path: "/record",
    element: (
      <ProtectedRoute>
        <Layout>
          <Record />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/record/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <RecordView />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/donations",
    element: (
      <ProtectedRoute>
        <Layout>
          <Donation />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recuperar-contra",
    element: <RecuperarContraseña />,
  },
  {
    path: "/campaigns-edit/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <CampaignEdit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/usuarios",
    element: (
      <ProtectedRoute>
        <Layout>
          <Usuarios />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/registrar-usuario",
    element: <Register />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
