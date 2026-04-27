import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { adminBtnPrimary, adminInput, adminLabel } from "../../lib/adminUi";
import { mockApi } from "../../api/mockApi";

const transitions = {
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
};

const UpdateStatusModal = ({ open, onClose, complaint, onUpdated }) => {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { status: "", note: "" } });
  const status = watch("status");

  const submit = async (values) => {
    if (values.status === "RESOLVED" && !values.note) return toast.error("Resolution notes required");
    const updated = await mockApi.updateComplaintStatus(complaint.id, values.status, values.note);
    onUpdated(updated);
    toast.success("Status updated");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update status" subtitle={complaint?.title}>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div>
          <label className={adminLabel}>Next status</label>
          <select {...register("status", { required: true })} className={`mt-1.5 ${adminInput}`}>
            <option value="">Select transition</option>
            {(transitions[complaint?.status?.toUpperCase()] || []).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={adminLabel}>Notes</label>
          <textarea {...register("note")} className={`mt-1.5 min-h-24 ${adminInput}`} placeholder="Resolution or handoff notes" />
        </div>
        {status === "RESOLVED" ? <p className="text-xs font-medium text-amber-700">Resolution note is required when closing.</p> : null}
        <button type="submit" className={`w-full ${adminBtnPrimary}`}>
          Save update
        </button>
      </form>
    </Modal>
  );
};

export default UpdateStatusModal;
