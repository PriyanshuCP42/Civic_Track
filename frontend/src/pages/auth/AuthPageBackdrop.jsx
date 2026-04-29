import { cn } from "@/lib/utils";

const gridLayer = cn(
  "absolute inset-0",
  "[background-size:36px_36px]",
  "[background-image:linear-gradient(to_right,rgb(241_245_249)_1px,transparent_1px),linear-gradient(to_bottom,rgb(241_245_249)_1px,transparent_1px)]",
);

/**
 * White grid + soft orange mesh (radials) aligned to the form column on wide layouts.
 */
const AuthPageBackdrop = () => (
  <>
    <div className={gridLayer} aria-hidden />
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(ellipse_95%_75%_at_92%_48%,rgba(251,146,60,0.22),transparent_55%),radial-gradient(ellipse_70%_60%_at_8%_88%,rgba(234,88,12,0.11),transparent_52%),radial-gradient(ellipse_85%_45%_at_50%_-8%,rgba(254,215,170,0.14),transparent_50%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(251,146,60,0.08),transparent_45%)]",
      )}
      aria-hidden
    />
  </>
);

export default AuthPageBackdrop;
