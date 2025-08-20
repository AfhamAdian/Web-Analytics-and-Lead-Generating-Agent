import { cn } from "@/lib/utils";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";

interface ChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: "incoming" | "outgoing";
  avatar?: string;
}

const botAvatar = "/icons/bot.svg";
const userAvatar = "/icons/circle-user-round.svg";

const LiveChat = ({ className }: { className?: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Hello! I'm the FabricXai Assistant. How can I help you today?",
      sentTime: "just now",
      sender: "FabricX Bot",
      direction: "incoming",
      avatar: botAvatar,
    },
  ]);

  const handleSend = (message: string) => {
    const newMessage: ChatMessage = {
      message,
      sentTime: "just now",
      sender: "You",
      direction: "outgoing",
      avatar: userAvatar, 
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        message:
          "Thanks for your message! Our AI is processing your request. How else can I assist you with FabricX solutions?",
        sentTime: "just now",
        sender: "fabricXai",
        direction: "incoming",
        avatar: botAvatar,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className={cn("", className)}>
      <MainContainer>

        <ChatContainer>
          <MessageList>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.message,
                  sentTime: msg.sentTime,
                  sender: msg.sender,
                  direction: msg.direction,
                  position: msg.direction === "incoming" ? 0 : 1,
                }}
                avatarPosition="center-left"
              ><Avatar active status="available" size="sm" src={msg.avatar} name={msg.sender} /></Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type your message..."
            onSend={handleSend}
            attachButton={false}
            sendButton={true}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default LiveChat;