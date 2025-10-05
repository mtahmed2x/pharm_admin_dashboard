"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetChatsQuery } from "@/api/chatApi";

// This component's sole purpose is to redirect to the first chat.
const MessagesRedirectPage = () => {
  const router = useRouter();
  const { data: chatsResponse, isLoading } = useGetChatsQuery();

  useEffect(() => {
    if (
      !isLoading &&
      chatsResponse?.success &&
      chatsResponse.data.data.length > 0
    ) {
      const firstChatId = chatsResponse.data.data[0]._id;
      // *** FIX: Added /dashboard to the path ***
      router.replace(`/dashboard/messages/${firstChatId}`);
    }
  }, [isLoading, chatsResponse, router]);

  // Render a loading state while we determine where to redirect.
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-gray-500">Finding your conversations...</p>
    </div>
  );
};

export default MessagesRedirectPage;
