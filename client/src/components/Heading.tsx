import PaytmLogo from "./PaytmLogo"

interface props {
  title: string,
  desc: string
}

export default function Heading({ title, desc }: props) {
  return (
    <div className="flex justify-center items-center flex-col gap-3">
      <PaytmLogo />
      <div className="font-bold text-[24px] text-center">
        {title}
      </div>
      <div className="text-[15px] text-center px-16">
        {desc}
      </div>
    </div>

  )
}