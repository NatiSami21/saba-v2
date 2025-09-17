// components/Navbar.jsx
import { logo } from "../assets";

const Navbar = () => {
  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-sm bg-white/10 border-b border-white/10
                 flex justify-between items-center px-4 sm:px-6 py-3"
    >
      {/* Left: Logo + Name */}
      <a
        href="https://natinael-samuel.netlify.app"
        className="flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl"
        />
        <p className="text-white text-base sm:text-lg font-bold cursor-pointer flex items-center">
          Natinael Samuel
          <span className="ml-2 hidden md:block text-sm font-normal text-gray-300">
            | Software Engineer
          </span>
        </p>
      </a>

      {/* Right: Visit Portfolio */}
      <a
        href="https://natinael-samuel.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full
                   bg-gradient-to-r from-purple-500/30 to-pink-500/30
                   text-white shadow-lg border border-white/20
                   hover:scale-105 transition-transform"
      >
        Visit Portfolio
      </a>
    </nav>
  );
};

export default Navbar;
