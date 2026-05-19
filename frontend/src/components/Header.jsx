/**
 * Header.jsx — Barra de navegación superior sticky con logo y menú.
 */
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Analizar", to: "/analizar" },
  { label: "Historial", to: "/historial" },
  { label: "Acerca de", to: "/acerca" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group" id="nav-logo">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-bold"
               style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            🧠
          </div>
          <span className="font-bold text-lg text-gray-800">EmocionIA</span>
        </NavLink>

        {/* Navegación */}
        <nav className="flex items-center gap-1" aria-label="Menú principal">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ` +
                (isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100")
              }
              end={to === "/"}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
