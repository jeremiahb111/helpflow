import { useQuery } from "@tanstack/react-query"
import { getTicket } from "../lib/api"

const useGetTicket = (ticketId) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicket(ticketId)
  })

  return { ticket: data?.data, isLoading }
}
export default useGetTicket