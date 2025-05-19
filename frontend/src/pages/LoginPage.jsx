import { useEffect, useState } from "react"
import { Link } from "react-router"
import useLogin from "../hooks/useLogin"
import { EyeIcon, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const { loginMutation, isPending, error } = useLogin()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    loginMutation(loginData)
  }

  useEffect(() => {
    if (error) {
      setLoginData(prev => ({ ...prev, password: '' }))
    }
  }, [error])

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border border-neutral p-6 rounded-md shadow-lg flex flex-col w-full max-w-lg">
        <h1 className="text-3xl mb-6 text-center font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Login
        </h1>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="label">
                <span className="label-text text-black/90">Email: </span>
              </label>
              <input
                type='email'
                placeholder="john.doe@gmail.com"
                className="input input-bordered w-full border-neutral"
                required
                name="email"
                value={loginData.email}
                onChange={handleChange}
              />

              <div className="space-y-4">
                <label className="label">
                  <span className="label-text text-black/90">Password: </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder='*******'
                    className="input input-bordered w-full border-neutral"
                    required
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                  <div>
                    {showPassword ? (
                      <EyeIcon className="size-4 absolute top-1/2 right-3 -translate-y-1/2 z-50 text-gray-500 hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                      <EyeOff className="size-4 absolute top-1/2 right-3 -translate-y-1/2 z-50 text-gray-500 hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button className="btn btn-primary w-full mt-2" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>

              <div className="text-center mt-2">
                <p className="text-sm">Don't have an account? {' '}
                  <Link to="/signup" className="text-primary font-semibold">Sign Up</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default LoginPage