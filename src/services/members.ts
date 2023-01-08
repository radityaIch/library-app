import { default as axios } from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL as string;
const options = {
	headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
};

export function getAllMember() {
	const response = axios.get(`${baseurl}/auth/users`, options);
	return response;
}
