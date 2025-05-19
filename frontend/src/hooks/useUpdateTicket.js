import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTicket } from "../lib/api"
import { toast } from "sonner"

const useUpdateTicket = (ticketId) => {
  const queryClient = useQueryClient()

  const { mutate: ticketMutation, isPending } = useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
      toast.success('Ticket updated successfully!', { duration: 2000 })
    },
    onError: (error) => console.log(error)
  })

  return { ticketMutation, isPending }
}
export default useUpdateTicket