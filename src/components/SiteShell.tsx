import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RoughFilter } from "./RoughFilter";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RoughFilter />
      <Header />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
