import { Inbox } from "lucide-react";
import { adminSurface } from "../../lib/adminUi";

const EmptyState = ({ title, subtitle, action }) => (
  <div className={`${adminSurface} px-8 py-16 text-center md:px-12 md:py-20`}>
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/90">
      <Inbox className="h-8 w-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">{subtitle}</p>
    {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
  </div>
);

export default EmptyState;
