import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaytmLogo from "../components/PaytmLogo";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

interface Transaction {
    _id: string;
    amount: number;
    createdAt: string;
    senderId: {
        _id: string;
        firstName: string;
        lastName: string;
        username: string;
    };
    receiverId: {
        _id: string;
        firstName: string;
        lastName: string;
        username: string;
    };
}

export default function History() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                setLoading(true);
                // First get user details to know if we are sender or receiver
                const userResponse = await axios.get(
                    import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/user/me",
                    { withCredentials: true }
                );
                
                setCurrentUserId(userResponse.data.username);

                const response = await axios.get(
                    import.meta.env.VITE_BACKEND_ROUTE + `/api/v1/account/history?page=${page}&limit=10`,
                    { withCredentials: true }
                );
                
                setTransactions(response.data.transactions);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching history", error);
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    navigate("/signin");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [page, navigate]);

    return (
        <div className="w-screen min-h-screen bg-[#F7FBFF] flex flex-col items-center">
            {/* Navbar */}
            <div className="dashbord-navigation-border flex justify-between w-full h-[72px] border-b border-[#D8E8F8] items-center px-[70px] bg-white sticky top-0 z-10">
                <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <PaytmLogo />
                </div>
                <div className="w-fit flex items-center gap-6">
                    <button 
                        onClick={() => navigate("/dashboard")}
                        className="text-[#0F72C9] font-medium hover:underline cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[760px] h-fit w-full pt-8 px-5 flex flex-col gap-5 pb-10">
                <h1 className="text-2xl font-bold text-[#1C2C40]">Transaction History</h1>

                <div className="bg-white border border-[#D8E8F8] rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-[#627D98]">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center text-[#627D98]">No transactions found.</div>
                    ) : (
                        <div className="flex flex-col">
                            {transactions.map((tx) => {
                                const isSender = tx.senderId.username === currentUserId;
                                const counterParty = isSender ? tx.receiverId : tx.senderId;
                                const amountColor = isSender ? "text-red-500" : "text-green-500";
                                const sign = isSender ? "-" : "+";
                                const Icon = isSender ? FiArrowUpRight : FiArrowDownLeft;
                                const date = new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div key={tx._id} className="flex justify-between items-center p-5 border-b border-[#E5F2FF] last:border-b-0 hover:bg-[#F7FBFF] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSender ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#1C2C40]">
                                                    {isSender ? "Sent to " : "Received from "}
                                                    {counterParty.firstName} {counterParty.lastName}
                                                </span>
                                                <span className="text-xs text-[#627D98]">{date}</span>
                                            </div>
                                        </div>
                                        <div className={`font-bold text-lg ${amountColor}`}>
                                            {sign}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 border border-[#D8E8F8] rounded-lg bg-white text-[#0F72C9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7FBFF]"
                        >
                            Previous
                        </button>
                        <span className="text-[#627D98] text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="px-4 py-2 border border-[#D8E8F8] rounded-lg bg-white text-[#0F72C9] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7FBFF]"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
