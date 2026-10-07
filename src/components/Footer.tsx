import Link from "next/link";
import { navigation, site } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className="muted small">{site.description}</p>
        </div>
        <nav aria-label="Services" className={styles.col}>
          <h2 className="label">Services</h2>
          <ul role="list">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/#${s.id}`} className="link link--quiet">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Studio" className={styles.col}>
          <h2 className="label">Studio</h2>
          <ul role="list">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link link--quiet">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="link link--quiet">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.col}>
          <h2 className="label">Say hello</h2>
          <ul role="list">
            <li>
              <a href={`mailto:${site.email}`} className="link link--quiet">
                {site.email}
              </a>
            </li>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link link--quiet">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Outriva</p>
        <p>{site.location}</p>
      </div>
    </footer>
  );
}
