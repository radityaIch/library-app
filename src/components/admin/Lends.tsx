import { getAllLend } from "@/services/lend";
import { Button, Group, Input, Paper, Table, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";

export function Lends() {
	const [lends, setLends] = useState();

	useEffect(() => {
		async function getLends() {
			const response = await getAllLend();
			if (response.status === 200) {
				const data = response.data;
				setLends(data);
			}
		}

		getLends();
	}, []);

	return (
		<Paper shadow="xl" p="md">
			<Group position="apart" mb={20}>
				<Text size={28} weight={500}>
					Data Buku
				</Text>

				<Group>
					<Button
						component="a"
						href="lends/lend/create"
						variant="subtle"
						color="blue"
						radius="md"
					>
						Tambah Data Peminjaman
					</Button>

					<Input icon={<IconSearch />} placeholder="Search Your Book"></Input>
				</Group>
			</Group>

			<Table>
				<thead>
					<tr>
						<th>No</th>
						<th>Peminjam</th>
						<th>Buku</th>
						<th>Tgl Pinjam</th>
						<th>Tgl Kembali</th>
						<th>Tgl Dikembalikan</th>
						<th>Status</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{lends?.map((lend, index) => (
						<tr key={lend.id}>
							<td>{(index += 1)}</td>
							<td>{lend.members.name}</td>
							<td>{lend.books.judul}</td>
							<td>{lend.tgl_pinjam}</td>
							<td>{lend.tgl_kembali}</td>
							<td>{lend.tgl_dikembalikan}</td>
							<td>{lend.status_peminjaman}</td>
							<td>
								{lend.status_peminjaman === "terlambat" ||
								lend.status_peminjaman === "sudah dikembalikan" ? (
									""
								) : (
									<Button>Update Status</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Paper>
	);
}
