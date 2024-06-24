"use client";
import React from "react";

interface AppContextData {
  url: string;
}

const AppContext = React.createContext<AppContextData | null>(null);

const local = `http://localhost:8000`;

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const url = local;

  return <AppContext.Provider value={{ url }}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return React.useContext(AppContext)!;
};

export { AppContext, AppProvider };
