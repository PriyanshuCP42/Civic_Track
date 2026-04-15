import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { adminBtnPrimary, adminSurfaceMuted } from "../../lib/adminUi";
import { mockApi } from "../../api/mockApi";
import { cn } from "@/lib/utils";

const strategies = ["Assign manually", "Auto-assign by department", "Auto-assign by proximity"];

const AssignComplaintModal = ({ open, onClose, complaint, employees, onAssigned }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [strategy, setStrategy] = useState(strategies[0]);

  const submit = async () => {
    const assigned = await mockApi.assignComplaint(complaint.id, employeeId || employees[0]?.id);
    toast.success(`Assigned (${strategy})`);
    onAssigned(assigned);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign complaint" subtitle={complaint?.title}>
      <div className={`mb-5 rounded-xl p-3 text-sm text-slate-600 ${adminSurfaceMuted}`}>
        Choose a routing strategy, then pick the employee who will own this case.
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {strategies.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStrategy(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              strategy === s
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
        {employees.map((e) => (
          <label
            key={e.id}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-3 text-sm shadow-sm transition hover:border-orange-200 hover:ring-1 hover:ring-orange-500/10"
          >
            <span className="flex min-w-0 items-center gap-3">
              <input type="radio" name="emp" className="h-4 w-4 accent-orange-600" onChange={() => setEmployeeId(e.id)} />
              <span className="min-w-0">
                <span className="block font-medium text-slate-900">{e.name}</span>
                <span className="text-xs text-slate-500">{e.department}</span>
              </span>
            </span>
            <span className="shrink-0 text-xs font-medium text-slate-500">{e.assignedCount} active</span>
          </label>
        ))}
      </div>
      <button type="button" onClick={submit} className={`mt-6 w-full ${adminBtnPrimary}`}>
        Confirm assignment
      </button>
    </Modal>
  );
};

export default AssignComplaintModal;
