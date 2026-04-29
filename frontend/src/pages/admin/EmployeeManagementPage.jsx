import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import AppPageHeader from "../../components/layout/AppPageHeader";
import Modal from "../../components/ui/Modal";
import { useEmployees } from "../../hooks/useEmployees";
import { departments } from "../../utils/constants";
import { adminBtnAccent, adminBtnPrimary, adminInput, adminLabel, adminSurface, adminSurfaceMuted, pageStack } from "../../lib/adminUi";

const EmployeeManagementPage = () => {
  const { employees, createEmployee } = useEmployees();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({ q: "", dept: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", password: "", department: "" } });

  const visible = useMemo(
    () =>
      employees.filter(
        (employee) =>
          (!filter.dept || employee.department === filter.dept) &&
          `${employee.name} ${employee.email}`.toLowerCase().includes(filter.q.toLowerCase()),
      ),
    [employees, filter],
  );

  const addEmployee = async (values) => {
    try {
      const result = await createEmployee({
        name: values.name,
        email: values.email,
        password: values.password,
        department: values.department,
      });
      if (result.source === "local") {
        toast("Created locally only (API error). Check terminal for [admin/employees] logs.");
      } else {
        toast.success("Employee created");
      }
      setOpen(false);
      reset();
    } catch (error) {
      if (error?.status === 409) {
        toast.error(error.message);
        return;
      }
      if (error?.code === "NETWORK") {
        toast.error(error.message);
        return;
      }
      toast.error(error?.message || "Unable to create employee");
    }
  };

  const onInvalid = () => {
    toast.error("Please fill all employee fields correctly.");
  };

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Admin"
        title="Employees"
        description="Municipal staff accounts, workload signals, and onboarding from one directory."
        actions={
          <button type="button" onClick={() => setOpen(true)} className={adminBtnAccent}>
            <UserPlus className="h-4 w-4" />
            Add employee
          </button>
        }
      />

      <div className={`flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center ${adminSurfaceMuted} p-5 sm:p-6`}>
        <input
          type="search"
          placeholder="Search by name or email…"
          className={`min-w-[200px] flex-1 ${adminInput}`}
          onChange={(e) => setFilter({ ...filter, q: e.target.value })}
        />
        <select
          className={`min-w-[200px] ${adminInput}`}
          value={filter.dept}
          onChange={(e) => setFilter({ ...filter, dept: e.target.value })}
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {visible.map((e) => (
          <article key={e.id} className={`${adminSurface} p-6 transition hover:border-slate-300/80 hover:shadow-md md:p-7`}>
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white text-sm font-bold text-orange-700 shadow-sm">
                {(e.name?.[0] || "?").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{e.name}</p>
                <p className="truncate text-sm text-slate-500">{e.email}</p>
                <span className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {e.department}
                </span>
                <p className="mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{e.assignedCount}</span> active assignments
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add employee" subtitle="Creates a Clerk user with the employee role.">
        <form onSubmit={handleSubmit(addEmployee, onInvalid)} className="space-y-4">
          <div>
            <label className={adminLabel}>Full name</label>
            <input {...register("name", { required: "Name is required" })} className={`mt-1.5 ${adminInput}`} placeholder="e.g. Priya Sharma" />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className={adminLabel}>Work email</label>
            <input {...register("email", { required: "Email is required" })} className={`mt-1.5 ${adminInput}`} placeholder="name@municipality.gov" />
            {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className={adminLabel}>Temporary password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
              className={`mt-1.5 ${adminInput}`}
              placeholder="••••••••"
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p> : null}
          </div>
          <div>
            <label className={adminLabel}>Department</label>
            <select {...register("department", { required: "Department is required" })} className={`mt-1.5 ${adminInput}`}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department ? <p className="mt-1 text-xs text-rose-600">{errors.department.message}</p> : null}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="sm:min-w-[100px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={`sm:min-w-[160px] ${adminBtnPrimary}`}>
              {isSubmitting ? "Creating…" : "Create employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagementPage;
