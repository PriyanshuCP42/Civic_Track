import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AppPageHeader from "../../components/layout/AppPageHeader";
import MapPicker from "../../components/ui/MapPicker";
import { categories } from "../../utils/constants";
import { mockApi } from "../../api/mockApi";
import { useAuth } from "../../context/AuthContext";
import { adminBtnPrimary, adminBtnSecondary, adminInput, adminLabel, adminSurface, adminSurfaceMuted, pageStack } from "../../lib/adminUi";
import { cn } from "@/lib/utils";

const steps = ["Details", "Location", "Review"];

const NewComplaintPage = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, trigger } = useForm();
  const [step, setStep] = useState(1);
  const [coords, setCoords] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [created, setCreated] = useState(null);
  const description = watch("description", "");

  const next = async () => {
    const valid = await trigger(step === 1 ? ["title", "category", "description"] : ["address"]);
    if (!valid) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const onSubmit = async (values) => {
    if (!coords) return toast.error("Please pin a location on the map");
    const payload = {
      ...values,
      citizenId: user.id,
      citizenName: user.name,
      imageUrl,
      location: { type: "Point", coordinates: coords },
    };
    const createdComplaint = await mockApi.createComplaint(payload);
    setCreated(createdComplaint);
    toast.success("Complaint submitted");
  };

  if (created) {
    return (
      <div className={pageStack}>
        <AppPageHeader eyebrow="Citizen" title="Submitted" description="Your report is in the municipal queue." />
        <div className={`${adminSurface} border-emerald-100/80 bg-gradient-to-br from-emerald-50/90 to-white p-8 md:p-10`}>
          <h2 className="text-xl font-bold text-emerald-900">Complaint received</h2>
          <p className="mt-2 text-sm text-emerald-800/90">
            Reference <span className="font-mono font-semibold">{created.id}</span> — you can track progress under My complaints.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/citizen/complaints/${created.id}`} className={adminBtnPrimary}>
              View details
            </Link>
            <Link to="/citizen/dashboard" className={adminBtnSecondary}>
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Citizen"
        title="New complaint"
        description="Describe the issue, pin the location, and confirm before submitting to the city."
      />

      <div className={adminSurface}>
        <div className="border-b border-slate-100 px-6 py-5 md:px-8 md:py-6">
          <div className="flex flex-wrap gap-2">
            {steps.map((label, i) => {
              const n = i + 1;
              return (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                    step === n ? "border-slate-900 bg-slate-900 text-white" : step > n ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-500",
                  )}
                >
                  <span className="tabular-nums">{n}</span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-7 md:p-9">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={adminLabel}>Title</label>
                <input {...register("title", { required: true })} className={`mt-1.5 ${adminInput}`} placeholder="Short summary of the issue" />
              </div>
              <div>
                <label className={adminLabel}>Category</label>
                <select {...register("category", { required: true })} className={`mt-1.5 ${adminInput}`}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabel}>Description</label>
                <textarea
                  {...register("description", { required: true, maxLength: 1000 })}
                  className={`mt-1.5 min-h-32 ${adminInput}`}
                  placeholder="What happened? Include landmarks or safety notes if relevant."
                />
                <p className="mt-1 text-xs text-slate-500">{description.length}/1000</p>
              </div>
              <div>
                <label className={adminLabel}>Photo URL (optional)</label>
                <input
                  type="text"
                  placeholder="Cloudinary or image URL (stub)"
                  className={`mt-1.5 border-dashed ${adminInput}`}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <MapPicker value={coords} onChange={setCoords} />
              <div>
                <label className={adminLabel}>Address (optional)</label>
                <input {...register("address")} className={`mt-1.5 ${adminInput}`} placeholder="Street or area name" />
              </div>
              {coords ? (
                <p className={`text-xs text-slate-600 ${adminSurfaceMuted} rounded-xl px-3 py-2`}>
                  Coordinates: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
                </p>
              ) : null}
            </div>
          )}

          {step === 3 && (
            <div className={`space-y-3 rounded-xl p-5 text-sm leading-relaxed text-slate-700 ${adminSurfaceMuted}`}>
              <p>
                <span className="font-semibold text-slate-900">Title:</span> {watch("title")}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Category:</span> {watch("category")}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Description:</span> {watch("description")}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Address:</span> {watch("address") || "—"}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className={adminBtnSecondary}>
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button type="button" onClick={next} className={`sm:ml-auto ${adminBtnPrimary}`}>
                Continue
              </button>
            ) : (
              <button type="submit" className={`sm:ml-auto ${adminBtnPrimary}`}>
                Submit complaint
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaintPage;
