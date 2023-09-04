import "./styles/index.css";
import { config } from "dotenv";
config();

import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Home from "./src/routes/Home";
import Test from "./src/routes/Test";
import Activity from "./src/routes/Activity";
import Subscription from "./src/routes/Subscription";
import ErrorPage from "./src/components/ErrorPage";
import { AuthenticationGuard } from "./src/components/AuthenticationGuard";
import { Auth0ProviderWithNavigate } from "./src/components/Auth0WithNavigate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // If a query fails, don't retry
      retry: false,
      retryOnMount: false,
      // data is never considered stale
      staleTime: Infinity,

      // suspense: true,

      // // refetch options (shouldn't apply since data is never stale)
      // refetchInterval: 60000, // number of ms to refetch next
      // refetchIntervalInBackground: true, // true if refetch in background, false otherwise
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,

      // Default Query to run, can be overridden
      // queryFn: defaultQueryFn,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/activity",
    element: <AuthenticationGuard component={Activity} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/test",
    element: <Test />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/subscription",
    element: <AuthenticationGuard component={Subscription} />,
    errorElement: <ErrorPage />,
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <Auth0ProviderWithNavigate>
      <RouterProvider router={router} />
    </Auth0ProviderWithNavigate>
  </QueryClientProvider>
);
