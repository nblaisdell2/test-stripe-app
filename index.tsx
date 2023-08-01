import "./styles/index.css";
import { config } from "dotenv";
config();

import React from "react";
import { createRoot } from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./src/routes/Home";
import ErrorPage from "./src/ErrorPage";
import Activity from "./src/routes/Activity";
import Subscription from "./src/routes/Subscription";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/activity",
    element: <Activity />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root") as Element);
root.render(
  <QueryClientProvider client={queryClient}>
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN as string}
      clientId={process.env.AUTH0_CLIENT_ID as string}
      authorizationParams={{ redirect_uri: process.env.AUTH0_REDIRECT_URI }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </QueryClientProvider>
);
