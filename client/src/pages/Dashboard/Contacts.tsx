import Contact from "../../components/Contact";
import { useEffect, useState } from "react";
import axios from "axios";

interface contactsInter{
    refreshTrigger?: number
    setTransferUser: (user: any) => void;
}

export default function Contacts({refreshTrigger, setTransferUser}: contactsInter) {
    const [recent, setRecent] = useState<any[]>([]);

    useEffect(()=>{
        async function fetchRecent() {
            try{
                const response = await axios.get(import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/account/recent-contacts", 
                    {withCredentials: true});
                setRecent(response.data.recentContacts)
            } catch(error) {
                console.log("Failed to fetch recent contacts");
            }
        }
        fetchRecent();
    }, [refreshTrigger]);

    return (
        <div>
            <div className="h-fit w-fit font-bold tracking-wide text-lg px-2 pb-[10px]">
                Recently contacted
            </div>
            <div className="shadow-[0px_5px_50px_0px_rgba(0,89,179,0.13)] border divide-y divide-[#E4E7EB] border-[#D8E8F8] border-1 rounded-2xl border-solid">
                {recent?.length > 0? (
                    recent.map((user: any) => (
                        <Contact 
                            key={user._id}
                            _id={user._id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            username={user.username}
                            setTransferUser={setTransferUser}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 font-medium"> No Recent Transactions </div>
                )}
            </div>


        </div>
    )
}