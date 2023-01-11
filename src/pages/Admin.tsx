import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";

import { useState, useEffect } from "react";
import {
	AppShell,
	Navbar,
	Header,
	Footer,
	Text,
	MediaQuery,
	Burger,
	useMantineTheme,
	Group,
	Avatar,
	Stack,
	NavLink,
	Menu,
	UnstyledButton,
} from "@mantine/core";

import {
	IconBooks,
	IconCheck,
	IconLayoutDashboard,
	IconLogout,
	IconUser,
} from "@tabler/icons";
import { Dashboard } from "@/components/admin/Dashboard";
import { Books } from "@/components/admin/Books";
import { adminLogout, checkAdminLoggedIn } from "@/services/auth";
import { showNotification, updateNotification } from "@mantine/notifications";
import { FormBook } from "@/components/admin/FormBook";
import { Lends } from "@/components/admin/Lends";
import { FormLend } from "@/components/admin/FormLend";
import { MemberList } from "@/components/admin/MemberList";
import { FormMember } from "@/components/admin/FormMember";

const navigations = [
	{
		icon: <IconLayoutDashboard size={24} stroke={1.5} />,
		label: "Dashboard",
		link: "/admin/",
	},
	{
		icon: <IconBooks size={24} stroke={1.5} />,
		label: "Buku",
		link: "/admin/books",
	},
	{
		icon: <IconBooks size={24} stroke={1.5} />,
		label: "Peminjaman",
		link: "/admin/lends",
	},
	{
		icon: <IconUser size={24} stroke={1.5} />,
		label: "Keanggotaan",
		link: "/admin/members",
	},
];

export default function Admin() {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const location = useLocation();
	const [activeNav, setActiveNav] = useState(location.pathname);

	const navigate = useNavigate();

	async function logout() {
		showNotification({
			id: "send-data",
			loading: true,
			title: "Log Out. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});
		const response = await adminLogout();

		if (response.status === 200) {
			localStorage.clear();

			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Logout Succesfully",
				message: "Have a nice day",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			setTimeout(() => {
				navigate("/login");
			}, 2000);
		}
	}

	useEffect(() => {
		function getAdminLoggedIn() {
			localStorage.getItem("_token") && localStorage.getItem("role") == "Admin"
				? ""
				: navigate("/hidden/login");
		}

		getAdminLoggedIn();
	}, []);

	return (
		<AppShell
			styles={{
				main: {
					background:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			}}
			navbarOffsetBreakpoint="sm"
			asideOffsetBreakpoint="sm"
			navbar={
				<Navbar
					p="md"
					hiddenBreakpoint="sm"
					hidden={!opened}
					width={{ sm: 200, lg: 300 }}
				>
					<Stack spacing="xs">
						{navigations.map((nav, index) => (
							<NavLink
								key={index}
								active={activeNav === nav.link}
								label={<Text weight={500}>{nav.label}</Text>}
								icon={nav.icon}
								onClick={() => {
									navigate(nav.link);
									setActiveNav(nav.link);
								}}
							/>
						))}
					</Stack>
				</Navbar>
			}
			footer={
				<Footer height={60} p="md">
					<Menu>
						<Menu.Target>
							<UnstyledButton>
								<Group spacing="xs">
									<Avatar
										size="sm"
										radius="xl"
										src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
									/>
									<Stack spacing={0}>
										<Text size="xs" weight={500}>
											Admin
										</Text>
										<Text size={10} weight={400}>
											Admin Library Staff
										</Text>
									</Stack>
								</Group>
							</UnstyledButton>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								color="red"
								icon={<IconLogout />}
								onClick={() => logout()}
							>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Footer>
			}
			header={
				<Header height={{ base: 50, md: 70 }} p="md">
					<div
						style={{ display: "flex", alignItems: "center", height: "100%" }}
					>
						<MediaQuery largerThan="sm" styles={{ display: "none" }}>
							<Burger
								opened={opened}
								onClick={() => setOpened((o) => !o)}
								size="sm"
								color={theme.colors.gray[6]}
								mr="xl"
							/>
						</MediaQuery>
						<Group spacing={6}>
							<IconBooks size={24} />
							<Text weight={500}>Library Management System</Text>
						</Group>
					</div>
				</Header>
			}
		>
			<Routes>
				<Route
					path={"*"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<h1>Not Found</h1>
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<Dashboard />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/books"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<Books />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/books/book/create"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormBook mode="Tambah" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/books/book/:id"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormBook mode="Edit" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/lends"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<Lends />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/lends/lend/create"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormLend mode="Tambah" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/lends/lend/:id"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormLend mode="Edit" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/members"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<MemberList />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/members/member/create"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormMember mode="Tambah" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
				<Route
					path={"/members/member/:id"}
					element={
						localStorage.getItem("_token") &&
						localStorage.getItem("role") === "Admin" ? (
							<FormMember mode="Edit" />
						) : (
							<Navigate to="/hidden/login" />
						)
					}
				/>
			</Routes>
		</AppShell>
	);
}
