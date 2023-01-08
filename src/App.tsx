import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { checkAdminLoggedIn, checkMemberLoggedIn } from "./services/auth";
import React from "react";
import { Center, Container, Loader } from "@mantine/core";

const Member = React.lazy(() => import("@/pages/Member"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const Login = React.lazy(() => import("@/pages/Login"));

export default function App() {
	const location = useLocation();

	useEffect(() => {
		async function getAdminLoggedIn() {
			const response = await checkAdminLoggedIn();
			if (response.status !== 200) {
				localStorage.clear();
				return;
			}
		}

		async function getMemberLoggedIn() {
			const response = await checkMemberLoggedIn();
			if (response.status !== 200) {
				localStorage.clear();
				return;
			}
		}

		if (location.pathname === "/admin/") {
			getAdminLoggedIn();
		} else if (location.pathname === "/member/") {
			getMemberLoggedIn();
		}
	}, []);

	return (
		<React.Suspense
			fallback={
				<Container>
					<Center sx={{ height: "100vh" }}>
						<Loader variant="bars" />
					</Center>
				</Container>
			}
		>
			<Routes>
				<Route
					path="/member/*"
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Member" ? (
							<Member />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/admin/*"
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<Admin />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>

				<Route path="/login" element={<Login role="Member" />} />
				<Route path="/hidden/login" element={<Login role="Admin" />} />
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/*" element={<h1>Not Found</h1>} />
			</Routes>
		</React.Suspense>
	);
}
