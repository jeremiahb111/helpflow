import { useMutation, useQueryClient } from "@tanstack/react-query"
import { comment } from "../lib/api"
import { toast } from "sonner"

const useCommentTicket = (ticketId) => {
  const queryClient = useQueryClient()

  const { mutate: commentMutation, isPending, isSuccess } = useMutation({
    mutationFn: comment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      toast.success('Comment created successfully!', { duration: 2000 })
    },
    onError: (error) => console.log(error)
  })

  return { commentMutation, isPending, isSuccess }
}
export default useCommentTicket