import { checkAdminLoggedIn } from "@/services/auth";
import { getAllbook } from "@/services/books";
import { getAllMember } from "@/services/members";
import { Input, Paper, Text, Select, Stack, Button } from "@mantine/core";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { SyntheticEvent, useEffect, useState } from "react";

export function FormLend({ mode }: { mode: string }) {
	const [form, setForm] = useState({
		id_book: NaN,
		id_anggota: NaN,
		status_peminjaman: "sedang dipinjam",
	});
	const [books, setBooks] = useState([]);
	const [members, setMembers] = useState([]);
	const [datepick, setDatepick] = useState<DateRangePickerValue>([
		new Date(),
		new Date(),
	]);

	async function addLend(e: SyntheticEvent) {
		e.preventDefault();
		console.log(form);
		console.log(datepick);
	}

	useEffect(() => {
		async function getBookData() {
			const response = await getAllbook();
			if (response.status === 200) {
				const booksData = response.data.map((book) => ({
					value: book.id,
					label: book.judul,
				}));
				setBooks(booksData);
			}
		}

		async function getMemberData() {
			const response = await getAllMember();
			if (response.status === 200) {
				const membersData = response.data.map((member) => ({
					value: member.id,
					label: member.name,
				}));
				setMembers(membersData);
			}
		}

		getMemberData();
		getBookData();
	}, []);

	return (
		<Paper p="lg">
			<Text size="lg" weight="bold" mb="xl">
				{mode} Data Peminjaman
			</Text>

			<form onSubmit={(e) => addLend(e)}>
				<Stack>
					<Select
						label="Pilih Buku"
						placeholder="Pilih Salah Satu"
						data={books}
						onChange={(e): void => {
							setForm({ ...form, id_book: parseInt(e) ?? NaN });
						}}
						searchable
						nothingFound="No Book Found"
						value={form?.id_book}
					/>

					<Select
						label="Peminjam"
						placeholder="Pilih Salah Satu"
						data={members}
						onChange={(e): void => {
							setForm({ ...form, id_anggota: parseInt(e) ?? NaN });
						}}
						searchable
						nothingFound="No Member Found"
						value={form?.id_anggota}
					/>

					<DateRangePicker
						label="Tentukan Tanggal Pinjam - Tanggal Kembali"
						placeholder="Pick dates range"
						value={datepick}
						onChange={setDatepick}
					/>

					<Button color="teal" type="submit">
						Tambah Peminjaman
					</Button>
				</Stack>
			</form>
		</Paper>
	);
}
