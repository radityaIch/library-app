import { getAllLend } from "@/services/lend";
import { Button, Group, Input, Paper, Table, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

export function Lends() {
	const [lends, setLends] = useState([]);
	const [originalLends, setOriginalLends] = useState([]);

	const options = {
		includeScore: true,
		includeMatches: true,
		keys: ["members.name", "members.phone", "books.judul"],
	};

	// @ts-ignore
	function fuzzySearch(text: SyntheticEvent) {
		const fuse = new Fuse(originalLends, options);

		const result = fuse.search(text.target.value);
		const res = result.map((r) => r.item);
		setLends(res);
	}

	useEffect(() => {
		async function getLends() {
			const response = await getAllLend();
			if (response.status === 200) {
				const data = response.data;
				setLends(data);
				setOriginalLends(data);
			}
		}

		getLends();
	}, []);

	return (
		<Paper shadow="xl" p="md">
			<Group position="apart" mb={20}>
				<Text size={28} weight={500}>
					Data Peminjaman
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

					<Input
						icon={<IconSearch />}
						placeholder="Search Your Lend"
						onChange={(e) =>
							e.target.value ? fuzzySearch(e) : setLends(originalLends)
						}
					></Input>
				</Group>
			</Group>

			<Table>
				<thead>
					<tr>
						<th>No</th>
						<th>Peminjam</th>
						<th>No. Telp (WA)</th>
						<th>Buku</th>
						<th>Tgl Pinjam</th>
						<th>Tgl Kembali</th>
						<th>Tgl Dikembalikan</th>
						<th>Status</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{lends?.length <= 0 ? (
						<tr>
							<td colSpan={9}>No Data</td>
						</tr>
					) : (
						lends?.map((lend, index) => (
							// @ts-ignore
							<tr key={lend.id}>
								<td>{(index += 1)}</td>
								<td>
									{
										// @ts-ignore
										lend.members.name
									}
								</td>
								<td>
									<Text
										color="teal"
										component="a"
										target="_blank"
										href={
											// @ts-ignore
											`https://wa.me/${lend.members.phone}?text=`
										}
									>
										{
											// @ts-ignore
											`0${lend.members.phone.substring(2)}`
										}
									</Text>
								</td>
								<td>
									{
										// @ts-ignore
										lend.books.judul
									}
								</td>
								<td>
									{
										// @ts-ignore
										lend.tgl_pinjam
									}
								</td>
								<td>
									{
										// @ts-ignore
										lend.tgl_kembali
									}
								</td>
								<td>
									{
										// @ts-ignore
										lend.tgl_dikembalikan
									}
								</td>
								<td>
									{
										// @ts-ignore
										lend.status_peminjaman
									}
								</td>
								<td>
									{
										// @ts-ignore
										lend.status_peminjaman === "terlambat" ||
										// @ts-ignore
										lend.status_peminjaman === "sudah dikembalikan" ||
										// @ts-ignore
										lend.status_peminjaman === "hilang" ? (
											""
										) : (
											<Button
												component="a"
												href={
													// @ts-ignore
													`/admin/lends/lend/${lend.id}`
												}
											>
												Update Status
											</Button>
										)
									}
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>
		</Paper>
	);
}
