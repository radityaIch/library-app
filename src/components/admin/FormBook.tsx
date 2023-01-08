import {
	Grid,
	Input,
	Paper,
	Group,
	Text,
	useMantineTheme,
	Image,
	Textarea,
	Stack,
	Select,
	NumberInput,
	Button,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX, IconCheck } from "@tabler/icons";
import { IconAt } from "@tabler/icons";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
	addBookData,
	getAllCategories,
	getBookById,
	updateBookData,
} from "@/services/books";
import { useNavigate, useParams } from "react-router-dom";

interface BookCategory {
	id: Number;
	category: string;
}

interface Book {
	id: Number;
	id_kategori: Number;
	judul: string;
	deskripsi: string;
	author: string;
	cover_image: File | null | string;
	qty: Number;
}

const baseStorage = import.meta.env.VITE_STORAGE_BOOK_IMAGE_URL as string;

export function FormBook({ mode }: { mode: string }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const theme = useMantineTheme();
	const [form, setForm] = useState<Book>({
		id: NaN,
		id_kategori: NaN,
		judul: "",
		deskripsi: "",
		author: "",
		cover_image: null,
		qty: NaN,
	});
	const [categories, setCategories] = useState<[]>([]);
	const [thumbnail, setThumbnail] = useState();

	const updateInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, key: keyof Book) => {
			const { value } = event.target;

			setForm({
				...form,
				[key]: value,
			});
		},
		[form]
	);

	async function addBook(e: SyntheticEvent, payload: Book) {
		e.preventDefault();
		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const dataform = new FormData();
		dataform.append("id_kategori", payload.id_kategori.toString());
		dataform.append("judul", payload.judul);
		dataform.append("deskripsi", payload.deskripsi);
		dataform.append("author", payload.author);
		dataform.append("cover_image", payload.cover_image);
		dataform.append("qty", payload.qty.toString());

		const response = await addBookData(dataform);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Added Book Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/books");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Add Book",
				message: "Please check information correctly",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});
		}
	}

	async function editBook(e: SyntheticEvent, payload: Book) {
		e.preventDefault();
		showNotification({
			id: "send-data",
			loading: true,
			title: "Loading. . . . ",
			message: "Please Wait. . .",
			autoClose: false,
			disallowClose: true,
		});

		const dataform = new FormData();
		dataform.append("id_buku", payload.id.toString());
		dataform.append("id_kategori", payload.id_kategori.toString());
		dataform.append("judul", payload.judul);
		dataform.append("deskripsi", payload.deskripsi);
		dataform.append("author", payload.author);
		dataform.append("cover_image", payload.cover_image);
		dataform.append("qty", payload.qty.toString());

		const response = await updateBookData(dataform);

		if (response.status === 201) {
			updateNotification({
				id: "send-data",
				color: "teal",
				title: "Update Book Succesfully",
				message: "You will redirected to admin a few second",
				icon: <IconCheck size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});

			navigate("/admin/books");
		} else {
			updateNotification({
				id: "send-data",
				color: "red",
				title: "Failed to Update Book",
				message: "Please check information correctly",
				icon: <IconX size={16} />,
				disallowClose: true,
				autoClose: 2000,
			});
		}
	}

	useEffect(() => {
		async function getBookCategories() {
			const response = await getAllCategories();
			if (response.status === 200) {
				const data = response.data;
				const categoriesData = data.map((data: BookCategory) => ({
					value: data.id,
					label: data.category,
				}));
				setCategories(categoriesData);
			}
		}

		async function getBookData(id: Number) {
			const response = await getBookById(id);
			if (response.status === 200) {
				// console.log(response.data);
				if (categories) {
					setForm({
						id: id,
						id_kategori: response.data.id_kategori,
						judul: response.data.judul,
						deskripsi: response.data.deskripsi,
						author: response.data.author,
						cover_image: `${baseStorage}/${response.data.cover_image}`,
						qty: parseInt(response.data.qty),
					});
					setThumbnail(`${baseStorage}/${response.data.cover_image}`);
				}
			} else {
				navigate("/admin/books");
			}
		}

		getBookCategories();
		if (id) {
			getBookData(parseInt(id));
		}
	}, [id]);

	return (
		<Paper p="lg">
			<Text size="lg" weight="bold" mb="xl">
				{mode} Data Buku
			</Text>

			<form
				encType="multipart/form-data"
				onSubmit={(e) =>
					mode === "Edit" ? editBook(e, form) : addBook(e, form)
				}
			>
				<Grid>
					<Grid.Col span={4}>
						<Dropzone
							multiple={false}
							onDrop={(file) => {
								// console.log(file);
								const tbn = URL.createObjectURL(file[0]);
								setThumbnail(tbn)
								setForm({ ...form, cover_image: file[0] });
							}}
							onReject={(files) => {
								showNotification({
									id: "send-data",
									color: "red",
									title: files[0].errors[0].message,
									message:
										"Please check file correctly or pick another image or convert it",
									icon: <IconX size={16} />,
									autoClose: 5000,
								});
							}}
							maxSize={2 * 1024 ** 2}
							accept={IMAGE_MIME_TYPE}
						>
							<Group
								position="center"
								spacing="xl"
								style={{ minHeight: 220, pointerEvents: "none" }}
							>
								<Dropzone.Accept>
									<IconUpload
										size={50}
										stroke={1.5}
										color={
											theme.colors[theme.primaryColor][
												theme.colorScheme === "dark" ? 4 : 6
											]
										}
									/>
								</Dropzone.Accept>
								<Dropzone.Reject>
									<IconX
										size={50}
										stroke={1.5}
										color={
											theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
										}
									/>
								</Dropzone.Reject>
								<Dropzone.Idle>
									{form?.cover_image ? (
										<Image src={thumbnail} />
									) : (
										<IconPhoto size={50} stroke={1.5} />
									)}
								</Dropzone.Idle>

								<div>
									<Text size="xl" inline>
										Drag images here or click to select images
									</Text>
									<Text size="sm" color="dimmed" inline mt={7}>
										Cover Image doesn't exceed 2 mb
									</Text>
								</div>
							</Group>
						</Dropzone>
					</Grid.Col>

					<Grid.Col span={8}>
						<Stack spacing="lg">
							<Select
								label="Kategori"
								placeholder="Pilih Salah Satu"
								data={categories}
								onChange={(e): void => {
									setForm({ ...form, id_kategori: parseInt(e) ?? NaN });
								}}
								value={form?.id_kategori}
							/>

							<Input.Wrapper label="Judul Buku" required>
								<Input
									icon={<IconAt />}
									placeholder="Judul Buku"
									onChange={(e): void => updateInput(e, "judul")}
									value={form.judul}
								/>
							</Input.Wrapper>

							<Input.Wrapper label="Author" required>
								<Input
									icon={<IconAt />}
									placeholder="Nama Author"
									onChange={(e): void => updateInput(e, "author")}
									value={form.author}
								/>
							</Input.Wrapper>

							<Textarea
								placeholder="Deskripsi Buku"
								label="Deskripsi"
								withAsterisk
								onChange={(e): void => updateInput(e, "deskripsi")}
								value={form.deskripsi}
							/>

							<NumberInput
								label="Stok"
								stepHoldDelay={500}
								stepHoldInterval={100}
								onChange={(e): void => setForm({ ...form, qty: e ?? NaN })}
								value={form.qty}
							/>

							<Button type="submit" color="teal">
								{mode === "Edit" ? "Update" : "Tambah"}
							</Button>
						</Stack>
					</Grid.Col>
				</Grid>
			</form>
		</Paper>
	);
}
