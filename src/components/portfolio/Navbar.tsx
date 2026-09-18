import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "workflow", label: "Workflow" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 20);

    let current = "home";

    for (const l of LINKS) {
      const el = document.getElementById(l.id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();

      if (rect.top <= 120 && rect.bottom >= 120) {
        current = l.id;
        break;
      }
    }

    setActive(current);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => window.removeEventListener("scroll", onScroll);
}, []);
  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
        <button onClick={() => go("home")} className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-red text-sm font-black text-white red-glow">
            S
          </span>
          <span className="font-semibold tracking-tight">
            Sreejith<span className="text-red"></span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active === l.id ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-red"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden rounded-md p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-white/5"
          >
            <ul className="flex flex-col p-4">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className={`w-full rounded-md px-3 py-3 text-left text-sm ${
                      active === l.id ? "text-white bg-white/5" : "text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
