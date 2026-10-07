import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Position within the nearest positioned parent, e.g. { top: "10%", right: "4%" }. */
  at: Pick<CSSProperties, "top" | "right" | "bottom" | "left">;
  tilt?: number;
}

/** A handwritten comment that only appears in Draft view, like notes on a design review. */
export function MarginNote({ children, at, tilt = -3 }: Props) {
  return (
    <span
      className="margin-note draft-only"
      aria-hidden="true"
      style={{ ...at, ["--tilt" as string]: `${tilt}deg` } as CSSProperties}
    >
      {children}
    </span>
  );
}
