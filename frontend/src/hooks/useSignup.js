import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

const useSignup = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: signupMutation, isPending, error, isSuccess } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      toast.success('Your account is under review. Please wait for admin approval', {
        duration: 2000,
        style: { whiteSpace: 'pre-line' }
      })
      setTimeout(() => navigate('/login'), 2000)
    },
    onError: (error) => toast.error(error.response?.data?.message, { duration: 2000 })
  })

  return { signupMutation, isPending, error, isSuccess }
}
export default useSignup