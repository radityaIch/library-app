import { default as axios } from "axios";

interface Login {
	email: string;
	password: string;
}

const baseurl = import.meta.env.VITE_API_BASE_URL as string;

const options = {
	headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
};

export function adminLogin(form: Login) {
	const response = axios
		.post(`${baseurl}/auth/admin/login`, {
			email: form.email,
			password: form.password,
		})
		.then((res) => res).catch((r) => r);

	return response;
}

export function adminLogout() {
	const response = axios.get(`${baseurl}/auth/admin/logout`, options).catch((r) => r);
	return response;
}

export function checkAdminLoggedIn() {
	const response = axios
		.get(`${baseurl}/auth/admin/logged_in`, options)
		.then((res) => res)
		.catch((err) => err);
	return response;
}

export function memberLogin(form: Login) {
	const response = axios
		.post(`${baseurl}/auth/login`, {
			email: form.email,
			password: form.password,
		})
		.then((res) => res).catch((r) => r);

	return response;
}

export function checkMemberLoggedIn() {
	const response = axios
		.get(`${baseurl}/auth/logged_in`, options)
		.then((res) => res)
		.catch((err) => err);
	return response;
}
