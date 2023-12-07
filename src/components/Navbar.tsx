import Navlinks from './Navlinks'

const Navbar = () => {
  return (
    <header className="border-b-2 max-w-6xl mx-auto">
      <nav className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl lg:text-4xl font-semibold">Blog</h1>
        <Navlinks />
      </nav>
    </header>
  )
}
export default Navbar
