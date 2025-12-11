import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import PWA Elements for camera support in web/webview contexts
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize PWA Elements
defineCustomElements(window);

createRoot(document.getElementById("root")!).render(<App />);
