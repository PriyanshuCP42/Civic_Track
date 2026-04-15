import { NavLink } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";

const config = {
  admin: {
    home: "/admin/dashboard",
    links: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/complaints", label: "Complaints" },
      { to: "/admin/employees", label: "Employees" },
      { to: "/admin/metrics", label: "Analytics" },
    ],
    profile: "/admin/profile",
    cta: { to: "/admin/employees", label: "Invite staff" },
    navLabel: "Admin navigation",
  },
  citizen: {
    home: "/citizen/dashboard",
    links: [
      { to: "/citizen/dashboard", label: "Dashboard" },
      { to: "/citizen/complaints", label: "My complaints" },
      { to: "/citizen/complaints/new", label: "New complaint" },
    ],
    profile: "/citizen/profile",
    cta: { to: "/citizen/complaints/new", label: "Report issue" },
    navLabel: "Citizen navigation",
  },
  employee: {
    home: "/employee/dashboard",
    links: [
      { to: "/employee/dashboard", label: "Dashboard" },
      { to: "/employee/tasks", label: "My tasks" },
    ],
    profile: "/employee/profile",
    cta: { to: "/employee/tasks", label: "Open queue" },
    navLabel: "Employee navigation",
  },
};

const linkClass = ({ isActive }) =>
  cn(
    "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors",
    isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
  );

const AppPillNavbar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || "citizen";
  const c = config[role] || config.citizen;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 sm:px-6 sm:pt-6 md:px-8 md:pt-7">
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-[1120px] items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.08),0_16px_40px_-12px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl",
          "sm:gap-4 sm:px-5 sm:py-3 md:px-6",
        )}
      >
        <NavLink to={c.home} className="flex shrink-0 items-center gap-3 rounded-full pr-0.5 sm:gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 ring-[3px] ring-orange-50">
            <MapPinned className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">SCCMS</span>
        </NavLink>

        <nav
          className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:flex md:flex-1 md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden"
          aria-label={c.navLabel}
        >
          <div className="flex w-max min-w-full justify-center gap-1 px-0.5 sm:gap-1.5 sm:px-2">
            {c.links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <NavLink
            to={c.profile}
            className="hidden rounded-full px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:inline"
          >
            Account
          </NavLink>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-full px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Log out
          </button>
          <NavLink
            to={c.cta.to}
            className={({ isActive }) =>
              cn(
                "rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-[13px] font-semibold tracking-tight text-slate-950 shadow-md shadow-orange-500/20 transition hover:brightness-[1.03] sm:px-5 sm:text-sm",
                isActive && "ring-2 ring-orange-200/90 ring-offset-[3px] ring-offset-white",
              )
            }
          >
            {c.cta.label}
          </NavLink>
          <span
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-slate-50 text-[12px] font-semibold text-slate-600 sm:flex"
            title={user?.name || role}
          >
            {(user?.name || role[0] || "U").slice(0, 1).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppPillNavbar;
