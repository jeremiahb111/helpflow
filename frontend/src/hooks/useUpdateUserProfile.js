import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserProfile } from "../lib/api"
import { toast } from "sonner"

const useUpdateUserProfile = (filters) => {
  const queryClient = useQueryClient()

  const { mutate: updateUserProfileMutation, isPending, isSuccess } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', filters] })
      toast.success('User updated successfully!', { duration: 2000 })
    }
  })

  return { updateUserProfileMutation, isPending, isSuccess }
}
export default useUpdateUserProfile