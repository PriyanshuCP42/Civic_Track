import Modal from "./Modal";
import { adminBtnSecondary } from "../../lib/adminUi";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-[15px] leading-relaxed text-slate-600">{message}</p>
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-end">
      <button type="button" className={adminBtnSecondary} onClick={onClose}>
        Cancel
      </button>
      <button
        type="button"
        className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.99]"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
