import { checkAdminLoggedIn } from "@/services/auth";
import { getAllbook } from "@/services/books";
import { addLendAdmin, getLendById, updateLendAdmin } from "@/services/lend";
import { getAllMember } from "@/services/members";
import {
	Input,
	Paper,
	Text,
	Select,
	Stack,
	Button,
	Checkbox,
} from "@mantine/core";
import {
	DatePicker,
	DateRangePicker,
	DateRangePickerValue,
} from "@mantine/dates";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function FormLend({ mode }: { mode: string }) {
	const [form, setForm] = useState({
		id_book: NaN,
		id_anggota: NaN,
		status_peminjaman: "",
	});
	const [books, setBooks] = useState([]);
	const [members, setMembers] = useState([]);
	const [datepick, setDatepick] = useState<DateRangePickerValue>([
		new Date(),
		new Date(),
	]);
	const [returnDate, setReturnDate] = useState(new Date());
	const [missing, setMissing] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	async function addLend(e: SyntheticEvent) {
		e.preventDefault();
		// console.log(form);
		// console.log(datepick);
		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const formData = {
			id_buku: form.id_book,
			id_anggota: form.id_anggota,
			tgl_pinjam: datepick[0],
			tgl_kembali: datepick[1],
			status_peminjaman: "sedang dipinjam",
		};
		const response = await addLendAdmin(formData);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Added Lend Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/lends");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Add Lend",
				message: response.data.Error ?? "Internal Server",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});
		}
	}

	async function updateLend(e: SyntheticEvent) {
		e.preventDefault();
		// console.log(form);
		// console.log(datepick);
		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const formData = new FormData();
		formData.append("id_peminjaman", id);
		formData.append("status_peminjaman", missing ? "hilang" :form.status_peminjaman);
		formData.append("tgl_dikembalikan", missing ? null : returnDate.toISOString());

		const response = await updateLendAdmin(formData);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Updated Lend Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/lends");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Update Lend",
				message: response.data.Error ?? "Internal Server",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});
		}
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

		async function getLend() {
			const response = await getLendById(id);
			if (response.status === 200) {
				setForm({
					id_book: response.data.id_buku,
					id_anggota: response.data.id_anggota,
					status_peminjaman: response.data.status_peminjaman,
				});
				setDatepick([
					new Date(response.data.tgl_pinjam),
					new Date(response.data.tgl_kembali),
				]);
			}
		}

		if (id) {
			getLend();
		}
		getMemberData();
		getBookData();
	}, [id]);

	return (
		<Paper p="lg">
			<Text size="lg" weight="bold" mb="xl">
				{mode} Data Peminjaman
			</Text>

			<form
				onSubmit={(e) => (mode === "Edit" ? updateLend(e) : addLend(e))}
				encType="multipart/form-data"
			>
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
						required
						disabled={mode === "Edit"}
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
						required
						disabled={mode === "Edit"}
					/>

					{mode === "Edit" ? (
						<>
							<Checkbox
								checked={missing}
								label="Buku Hilang ?"
								onChange={(event) => setMissing(event.currentTarget.checked)}
							/>

							<DatePicker
								placeholder="Pick date"
								label="Tanggal Dikembalikan"
								onChange={setReturnDate}
								value={returnDate}
								disabled={missing}
							/>
						</>
					) : (
						""
					)}

					<DateRangePicker
						label="Tentukan Tanggal Pinjam - Tanggal Kembali"
						placeholder="Pick dates range"
						value={datepick}
						required
						onChange={setDatepick}
						disabled={mode === "Edit"}
					/>
					<Button color="teal" type="submit">
						{mode === "Tambah" ? "Tambah Peminjaman" : "Update Peminjaman"}
					</Button>
				</Stack>
			</form>
		</Paper>
	);
}
