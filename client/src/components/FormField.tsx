import type { ChangeEvent, Ref } from "react";

interface props {
  title: string,
  placeHolder: string,
  error?  : string,
  type?: string,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  inputRef?: Ref<HTMLInputElement>
}

export default function FormField({title, placeHolder, error, type = "text", onChange, inputRef}: props) {
  return (
    <div>
      <div className="px-2">
        {title}
      </div>
      <input 
        ref={inputRef}
        type={type}
        placeholder={placeHolder} 
        onChange={onChange}
        className={`border w-full px-[20px] py-[10px] rounded-[12px] ${error ? 'border-red-500' : ''}`} 
      />
      {error && <p className="text-red-500 text-sm mt-1 px-2">{error}</p>}
    </div>
  )
}