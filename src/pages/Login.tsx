import {
	Card,
	Center,
	Container,
	Input,
	Text,
	PasswordInput,
	Stack,
	Button,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAt, IconLock, IconCheck, IconX } from "@tabler/icons";
import bg from "@/assets/bg.jpg";
import { adminLogin, memberLogin } from "@/services/auth";
import { SyntheticEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Role {
	role: "Admin" | "Member";
}

interface Login {
	email: string;
	password: string;
}

export default function Login({ role }: Role) {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	async function login(role: string, e: SyntheticEvent, data: Login) {
		e.preventDefault();

		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		if (role === "Admin") {
			const response = await adminLogin(form);
			if (response.status === 200) {
				localStorage.setItem("_token", response.data.access_token);
				localStorage.setItem("role", "Admin");

				updateNotification({
					id: "send-data",
					color: "teal",
					title: "Login Succesfully",
					message: "You will redirected to admin in 2 seconds",
					icon: <IconCheck size={16} />,
					disallowClose: true,
					autoClose: 2000,
				});

				setTimeout(() => {
					navigate("/admin");
				}, 2100);
			} else {
				updateNotification({
					id: "send-data",
					color: "red",
					title: "Login Failed",
					message: "Please check information correctly",
					icon: <IconX size={16} />,
					disallowClose: true,
					autoClose: 2000,
				});
			}
		} else if (role === "Member") {
			const response = await memberLogin(form);
			if (response.status === 200) {
				localStorage.setItem("_token", response.data.access_token);
				localStorage.setItem("role", "Member");

				updateNotification({
					id: "send-data",
					color: "teal",
					title: "Login Succesfully",
					message: "You will redirected to admin in 2 seconds",
					icon: <IconCheck size={16} />,
					disallowClose: true,
					autoClose: 2000,
				});

				setTimeout(() => {
					navigate("/member");
				}, 2100);
			} else {
				updateNotification({
					id: "send-data",
					color: "red",
					title: "Login Failed",
					message: "Please check information correctly",
					icon: <IconX size={16} />,
					disallowClose: true,
					autoClose: 2000,
				});
			}
		}
	}

	const updateInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = event.target;
			setForm({
				...form,
				[name]: value,
			});
		},
		[form]
	);

	return (
		<Container
			p={0}
			fluid
			sx={{ background: `url(${bg})`, backgroundSize: "cover" }}
		>
			<Center sx={{ height: "100vh" }}>
				<Card
					shadow="xl"
					py="xl"
					px="lg"
					radius="md"
					withBorder
					sx={{ width: "80vh" }}
				>
					<Text mb="xl" weight={500} size="lg">
						{role} Login
					</Text>

					<form onSubmit={(e) => login(role, e, form)}>
						<Stack>
							<Input.Wrapper label="Email" required>
								<Input
									icon={<IconAt />}
									placeholder="Your email"
									name="email"
									onChange={updateInput}
								/>
							</Input.Wrapper>

							<PasswordInput
								label="Password"
								placeholder="Your password"
								icon={<IconLock />}
								withAsterisk
								autoComplete="current-password"
								name="password"
								onChange={updateInput}
							/>

							<Button type="submit">Login</Button>
						</Stack>
					</form>
				</Card>
			</Center>
		</Container>
	);
}
