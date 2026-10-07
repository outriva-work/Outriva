"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { SketchPad, type SketchPadHandle } from "./SketchPad";
import styles from "./ContactForm.module.css";

interface Props {
  services: { id: string; name: string }[];
  /** Pre-filled when arriving from a case study. */
  context?: string;
}

const timelines = ["As soon as possible", "In the next 1–3 months", "Later this year", "Just exploring"];

type Status = { s: "idle" } | { s: "sending" } | { s: "sent" } | { s: "error"; message: string };

export function ContactForm({ services, context }: Props) {
  const pad = useRef<SketchPadHandle>(null);
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      services: fd.getAll("services").map(String),
      timeline: String(fd.get("timeline") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
      sketch: pad.current?.toDataURL() ?? null,
    };

    const next: Record<string, string> = {};
    if (!data.name) next.name = "Add your name so we know who to reply to.";
    if (!data.email) next.email = "Add an email address for our reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Check the email address, for example name@company.com.";
    if (!data.message && !data.sketch) next.message = "Describe the project, or sketch it below.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus({ s: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "The message didn't send.");
      setStatus({ s: "sent" });
      form.reset();
      pad.current?.clear();
    } catch (err) {
      setStatus({ s: "error", message: err instanceof Error ? err.message : "The message didn't send." });
    }
  }

  if (status.s === "sent") {
    return (
      <div className={styles.sent} role="status">
        <p className="note" style={{ fontSize: "2rem" }}>
          got it, thanks!
        </p>
        <h2 className="h2">Message sent.</h2>
        <p className="lead muted">We&apos;ll reply to the email you gave with questions and a rough plan.</p>
        <div className={styles.sentActions}>
          <Link href="/work" className="btn btn--ink">
            Look at the work meanwhile
          </Link>
          <button type="button" className="btn btn--paper" onClick={() => setStatus({ s: "idle" })}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const field = (name: string) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });
  const err = (name: string) =>
    errors[name] ? (
      <p id={`e-${name}`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="f-name">Your name</label>
          <input type="text" autoComplete="name" {...field("name")} />
          {err("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="f-email">Email</label>
          <input type="email" autoComplete="email" inputMode="email" {...field("email")} />
          {err("email")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="f-company">
          Company <span className={styles.optional}>optional</span>
        </label>
        <input type="text" autoComplete="organization" {...field("company")} />
      </div>

      <fieldset className={styles.fieldset}>
        <legend>What do you need?</legend>
        <div className={styles.choices}>
          {services.map((s) => (
            <label key={s.id} className={styles.choice}>
              <input type="checkbox" name="services" value={s.name} />
              <span>{s.name}</span>
            </label>
          ))}
          <label className={styles.choice}>
            <input type="checkbox" name="services" value="Not sure yet" />
            <span>Not sure yet</span>
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>When would you like to start?</legend>
        <div className={styles.choices}>
          {timelines.map((t, i) => (
            <label key={t} className={styles.choice}>
              <input type="radio" name="timeline" value={t} defaultChecked={i === 3} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="f-message">Tell us about it</label>
        <textarea
          rows={5}
          defaultValue={context}
          placeholder="What's not working, who it's for, any deadlines or tools you use today"
          {...field("message")}
        />
        {err("message")}
      </div>

      <div className={styles.field}>
        <span className={styles.labelLike}>
          Or sketch it <span className={styles.optional}>optional, sent as an image</span>
        </span>
        <SketchPad ref={pad} />
      </div>

      {/* Hidden from people; spam bots tend to fill it in. */}
      <div aria-hidden="true" className={styles.trap}>
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.s === "error" && (
        <p className={styles.formError} role="alert">
          {status.message} Try again, or email us directly.
        </p>
      )}

      <div className={styles.submit}>
        <button type="submit" className="btn btn--ink" disabled={status.s === "sending"}>
          {status.s === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="small muted">We read every message ourselves.</p>
      </div>
    </form>
  );
}
