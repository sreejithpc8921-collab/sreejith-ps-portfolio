import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean;
};

export function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  target,
  rel,
  download,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "relative inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 will-change-transform";
  const styles = {
    primary: "bg-red text-white red-glow hover:brightness-110",
    outline: "border border-white/20 text-white hover:border-white/60 hover:bg-white/5",
    ghost: "text-white hover:bg-white/5",
  }[variant];

  const inner = (
    <motion.span
      onMouseMove={move}
      onMouseLeave={leave}
      className="inline-block"
      whileTap={{ scale: 0.97 }}
    >
      <span ref={ref} className="inline-block transition-transform duration-300 ease-out">
        {children}
      </span>
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        className={`${base} ${styles} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {inner}
    </button>
  );
}
