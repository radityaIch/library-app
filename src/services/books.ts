import { default as axios } from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL as string;

export function getAllbook() {
	const response = axios.get(`${baseurl}/books`).catch((r) => r);
	return response;
}

export function getAllCategories() {
	const response = axios.get(`${baseurl}/books/categories`).catch((r) => r);
	return response;
}

export function getBookById(id: Number) {
	const response = axios.get(`${baseurl}/books/book/${id}`).catch((r) => r);
	return response;
}

export function addBookData(payload: FormData) {
	const response = axios.post(`${baseurl}/books/book`, payload, {
		headers: {
			Authorization: `bearer ${localStorage.getItem("_token")}`,
		},
	}).catch((r) => r);

	return response;
}

export function updateBookData(payload: FormData) {
	const response = axios.patch(`${baseurl}/books/book/${payload.get('id_buku')}`, payload, {
		headers: {
			Authorization: `bearer ${localStorage.getItem("_token")}`,
		},
	}).catch((r) => r);

	return response;
}