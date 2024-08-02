import { QueryClientProvider, QueryClient } from "react-query";
import { StockProvider } from "./contexts/stockContext.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import React from "react";
import "./index.css";
import './lib/i18n';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <UserProvider>
          <StockProvider>
            <App />
          </StockProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
