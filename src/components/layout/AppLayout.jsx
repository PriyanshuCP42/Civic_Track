import { Outlet } from "react-router-dom";
import AppPillNavbar from "./AppPillNavbar";

const mainShell =
  "min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_100%_85%_at_100%_-15%,rgba(251,146,60,0.06),transparent_58%),radial-gradient(ellipse_95%_75%_at_0%_105%,rgba(148,163,184,0.09),transparent_52%)] px-5 pb-16 pt-[5.5rem] sm:px-8 sm:pb-20 sm:pt-[5.75rem] md:px-10 md:pb-24 md:pt-24 lg:px-12";

const AppLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
    <AppPillNavbar />
    <main className={mainShell}>
      <div className="mx-auto w-full max-w-[1120px]">
        <Outlet />
      </div>
    </main>
  </div>
);

export default AppLayout;
