import { getFirebaseMessaging } from "@/firbase";
import { getToken } from "firebase/messaging";

const VAPID_KEY =
  "BOH3qFFDPoX_3GWFqAnukpUPznWG1Wv7pkzHVJNVaU_tlaRcgSKSRMmMWXlge-PJ9O9m_MslLOPB6T57cBm5BGc";

export const requestNotificationPermissionAndGetToken = async () => {
  // Call the getter to safely get the messaging instance
  const messaging = getFirebaseMessaging();

  // If messaging is null (e.g., on the server), we can't proceed.
  if (!messaging) {
    console.log("Firebase Messaging is not available in this environment.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
};
