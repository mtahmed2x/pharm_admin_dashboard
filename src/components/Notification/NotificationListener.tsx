"use client";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "react-hot-toast";
import { getFirebaseMessaging } from "@/firbase";

export const NotificationListener = () => {
  useEffect(() => {
    const messaging = getFirebaseMessaging();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground notification received:", payload);

        if (payload.notification) {
          toast.success(
            `${payload.notification.title}: ${payload.notification.body}`
          );
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  return null;
};
