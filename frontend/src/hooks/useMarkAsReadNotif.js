import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markAsReadNotification } from "../lib/api"

const useMarkAsReadNotif = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: markAsReadNotif, isPending } = useMutation({
    mutationFn: markAsReadNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return { markAsReadNotif, isPending }
}
export default useMarkAsReadNotif