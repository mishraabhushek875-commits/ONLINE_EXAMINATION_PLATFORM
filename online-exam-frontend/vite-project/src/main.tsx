import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import FirefliesBackground from "./Components/FireFlies.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <FirefliesBackground>
          <App />
        </FirefliesBackground>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
