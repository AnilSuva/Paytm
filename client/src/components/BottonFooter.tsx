import { Link } from "react-router-dom"

interface props {
  label: string,
  button: string,
  to: string
}

export default function BottonFotter({ label, button, to }: props) {
  return(
    <div className="flex">
      <div className="mr-1">
        {label}
      </div>
      <Link to={to}
        className="text-[#0F72C9] font-medium underline"
        >{button}
      </Link>
    </div>
  )
}
