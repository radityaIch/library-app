import {
	Badge,
	Button,
	Card,
	Paper,
	Text,
	Image,
	Group,
	Grid,
	Input,
	Divider,
	Loader,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons";

import { getAllbook } from "@/services/books";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";

interface BookCategory {
	id: number;
	category: string;
	created_at: string;
	updated_at: string;
}

interface Book {
	id: number;
	id_kategori: number;
	judul: string;
	deskripsi: string;
	author: string;
	cover_image: string;
	qty: string;
	book_category: BookCategory;
}

export function Books() {
	const [data, setData] = useState<Book[]>([]);

	const baseStorage = import.meta.env.VITE_STORAGE_BOOK_IMAGE_URL as string;

	useEffect(() => {
		async function fetchAll() {
			const response = await getAllbook();
			if (response.status === 200) {
				setData(response.data);
			} else {
				showNotification({
					id: "send-data",
					color: "red",
					title: "Internal Server Error",
					message:
						"Please refresh page, if not changes please contact administrator",
					icon: <IconX size={16} />,					
					autoClose: 2000,
				});
			}
		}

		fetchAll();
	}, []);

	return (
		<Paper shadow="xl" p="md">
			<Group position="apart">
				<Text size={28} weight={500}>
					Data Buku
				</Text>

				<Group>
					<Button
						component="a"
						href="books/book/create"
						variant="subtle"
						color="blue"
						radius="md"
					>
						Tambah Data Buku
					</Button>

					<Input icon={<IconSearch />} placeholder="Search Your Book"></Input>
				</Group>
			</Group>

			<Divider mt={12} mb={24} />

			<Grid>
				{data.map((item) => (
					<Grid.Col span={4} key={item.id}>
						<Card shadow="sm" p="lg" radius="md" withBorder>
							<Card.Section>
								<Image
									src={`${baseStorage}/${item.cover_image}`}
									height={200}
									alt="Norway"
								/>
							</Card.Section>

							<Group position="apart" mt="md" mb="xs">
								<Text weight={500}>{item.judul}</Text>
								<Group>
									<Badge size="sm" color="gray" variant="light">
										{item.author}
									</Badge>
									<Badge size="sm" color="pink" variant="light">
										{item.book_category.category}
									</Badge>
								</Group>
							</Group>

							<Text size="sm" color="dimmed">
								{item.deskripsi}
							</Text>

							<Button
								component="a"
								href={`/admin/books/book/${item.id}`}
								variant="light"
								color="blue"
								fullWidth
								mt="md"
								radius="md"
							>
								Update Data Buku
							</Button>
						</Card>
					</Grid.Col>
				))}
			</Grid>
		</Paper>
	);
}
