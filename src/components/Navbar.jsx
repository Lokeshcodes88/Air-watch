import { NavLink } from "react-router-dom";
import { Wind, MapPin, BarChart2, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-white px-10 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 text-primary font-semibold text-xl">
        <Wind />
        AirWatch
      </div>

      <div className="flex gap-8 items-center">
        <NavItem to="/" icon={<Wind />} label="Dashboard" />
        <NavItem to="/map" icon={<MapPin />} label="Map" />
        <NavItem to="/historical" icon={<BarChart2 />} label="Historical" />
        <NavItem to="/alerts" icon={<Bell />} label="Alerts" />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-5 py-2 rounded-xl transition
        ${isActive ? "bg-primary text-white" : "text-muted hover:bg-gray-100"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
