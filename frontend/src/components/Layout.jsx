import SideNav from "./SideNav"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <SideNav />
        <div className="flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
export default Layout