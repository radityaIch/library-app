import { default as axios } from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL as string;
const options = {
	headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
};

export function getAllMember() {
	const response = axios.get(`${baseurl}/auth/users`, options).catch((r) => r);
	return response;
}

export function addMemberAdmin(payload: FormData) {
	const response = axios
		.post(`${baseurl}/auth/user`, payload, options)
		.catch((r) => r);
	return response;
}

export function getMemberById(id: number) {
	const response = axios
		.get(`${baseurl}/auth/user/${id}`, options)
		.catch((r) => r);
	return response;
}

export function updateMember(payload: FormData) {
	const response = axios
		.patch(`${baseurl}/auth/user/${payload.get("id")}`, payload, options)
		.catch((r) => r);
	return response;
}

export function deleteMemberAdmin(id: number) {
	const response = axios
		.delete(`${baseurl}/auth/user/${id}`, options)
		.catch((r) => r);
	return response;
}
