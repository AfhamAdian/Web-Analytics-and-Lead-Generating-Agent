"use client";

import React, { createContext, useContext, useState } from "react";

type ChatContextType = {
  showChat: boolean;
  setShowChat: (value: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <ChatContext.Provider value={{ showChat, setShowChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
