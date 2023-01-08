import { Paper } from "@mantine/core";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Statistik Peminjaman Buku Seminggu Terakhir",
		},
	},
};

const labels = [];
const date = new Date();
for (let index = 0; index < 7; index++) {
	const newDate = date.setDate(date.getDate() + 1);
	labels.push(
		`${new Date(newDate).getDate()}/${
			new Date(newDate).getMonth() + 1
		}/${new Date(newDate).getFullYear()}`
	);
}

export const data = {
	labels,
	datasets: [
		{
			label: "Peminjaman",
			data: labels.map(() => Math.random()),
			borderColor: "rgb(53, 162, 235)",
			backgroundColor: "rgba(53, 162, 235, 0.5)",
		},
		{
			label: "Keterlambatan",
			data: labels.map(() => Math.random()),
			borderColor: "rgb(153, 132, 235)",
			backgroundColor: "rgba(153, 132, 235, 0.5)",
		},
		{
			label: "Kehilangan",
			data: labels.map(() => Math.random()), //it's more  like array [12,32,123,13]
			borderColor: "rgb(255, 99, 132)",
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
	],
};

export function Dashboard() {
	return (
		<Paper shadow="xs" p="md">
			<Line options={options} data={data} />
		</Paper>
	);
}
