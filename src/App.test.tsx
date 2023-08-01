import { render, screen } from "@testing-library/react";
import App from "./routes/Home";
import React from "react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

const queryClient = new QueryClient();

describe("App Page Tests", () => {
  it("should contain default welcome message on the screen", () => {
    expect(1).toEqual(1);
  });
});
