// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    id: "guest",
    name: "Invitado",
    role: "guest",
    email: null,
    sexo: null
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profileInfo"));
    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  const updateProfile = (newProfile) => {
    localStorage.setItem("profileInfo", JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const logout = () => {
    localStorage.removeItem("profileInfo");
    setProfile({
      id: "guest",
      name: "Invitado",
      role: "guest",
      email: null,
      sexo: null
    });
  };

  return (
    <AuthContext.Provider value={{ profile, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
