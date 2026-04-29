import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import AppPageHeader from "../../components/layout/AppPageHeader";
import { useAuth } from "../../context/useAuth";
import { adminBtnPrimary, adminInput, adminLabel, adminSurface, pageStack } from "../../lib/adminUi";

const eyebrowForPath = (pathname) => {
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/employee")) return "Employee";
  return "Citizen";
};

const ProfilePage = () => {
  const { pathname } = useLocation();
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, email: user?.email } });
  const eyebrow = eyebrowForPath(pathname);

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow={eyebrow}
        title="Profile"
        description="Identity and preferences for your SCCMS workspace. Email is read-only when signed in with Clerk."
      />

      <div className="grid gap-6 md:gap-8 xl:grid-cols-2">
        <section className={`${adminSurface} p-7 md:p-9`}>
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white text-xl font-bold text-orange-700 shadow-sm">
            {(user?.name?.[0] || "?").toUpperCase()}
          </div>
          <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            {user?.role}
          </span>
        </section>

        <section className={`${adminSurface} space-y-8 p-7 md:p-9`}>
          <form onSubmit={handleSubmit((v) => setUser({ ...user, ...v }))} className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Edit profile</h3>
            <div>
              <label className={adminLabel}>Display name</label>
              <input {...register("name")} className={`mt-1.5 ${adminInput}`} />
            </div>
            <div>
              <label className={adminLabel}>Email</label>
              <input {...register("email")} readOnly className={`mt-1.5 ${adminInput} cursor-not-allowed bg-slate-50 text-slate-500`} />
            </div>
            <button type="submit" className={adminBtnPrimary}>
              Save changes
            </button>
          </form>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="text-base font-semibold text-slate-900">Change password</h3>
            <p className="mb-4 text-sm text-slate-500">Demo fields only — wire to your identity provider for production.</p>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" className={adminInput} />
              <input type="password" placeholder="New password" className={adminInput} />
              <input type="password" placeholder="Confirm new password" className={adminInput} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
