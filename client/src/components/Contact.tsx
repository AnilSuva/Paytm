

interface props{
	_id: string,
	firstName: string,
	lastName: string,
	username: string,
	setTransferUser: (user: any) => void;
}

export default function Contact({_id, firstName, lastName, username, setTransferUser}: props) {

	const profileText = (firstName[0] + lastName[0]).toUpperCase();

	return (
		<div>
			<div className="w-full h-fit flex flex-col gap-[10px] py-4 px-5 ">

				<div className="w-full h-fit flex flex-nowrap items-center gap-3">
					<div className="w-[42px] h-[42px] shrink-0 pb-[2px] bg-[#E5F2FF] text-[#0F72C9] flex justify-center items-center font-semibold rounded-full">
						{profileText}
					</div>

					<div className="h-fit flex-1">
						<div className="w-fit h-fit text-base font-semibold ">{firstName} {lastName}</div>
						<div className="w-fit h-fit text-sm text-[#627D98]">@{username}</div>
					</div>
				
					<button className="bg-[#0F72C9] text-white px-3 py-1 rounded text-sm" 
						onClick={() => { setTransferUser({ _id, firstName, lastName, username }) }}>
						Send Money
					</button>
				</div>
			</div>
		</div>
	)
}