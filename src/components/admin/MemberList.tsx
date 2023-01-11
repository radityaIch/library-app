import { deleteMemberAdmin, getAllMember } from "@/services/members";
import { Paper, Group, Button, Input, Text, Table } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconSearch, IconX } from "@tabler/icons";
import { SyntheticEvent, useEffect, useState } from "react";
import Fuse from "fuse.js";

export function MemberList() {
	const [members, setMembers] = useState([]);
	const [OriMembers, setOriMembers] = useState([]);

	async function deleteMember(id: number) {
		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const response = await deleteMemberAdmin(id);

		if (response.status === 204) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Delete Member Succesfully",
				message: "Page will refresh a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			getMembers();
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Delete Member",
				message: response?.response?.data?.error[0] ?? "Internal Server",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 5000,
			});
			return;
		}
	}

	const options = {
		includeScore: true,
		includeMatches: true,
		keys: ["name", "phone", "email"],
	};

	function fuzzySearch(text: SyntheticEvent) {
		const fuse = new Fuse(OriMembers, options);

		const result = fuse.search(text.target.value);
		const res = result.map((r) => r.item);
		setMembers(res);
	}

	async function getMembers() {
		const response = await getAllMember();

		if (response.status === 200) {
			setMembers(response.data);
			setOriMembers(response.data);
		}
	}

	useEffect(() => {
		getMembers();
	}, []);

	return (
		<Paper shadow="xl" p="md">
			<Group position="apart" mb={20}>
				<Text size={28} weight={500}>
					Data Anggota
				</Text>

				<Group>
					<Button
						component="a"
						href="members/member/create"
						variant="subtle"
						color="blue"
						radius="md"
					>
						Tambah Data Anggota
					</Button>

					<Input
						icon={<IconSearch />}
						placeholder="Search Your Member"
						onChange={(e) =>
							e.target.value ? fuzzySearch(e) : setMembers(OriMembers)
						}
					></Input>
				</Group>
			</Group>

			<Table>
				<thead>
					<tr>
						<th>No</th>
						<th>Nama</th>
						<th>Email</th>
						<th>No. Telp (WA)</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{members.length <= 0 ? (
						<tr>
							<td colSpan={5}>No Data</td>
						</tr>
					) : (
						members.map((member, index) => (
							<tr key={member.id}>
								<td>{(index += 1)}</td>
								<td>{member.name}</td>
								<td>
									<Text
										color="red"
										component="a"
										target="_blank"
										href={`mailto://${member.email}`}
									>
										{member.email}
									</Text>
								</td>
								<td>
									<Text
										color="teal"
										component="a"
										target="_blank"
										href={`https://wa.me/${member.phone}?text=`}
									>
										{`0${member.phone.substring(2)}`}
									</Text>
								</td>
								<td>
									<Group>
										<Button component="a" href={`members/member/${member.id}`}>
											Edit
										</Button>
										<Button color="red" onClick={() => deleteMember(member.id)}>
											Hapus
										</Button>
									</Group>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>
		</Paper>
	);
}
