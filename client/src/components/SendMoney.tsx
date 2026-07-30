import axios from "axios";
import { useState } from "react";


interface props {
    balance? : number;
    transferUser: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SendMoney({transferUser, onClose, onSuccess, balance}: props){
    const [amount, setAmount] = useState("");


    // in the case user is not selected
    if(!transferUser) return null;

    const isInsufficient = typeof balance === 'number' && Number(amount) > balance;

    const handleTransfer = async () =>{
        
        try{
            await axios.post(import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/account/transfer",
                {
                    to: transferUser._id,
                    amount: Number(amount)
                },
                {withCredentials: true})

            alert("Transfer successful!");
            onSuccess();
            onClose();

        } catch(e){
            alert("Transfer failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            {/* Modal Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] animate-fade-in-up">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Send Money</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-semibold">
                        ✕
                    </button>
                </div>
                {/* User Info */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#E5F2FF] text-[#0F72C9] rounded-full flex justify-center items-center font-bold text-lg">
                        {transferUser.firstName[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{transferUser.firstName} {transferUser.lastName}</h3>
                        <p className="text-sm text-gray-500">@{transferUser.username}</p>
                    </div>
                </div>
                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (in Rs)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F72C9] focus:outline-none"
                    />
                </div>

                {/* red error msg */}
                {isInsufficient && (
                    <div className="text-red-500 text-sm mb-4 font-medium">
                        Garib, You don't have that much money!
                    </div>
                )}

                {/* Action Buttons */}
                <button 
                    onClick={handleTransfer}
                    className="w-full bg-[#0F72C9] hover:bg-[#0b5c9e] text-white font-bold py-3 rounded-lg transition-all"
                >
                    Initiate Transfer
                </button>
            </div>
        </div>
    );
}