import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'sonner'
import { login } from "../lib/api"

const useLogin = () => {
  const queryClient = useQueryClient()

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      toast.success('Login successfully!', {
        duration: 2000
      })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message, {
        duration: 2000
      })
    }
  })

  return { loginMutation, isPending, error }
}
export default useLogin