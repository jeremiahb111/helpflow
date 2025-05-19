import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTicket } from "../lib/api"
import { useNavigate } from "react-router"
import { toast } from "sonner"

const useCreateTicket = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: createTicketMutation, isPending, isSuccess, error } = useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Ticket created successfully!', { duration: 2000 })
      navigate(`/tickets/${data?.data._id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message, {
        duration: 2000
      })
    }
  })

  return { createTicketMutation, isPending, isSuccess, error }
}
export default useCreateTicket