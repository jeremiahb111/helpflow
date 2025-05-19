import { Loader } from "lucide-react"

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={'light'}>
      <Loader className="animate-spin size-10 text-primary" />
    </div>
  )
}
export default PageLoader