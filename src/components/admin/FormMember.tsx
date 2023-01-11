import {
	addMemberAdmin,
	getMemberById,
	updateMember,
} from "@/services/members";
import { Button, Input, Paper, Stack, Text } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
	IconAt,
	IconCheck,
	IconHome,
	IconPhone,
	IconUser,
	IconX,
} from "@tabler/icons";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function FormMember({ mode }: { mode: string }) {
	const [form, setForm] = useState({
		nama: "",
		email: "",
		phone: "",
		address: "",
	});
	const navigate = useNavigate();
	const { id } = useParams();

	async function editMember(e: SyntheticEvent) {
		e.preventDefault();

		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const formData = new FormData();
		formData.append("id", id);
		formData.append("name", form.nama);
		formData.append("email", form.email);
		formData.append("phone", `62${form.phone.substring(1)}`);
		formData.append("address", form.address);
		const response = await updateMember(formData);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Updated Member Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/members");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Update Member",
				message: response?.response?.data?.error[0] ?? "Internal Server",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 5000,
			});
		}
	}

	async function addMember(e: SyntheticEvent) {
		e.preventDefault();

		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const formData = new FormData();
		formData.append("name", form.nama);
		formData.append("email", form.email);
		formData.append("phone", `62${form.phone.substring(1)}`);
		formData.append("address", form.address);
		const response = await addMemberAdmin(formData);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Add Member Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/members");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Add Member",
				message: response?.response?.data?.error[0] ?? "Internal Server",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 5000,
			});
		}
	}

	const updateInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, key: string) => {
			const { value } = event.target;

			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	useEffect(() => {
		async function getMemberData() {
			const response = await getMemberById(id);

			if (response.status === 200) {
				setForm({
					nama: response.data.name,
					email: response.data.email,
					phone: `0${response.data.phone.substring(2)}`,
					address: response.data.address,
				});
			}
		}

		if (id) {
			getMemberData();
		}
	}, [id]);

	return (
		<Paper p="lg">
			<Text size="lg" weight="bold" mb="xl">
				{mode} Data Anggota
			</Text>

			<form
				encType="multipart/form-data"
				onSubmit={(e) => (mode === "Edit" ? editMember(e) : addMember(e))}
			>
				<Stack spacing="lg">
					<Input.Wrapper label="Nama Lengkap" required>
						<Input
							icon={<IconUser />}
							placeholder="Masukan nama lengkap"
							onChange={(e): void => updateInput(e, "nama")}
							value={form.nama}
							required
						/>
					</Input.Wrapper>

					<Input.Wrapper label="Email" required>
						<Input
							icon={<IconAt />}
							placeholder="Masukan alamat email"
							onChange={(e): void => updateInput(e, "email")}
							value={form.email}
							required
						/>
					</Input.Wrapper>

					<Input.Wrapper label="No. Telp (WA) ex. 089xxxxxxx" required>
						<Input
							icon={<IconPhone />}
							placeholder="Masukan nomor telepon"
							onChange={(e): void => updateInput(e, "phone")}
							value={form.phone}
							required
						/>
					</Input.Wrapper>

					<Input.Wrapper label="Alamat" required>
						<Input
							icon={<IconHome />}
							placeholder="Masukan alamat pribadi"
							onChange={(e): void => updateInput(e, "address")}
							value={form.address}
							required
						/>
					</Input.Wrapper>

					<Button color="teal" type="submit">
						{mode === "Edit" ? "Update" : "Tambah"} Data Anggota
					</Button>
				</Stack>
			</form>
		</Paper>
	);
}
