import { default as axios } from "axios";

const baseurl = import.meta.env.VITE_API_BASE_URL as string;

const options = {
	headers: { Authorization: `Bearer ${localStorage.getItem("_token")}` },
};

export function getAllLend() {
	const response = axios.get(`${baseurl}/lends/`);
	return response;
}

export function addLendAdmin(payload){
	const response = axios.post(`${baseurl}/lends/lend/add`, payload, options)
	return response
}
