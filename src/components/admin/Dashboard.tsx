import { getAllbook } from "@/services/books";
import { getAllLend } from "@/services/lend";
import { getAllMember } from "@/services/members";
import { Badge, Group, Paper } from "@mantine/core";

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
import { useEffect, useState } from "react";
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
			text: "Statistik Peminjaman Buku Tahun " + new Date().getFullYear(),
		},
	},
};

const labels = [];
const date = new Date();
for (let index = 0; index < 12; index++) {
	const newDate = date.setDate(date.getDate() + 1);
	labels.push(`${(new Date(newDate).getMonth() + index + 1).toLocaleString()}`);
}

export function Dashboard() {
	const [data, setData] = useState({
		labels,
		datasets: [
			{
				label: "Peminjaman",
				data: [],
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
			{
				label: "Keterlambatan",
				data: [],
				borderColor: "rgb(153, 132, 235)",
				backgroundColor: "rgba(153, 132, 235, 0.5)",
			},
			{
				label: "Kehilangan",
				data: [], //it's more  like array [12,32,123,13]
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	});
	const [stats, setStats] = useState({
		buku: NaN,
		member: NaN,
	});

	useEffect(() => {
		async function getStats() {
			const resp = await getAllLend();
			const respb = await getAllbook();
			const respc = await getAllMember();

			if (resp.status === 200) {
				const calculatedPerMonth = [];
				for (let index = 0; index < new Date().getMonth() + 1; index++) {
					const newData = resp.data.map((d, i) => {
						const dt = d.created_at.toString().split(/[- : T]/);

						const newDate = new Date(dt[0], dt[1] - 1, dt[2]);

						return {
							dates: newDate,
							status: d.status_peminjaman,
						};
					});

					calculatedPerMonth.push({
						totalLends: newData.map((d) => d.dates.getMonth() === index).length,
						late: newData.filter(
							(d) => d.dates.getMonth() === index && d.status === "terlambat"
						).length,
						missing: newData.filter(
							(d) => d.dates.getMonth() === index && d.status === "hilang"
						).length,
					});
				}
				setData({
					...data,
					datasets: [
						{
							label: "Peminjaman",
							data: calculatedPerMonth.map((c) => c.totalLends),
							borderColor: "rgb(53, 162, 235)",
							backgroundColor: "rgba(53, 162, 235, 0.5)",
						},
						{
							label: "Keterlambatan",
							data: calculatedPerMonth.map((c) => c.late),
							borderColor: "rgb(153, 132, 235)",
							backgroundColor: "rgba(153, 132, 235, 0.5)",
						},
						{
							label: "Kehilangan",
							data: [], //it's more  like array [12,32,123,13]
							borderColor: "rgb(255, 99, 132)",
							backgroundColor: "rgba(255, 99, 132, 0.5)",
						},
					],
				});
			}

			if (respb.status === 200) {
				setStats({ ...stats, buku: respb.data.length });
			}

			if (respc.status === 200) {
				setStats({ ...stats, member: respc.data.length });
			}
		}

		getStats();
	}, []);

	return (
		<Paper shadow="xs" p="md">
			<Group mb="xl">
				<Badge size="md" color="teal">
					Total Buku : {stats.buku}
				</Badge>
				<Badge size="md" color="red">
					Total Anggota : {stats.member}
				</Badge>
			</Group>
			<Line options={options} data={data} />
		</Paper>
	);
}
