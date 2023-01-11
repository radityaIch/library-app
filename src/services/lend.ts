import { default as axios } from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL as string;

const options = {
	headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
};

export function getAllLend() {
	const response = axios.get(`${baseurl}/lends/`).catch((r) => r);
	return response;
}

export function getLendById(id: number) {
	const response = axios.get(`${baseurl}/lends/lend/${id}`).catch((r) => r);
	return response;
}

export function addLendAdmin(payload: FormData) {
	const response = axios.post(`${baseurl}/lends/lend/add`, payload, options).catch((r) => r);
	return response;
}

export function updateLendAdmin(payload: FormData) {
	const response = axios.post(`${baseurl}/lends/lend/${payload.get("id_peminjaman")}`, payload, {
		headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
	}).catch((r) => r);
	return response;
}
