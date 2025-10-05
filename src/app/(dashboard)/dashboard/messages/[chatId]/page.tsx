"use client";

import { Send, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  chatApi,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendImageMessageMutation,
} from "@/api/chatApi";
import { useSocket } from "@/context/SocketContext";
import { RootState, useAppDispatch } from "@/store";
import { Chat, User, Message } from "@/types";

// Helper function remains the same
const getOtherParticipant = (
  chat: Chat,
  currentUserId: string
): User | null => {
  const other = chat.participants.find((p) => p.user._id !== currentUserId);
  return other?.user || null; // Return null if not found for safety
};

const ChatPage = () => {
  // --- STATE AND REFS ---
  const params = useParams();
  const activeChatId = params.chatId as string;

  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // --- HOOKS ---
  const dispatch = useAppDispatch();
  const { socket, isConnected } = useSocket();
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  // --- RTK QUERY HOOKS ---
  // 1. Get the raw query result for the entire chat list.
  // We need isSuccess and isFetching to know the exact state.
  const {
    data: chatsResponse,
    isLoading: isLoadingChats,
    isSuccess: isChatsSuccess,
    isFetching: isChatsFetching,
  } = useGetChatsQuery();

  // 2. Find the active chat and user *after* we confirm the data is available.
  const activeChat =
    isChatsSuccess && chatsResponse.success
      ? chatsResponse.data.data.find((c) => c._id === activeChatId) || null
      : null;

  const otherUser =
    activeChat && currentUserId
      ? getOtherParticipant(activeChat, currentUserId)
      : null;

  // 3. Fetch messages only if we have successfully found an active chat.
  const { data: messagesResponse, isLoading: isLoadingMessages } =
    useGetMessagesQuery(activeChatId, { skip: !activeChatId || !activeChat });

  const [sendImageMessage, { isLoading: isUploadingImage }] =
    useSendImageMessageMutation();

  // --- SOCKET.IO EFFECT ---
  useEffect(() => {
    // Ensure we only join the chat when we have confirmed the active chat exists
    if (!socket || !isConnected || !activeChatId || !activeChat) return;

    console.log(`Socket emitting joinChat for room: ${activeChatId}`);
    socket.emit("joinChat", activeChatId);

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.chatId === activeChatId) {
        console.log("Received new message for active chat:", newMessage);
        dispatch(
          chatApi.util.updateQueryData("getMessages", activeChatId, (draft) => {
            if (
              draft.success &&
              !draft.data.data.find((m: Message) => m._id === newMessage._id)
            ) {
              draft.data.data.unshift(newMessage);
            }
          })
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, isConnected, activeChatId, dispatch, activeChat]); // Add activeChat dependency

  // --- UI EFFECTS ---
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesResponse]);

  // --- HANDLERS (No changes) ---
  const handleSendMessage = async () => {
    if (!activeChatId) return;

    if (selectedImage) {
      await sendImageMessage({
        chatId: activeChatId,
        attachment: selectedImage,
      }).unwrap();
      removeSelectedImage();
    } else if (newMessage.trim() && socket) {
      socket.emit("sendMessage", { chatId: activeChatId, text: newMessage });
      setNewMessage("");
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- HELPER FUNCTIONS (No changes) ---
  const getAvatarInitials = (name: string = ""): string =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  const getAvatarColor = (name: string = ""): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
    ];
    return colors[name.length % colors.length];
  };

  // --- RENDER LOGIC ---

  // 4. Handle the loading state explicitly. Show this while the chat list is being fetched.
  if (isLoadingChats || isChatsFetching) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Loading conversations...</p>
      </div>
    );
  }

  // 5. Handle the case where the query is done but the specific chat isn't found.
  // This could be because of a bad URL or if the user is not a participant.
  if (isChatsSuccess && (!activeChat || !otherUser)) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Chat not found or you dont have access.</p>
        <p className="text-sm">Please select a conversation from the list.</p>
      </div>
    );
  }

  // 6. If all checks pass, render the chat interface.
  // We can safely assume activeChat and otherUser are available here.
  return (
    <>
      {/* Chat Header */}
      <div className="p-5 border-b border-gray-200 bg-white flex items-center">
        <div
          className={`relative flex-shrink-0 h-10 w-10 rounded-full ${getAvatarColor(
            otherUser!.firstName
          )} flex items-center justify-center text-white font-semibold`}
        >
          {otherUser!.avatar ? (
            <Image
              src={otherUser!.avatar}
              alt={otherUser!.firstName}
              layout="fill"
              className="rounded-full object-cover"
            />
          ) : (
            getAvatarInitials(otherUser!.firstName)
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold">
            {otherUser!.firstName} {otherUser!.surname}
          </h2>
          <p
            className={`text-xs ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "Online" : "Disconnected"}
          </p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {isLoadingMessages ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            messagesResponse?.success &&
            [...messagesResponse.data.data].reverse().map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                    message.senderId === currentUserId
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.attachment && (
                    <Image
                      src={message.attachment as unknown as string}
                      alt="attachment"
                      width={250}
                      height={250}
                      className="rounded-lg mb-2 object-cover"
                    />
                  )}
                  {message.text && <p className="text-sm">{message.text}</p>}
                  <p
                    className={`text-xs mt-1 text-right ${
                      message.senderId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Image Preview & Message Input (No changes) */}
      {imagePreview && (
        <div className="p-4 bg-gray-200 border-t border-gray-300">
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Preview"
              width={96}
              height={96}
              className="h-24 w-24 object-cover rounded-lg border"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="p-5 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={isUploadingImage}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer bg-gray-200 p-3 rounded-lg ${
              isUploadingImage || selectedImage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            <Upload />
          </label>
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!!selectedImage || isUploadingImage}
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={
                (!newMessage.trim() && !selectedImage) || isUploadingImage
              }
              className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isUploadingImage ? "Sending..." : <Send />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
