import Heading from "../components/Heading"
import FormField from "../components/FormField"
import { useState } from "react"
import axios from "axios"
import BottonFotter from "../components/BottonFooter"
import { useNavigate } from "react-router-dom"

export default function Signin() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")

  async function buttonHandler(){
    setUsernameError("")
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_ROUTE + "/api/v1/user/signin",
        {
          username: userName,
          password: password
        }, { withCredentials: true }
      );
      
      console.log("Signin successful", response.data);
      navigate("/dashboard")
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.message === "Invalid Credentials") {
        setUsernameError(e.response.data.message)
      } else {
        console.error("Error during signin", e)
        alert("Error during signin")
      }
    }
  }

  return <div>
    <div className="h-screen w-screen bg-slate-50 flex justify-center items-center">

      {/* Main Card Box */}
      <div className="Signup-shadow w-[420px] max-w-full min-[200px] sha h-fit bg-white m-4 p-9 rounded-2xl flex flex-col gap-6">
        <Heading
          title="Signin"
          desc="Welcome back. signin to your account."
        />

        <div className="flex flex-col gap-3">

          <FormField
            title="Username"
            placeHolder="Your usernmae"
            error={usernameError}
            onChange={(e) => {
              setUserName(e.target.value)
              setUsernameError("") // Clear error when user types
            }}
          />

          <FormField
            title="Password"
            placeHolder="Your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="font-bold text-white bg-[#0F72C9] px-2 py-3 rounded-lg mt-2" onClick={buttonHandler}>Login</button>
        
          <BottonFotter 
            label="Create an account"
            button="Sign up"
            to="/signup"
          />

        </div>

      </div>
    </div>
  </div>
}