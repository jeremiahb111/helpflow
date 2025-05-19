import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "../lib/api"

const useGetNotif = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  })

  return { notifications: data?.data, isLoading }
}
export default useGetNotif