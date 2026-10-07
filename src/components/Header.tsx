"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site";
import { Logo } from "./Logo";
import { ModeToggle } from "./ModeToggle";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.header} data-scrolled={scrolled} data-open={open}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Outriva, home">
          <Logo />
        </Link>

        <nav aria-label="Main" className={styles.nav}>
          <ul role="list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={pathname.startsWith(item.href) && item.href !== "/" ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ModeToggle />
          <Link href="/contact" className={`btn btn--ink ${styles.cta}`}>
            Start a project
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div id="menu" className={styles.panel} hidden={!open}>
        <nav aria-label="Mobile" className="wrap">
          <ul role="list" className={styles.panelList}>
            {navigation.map((item, i) => (
              <li key={item.href} style={{ animationDelay: `${i * 50}ms` }}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ animationDelay: `${navigation.length * 50}ms` }}>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Start a project
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
