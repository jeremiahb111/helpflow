import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../lib/api"

const useAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser,
    retry: false
  })

  return { authUser: data?.data, isLoading }
}
export default useAuth