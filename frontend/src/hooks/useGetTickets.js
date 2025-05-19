import { useQuery } from "@tanstack/react-query"
import { getTickets } from "../lib/api"

const useGetTickets = (filter) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tickets', filter],
    queryFn: () => getTickets(filter),
    keepPreviousData: true
  })

  return { tickets: data?.data, isLoading, refetch }
}
export default useGetTickets