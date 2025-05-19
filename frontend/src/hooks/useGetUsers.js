import { useQuery } from "@tanstack/react-query"
import useAuth from "./useAuth"
import { getAllUsers } from "../lib/api"

const useGetUsers = (filters) => {
  const { authUser } = useAuth()

  const isAdmin = authUser?.role === "admin"

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getAllUsers(filters),
    retry: false,
    keepPreviousData: true,
    enabled: !!isAdmin
  })

  return { users: data?.data, isLoading, refetch }
}
export default useGetUsers