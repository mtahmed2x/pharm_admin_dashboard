"use client";

import { Send, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// Define types for our data structures
interface Message {
  sender: "me" | "them";
  text: string;
  time: string;
  image?: string;
}

interface Conversation {
  id: number;
  name: string;
  ID: string;
  date: string;
  preview: string;
  unread: number;
  sellerId?: string;
  messages: Message[];
  avatar?: string;
}

interface ChatData {
  activeChat: number;
  conversations: Conversation[];
}

const ChatApp = () => {
  // Sample JSON data structure for messages with TypeScript types
  const [chatData, setChatData] = useState<ChatData>({
    activeChat: 0, // Index of active chat
    conversations: [
      {
        id: 1,
        name: "John Doe",
        ID: "555",
        date: "2 Sep, 2025",
        preview: "Pioneering physicist and chemist, cele...",
        unread: 9,
        sellerId: "CDF-2023452",
        avatar: "JD",
        messages: [
          {
            sender: "them",
            text: "I want to order bulk product from you. please help me !",
            time: "14/06/2025 | 2:06 Pm",
          },
          {
            sender: "me",
            text: "Yes. How can I help you? Just tell me your problem.",
            time: "14/06/2025 | 2:10 Pm",
          },
          {
            sender: "them",
            text: "Have your more categories available?",
            time: "14/06/2025 | 2:35 Pm",
          },
          {
            sender: "me",
            text: "Yes. Many more categories product available here.",
            time: "14/06/2025 | 2:40 Pm",
          },
        ],
      },
      {
        id: 2,
        name: "Floyd Miles",
        ID: "984615",
        date: "2 Sep, 2025",
        preview: "Pioneering physicist and chemist, cele...",
        unread: 0,
        avatar: "FM",
        messages: [],
      },
      {
        id: 3,
        name: "Cameron Williamson",
        ID: "515155151",
        date: "2 Sep, 2025",
        preview: "Lorem ipsum dolor sit amet, consectetur.",
        unread: 0,
        avatar: "CW",
        messages: [],
      },
    ],
  });

  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (): void => {
    if (newMessage.trim() === "" && !selectedImage) return;

    const updatedData: ChatData = { ...chatData };
    const newMessageObj: Message = {
      sender: "me",
      text: newMessage,
      time:
        new Date().toLocaleDateString("en-GB") +
        " | " +
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    };

    if (selectedImage) {
      newMessageObj.image = selectedImage;
    }

    updatedData.conversations[chatData.activeChat].messages.push(newMessageObj);

    setChatData(updatedData);
    setNewMessage("");
    setSelectedImage(null);
  };

  const setActiveChat = (index: number): void => {
    setChatData({ ...chatData, activeChat: index });
    setSelectedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = (): void => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to generate random color based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full p-3 pl-10 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatData.conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                chatData.activeChat === index
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveChat(index)}
            >
              <div
                className={`flex-shrink-0 h-12 w-12 rounded-full ${getAvatarColor(
                  conversation.name
                )} flex items-center justify-center text-white font-semibold`}
              >
                {conversation.avatar}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conversation.preview}
                </p>
                {conversation.sellerId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Seller ID: {conversation.sellerId}
                  </p>
                )}
              </div>
              {conversation.unread > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {conversation.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {chatData.conversations[chatData.activeChat] && (
          <>
            <div className="p-5 border-b border-gray-200 bg-white flex justify-between">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-full ${getAvatarColor(
                    chatData.conversations[chatData.activeChat].name
                  )} flex items-center justify-center text-white font-semibold`}
                >
                  {chatData.conversations[chatData.activeChat].avatar}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {chatData.conversations[chatData.activeChat].name}
                  </h2>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <p> User ID : {chatData.conversations[chatData.activeChat].ID}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4">
                {chatData.conversations[chatData.activeChat].messages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 ${
                          message.sender === "me"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {message.image && (
                          <div className="mb-2">
                            <Image
                              src={message.image}
                              alt="Uploaded"
                              className="rounded-lg max-w-full h-auto"
                            />
                          </div>
                        )}
                        {message.text && (
                          <p className="text-sm">{message.text}</p>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "me"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="p-4 bg-gray-100 border-t border-gray-200">
                <div className="relative inline-block">
                  <Image
                    src={selectedImage}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={removeSelectedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-5 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <Upload />
                  </label>
                </div>
                <div className="flex-1 flex">
                  <input
                    type="text"
                    placeholder="Send quick messages"
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewMessage(e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
                    onClick={handleSendMessage}
                  >
                    <Send />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
