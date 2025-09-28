"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "../store";
import { NotificationListener } from "./Notification/NotificationListener";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationListener />
      {children}
      <Toaster />
    </Provider>
  );
}
