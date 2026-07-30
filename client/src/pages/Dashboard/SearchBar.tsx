import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

interface SearchBarProps {
	setTransferUser: (user: any) => void;
}

export default function SearchBar({ setTransferUser }: SearchBarProps) {
	const [filter, setFilter] = useState("");
	const [users, setUsers] = useState<any[]>([]);

	useEffect(() => {
		if (!filter.trim()) {
			setUsers([]);
			return;
		}

		const timer = setTimeout(async () => {
			try {
				const response = await axios.get(import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/user/bulk?filter=" + filter);
				setUsers(response.data.user);
			} catch (e) {
				console.error("Error fetching users");
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [filter]);

	return (
		<div className=" w-full h-fit flex flex-col gap-[10px] border border-[#D8E8F8] border-1 rounded-2xl py-4 px-5 shadow-[0px_5px_50px_0px_rgba(0,89,179,0.13)]">
			<div className="h-fit w-fit font-bold tracking-wide text-lg">Send Money</div>
			<div className="flex gap-3 w-full h-fit border rounded-md border-[#D8E8F8] border-1 pl-3 items-center">
				<CiSearch color="#0F72C9" size={"19px"} />
				<input
					type="text"
					placeholder="Search a friend to send money"
					className="w-full h-5 px-2 py-5 rounded-md border border-gray-300 focus:border-[#0099FF] focus:outline-none"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>
			</div>

			{users.length > 0 && (<div className="animate-search-expand mt-2 w-full max-h-48 overflow-y-auto border border-gray-200 rounded-md shadow-lg bg-white">
				{users.map(u => (
					<div key={u._id} className="p-3 border-b hover:bg-slate-100 cursor-pointer flex justify-between">
						<div className="flex gap-2">
							<div className="w-[42px] h-[42px] shrink-0 pb-[2px] bg-[#E5F2FF] text-[#0F72C9] flex justify-center items-center font-semibold rounded-full">
								{`${u.firstName[0]}${u.lastName[0]}`.toUpperCase()}
							</div>
							<div className="flex flex-col">
								<span className="font-semibold">{u.firstName} {u.lastName}</span>
								<span className="text-xs text-gray-500">@{u.username}</span>
							</div>
						</div>
						<button className="bg-[#0F72C9] text-white px-3 py-1 rounded text-sm"
							onClick={() => { setTransferUser(u); setFilter(""); }}>
							Send Money
						</button>
					</div>
				))}
			</div>)}
		</div>
	);
}