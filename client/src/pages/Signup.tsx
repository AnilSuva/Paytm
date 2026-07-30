import Heading from "../components/Heading"
import FormField from "../components/FormField"
import BottonFotter from "../components/BottonFooter"
import { useState, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Signup() {

  const navigate = useNavigate();
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")

  async function buttonHandler(){
    setUsernameError("")
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/user/signup",
        {
          firstName: firstNameRef.current?.value || "",
          lastName: lastNameRef.current?.value || "",
          username: userName,
          password: password
        }, {withCredentials: true}
      );
      console.log("Signup successful", response.data)
      alert("Signup successful!")
      navigate('/dashboard')
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.message === "Username already taken") {
        setUsernameError(e.response.data.message)
      } else {
        console.error("Error during signup", e)
        alert("Error during signup")
      }
    }
  }

  return <div>
    <div className="h-screen w-screen bg-slate-50 flex justify-center items-center">

      {/* Main Card Box */}
      <div className="Signup-shadow w-[420px] max-w-full min-[200px] sha h-fit bg-white m-4 p-9 rounded-2xl flex flex-col gap-6">
        <Heading
          title="Create Your Account"
          desc="Join Paytm to manage Payment simply and secuerly."
        />

        <div className="flex flex-col gap-3">
          <FormField
            title="First Name"
            placeHolder="Enter your first name"
            inputRef={firstNameRef}
          />

          <FormField
            title="Last Name"
            placeHolder="Enter your last name"
            inputRef={lastNameRef}
          />

          <FormField
            title="Username"
            placeHolder="Choose a username"
            error={usernameError}
            onChange={(e) => {
              setUserName(e.target.value)
              setUsernameError("") // Clear error when user types
            }}
          />

          <FormField
            title="Password"
            placeHolder="Create a password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="font-bold text-white bg-[#0F72C9] px-2 py-3 rounded-lg mt-2" onClick={buttonHandler}>Create account</button>

          <BottonFotter 
            label="Already have an account?"
            button="sign in"
            to="/signin"
            />
        </div>

      </div>
    </div>
  </div>
}