import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { NotificationsProvider } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<NotificationsProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</NotificationsProvider>
	</React.StrictMode>
);
