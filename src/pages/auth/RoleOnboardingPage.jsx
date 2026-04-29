import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import { ROLES } from "../../data/roleConstants";
import { departments } from "../../utils/constants";

const RoleOnboardingPage = () => {
  const { completeRoleOnboarding } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CITIZEN, department: "" } });
  const [role, setRole] = useState(ROLES.CITIZEN);

  const onSubmit = async (values) => {
    await completeRoleOnboarding(values);
    toast.success("Profile setup complete");
    navigate(`/${values.role}/dashboard`, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Complete Your Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Choose your account role to continue into SCCMS.</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { id: ROLES.CITIZEN, label: "Citizen" },
            { id: ROLES.EMPLOYEE, label: "Employee" },
            { id: ROLES.ADMIN, label: "Admin" },
          ].map((item) => (
            <label
              key={item.id}
              className={`cursor-pointer rounded-lg border p-3 text-center text-sm ${role === item.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700"}`}
            >
              <input
                type="radio"
                value={item.id}
                {...register("role", {
                  required: true,
                  onChange: (event) => setRole(event.target.value),
                })}
                className="sr-only"
              />
              {item.label}
            </label>
          ))}
        </div>

        {role === ROLES.EMPLOYEE ? (
          <>
            <select {...register("department", { required: "Department is required for employees" })} className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.department ? <p className="mt-1 text-xs text-rose-600">{errors.department.message}</p> : null}
          </>
        ) : null}

        <button disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-white disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default RoleOnboardingPage;
