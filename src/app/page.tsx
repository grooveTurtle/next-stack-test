export default function Home() {
  return (
    <>
      <header className="bg-gray-100 p-6 rounded-lg mb-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">MyWebsite</div>
          <ul className="flex gap-4">
            <li>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Contact
              </a>
            </li>
          </ul>
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              type="button"
            >
              Login
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
