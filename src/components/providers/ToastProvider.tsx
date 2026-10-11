
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "12px",
          background: "#202B23",
          color: "#fff",
        },
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
