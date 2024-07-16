import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./Context";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import theme from "./theme";
import { WagmiProvider } from "wagmi";
import { config } from "./utils/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import "@fontsource/montserrat"; // Defaults to weight 400
// import "@fontsource/montserrat/400.css"; // Specify weight
// import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
import { Toaster } from "react-hot-toast";
import "./utils/web3modal";

// import "@fontsource/montserrat/200.css";
// import "@fontsource/montserrat/300.css";
// import "@fontsource/montserrat/400.css";
// import "@fontsource/montserrat/500.css";

// import "@fontsource/montserrat/600.css";
// import "@fontsource/montserrat/700.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <Provider store={store}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <Toaster />
              <ChakraProvider theme={theme}>
                <App />
              </ChakraProvider>
            </AppProvider>
          </QueryClientProvider>
        </Router>
      </Provider>
    </WagmiProvider>
  </React.StrictMode>
);
