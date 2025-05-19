import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import useSignup from '../hooks/useSignup'
import { toast } from 'sonner'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { signupMutation, isPending, isSuccess } = useSignup()

  const handleChange = (ee) => {
    const { name, value } = ee.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (signupData.password !== signupData.confirmPassword) {
      return toast.error('Password and confirm password do not match', { duration: 2000 })
    }

    signupMutation(signupData)
  }

  useEffect(() => {
    if (isSuccess) {
      setSignupData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [isSuccess])

  return (
    <div className="h-screen flex items-center justify-center p-4 ">
      <div className="border border-neutral p-6 rounded-md shadow-lg flex flex-col w-full max-w-lg ">
        <h1 className="text-3xl mb-6 text-center font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
          Sign Up
        </h1>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="label">
                <span className="label-text text-black/90">Full Name:</span>
              </label>
              <input
                type="text"
                className=" input input-bordered w-full border-neutral"
                placeholder='John Doe'
                required
                name='fullName'
                value={signupData.fullName}
                onChange={handleChange}
              />

              <label className="label">
                <span className="label-text text-black/75">Email:</span>
              </label>
              <input
                type="email"
                className=" input input-bordered w-full border-neutral"
                placeholder='john.doe@gmail.com'
                required
                name='email'
                value={signupData.email}
                onChange={handleChange}
              />

              <div className='relative space-y-4'>
                <label className="label">
                  <span className="label-text text-black/75">Password:</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className=" input input-bordered w-full border-neutral"
                  placeholder='*******'
                  required
                  name='password'
                  value={signupData.password}
                  onChange={handleChange}
                />

                {!showPassword ?
                  <EyeOff className='z-30 absolute top-[44%] right-3 cursor-pointer size-4 text-gray-500' onClick={() => setShowPassword(!showPassword)} /> :
                  <Eye className='z-30 absolute top-[44%] right-3 cursor-pointer size-4 text-gray-500' onClick={() => setShowPassword(!showPassword)} />
                }
              </div>

              <div className='relative space-y-4 mb-4'>
                <label className="label">
                  <span className="label-text text-black/75">Confirm Password:</span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className=" input input-bordered w-full border-neutral"
                  placeholder='*******'
                  required
                  name='confirmPassword'
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                />

                {!showConfirmPassword ?
                  <EyeOff className='z-30 absolute top-[44%] right-3 cursor-pointer size-4 text-gray-500' onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> :
                  <Eye className='z-30 absolute top-[44%] right-3 cursor-pointer size-4 text-gray-500' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                }
              </div>

              <div>
                <button type='submit' className='btn btn-primary w-full mt-2'>
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Signing up...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>

              <div className='text-center mt-2'>
                <p className='text-sm'>Already have an account? {' '}
                  <Link to='/login' className='text-primary font-semibold'>Login</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default SignupPage