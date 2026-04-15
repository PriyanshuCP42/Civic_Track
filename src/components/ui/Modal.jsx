const Modal = ({ open, onClose, title, subtitle, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[6px] sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-[1.25rem] border border-slate-200/80 bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.5)_inset]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 px-6 py-6 sm:px-8 sm:py-7">
          <div className="min-w-0 pr-4">
            <h2 id="modal-title" className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-[15px] sm:leading-7">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-7 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
