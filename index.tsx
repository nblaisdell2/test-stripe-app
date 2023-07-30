import "./styles/index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root") as Element);
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
