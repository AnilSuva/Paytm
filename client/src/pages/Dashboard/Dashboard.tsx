import axios from "axios";

import PaytmLogo from "../../components/PaytmLogo"

import 'dotenv'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SendMoney from "../../components/SendMoney";
import Contacts from "./Contacts";
import SearchBar from "./SearchBar";


interface UserDetails {
	firstName: string,
	lastName: string,
	username: string
}

export default function Dashboard() {
	const navigate = useNavigate();

	const [transferUser, setTransferUser] = useState<any>(null);
	const [refreshContacts, setRefreshContacts] = useState(0);

	const [user, setUser] = useState<UserDetails | null>(null);
	const [balance, setBalance] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);


	async function fetchBalance() {
		try {

			const response = await axios.get(
				import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/account/balance",
				{ withCredentials: true }
			);
			setBalance(response.data.balance);

			const userResponse = await axios.get(
				import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/user/me",
				{ withCredentials: true }
			);
			setUser(userResponse.data);

		} catch (e) {
			if (axios.isAxiosError(e) && e.response?.status === 403) {
				navigate("/signin");
			} else {
				console.error("Error fetching balance or username", e);
			}
		} finally {
			setLoading(false);
		}
	}

	function handleTrasferSucess(){
		fetchBalance();
		setRefreshContacts(prev => prev+1);
	}

	useEffect(() => {
		handleTrasferSucess();
	}, []);

	return (
		<div className="w-screen h-screen bg-[#F7FBFF] flex flex-col items-center">

			{/* navbar */}
			<div className="dashbord-navigation-border flex justify-between w-full h-[72px] border-b border-[#D8E8F8] items-center md:px-[70px] px-[20px]">
				<PaytmLogo />
				<div className="w-fit flex flex-col gap-[10px] py-4 px-5">
					<div className="w-full h-fit flex flex-nowrap items-center gap-6">
						<button 
							onClick={() => navigate("/history")}
							className="text-[#0F72C9] font-medium hover:underline cursor-pointer"
						>
							History
						</button>
						<div className="w-[42px] h-[42px] pb-[2px] bg-[#E5F2FF] text-[#0F72C9] flex justify-center items-center font-semibold rounded-full">
							{user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "..."}
						</div>

						<div className="h-fit flex-1">
							<div className="w-fit h-fit text-base font-semibold ">{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</div>
							<div className="w-fit h-fit text-sm text-[#627D98]">@{user ? `${user.username}` : ""}</div>
						</div>

					</div>
				</div>
			</div>


			{/* main section */}
			<div className="max-w-[760px] h-fit w-full pt-7 px-5 flex flex-col gap-5">

				{/* Balance Card */}
				<div className="h-fit w-full flex flex-col border border-[#D8E8F8] border-1 rounded-2xl border-solid py-4 px-5 shadow-[0px_5px_50px_0px_rgba(0,89,179,0.13)]">
					<div className="h-fit font-bold text-[#627D98] text-[12px] tracking-wider">
						CURRENT BALANCE
					</div>
					<div className="text-[34px] font-bold">
						{loading ? "Loading..." : balance !== null ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
					</div>
					<div className="h-fit font-bold text-[#627D98] text-[12px] tracking-wider">
						Available to pay and transfer
					</div>
				</div>

				{/* serachBar */}
				<SearchBar setTransferUser={setTransferUser} />

				{/* Contacts */}
				<Contacts
					refreshTrigger={refreshContacts}
					setTransferUser={setTransferUser}
				/>

				<SendMoney
					balance={balance}
					transferUser={transferUser}
					onClose={() => setTransferUser(null)}
					onSuccess={handleTrasferSucess}
				/>

			</div>
		</div>
	);
}