// import useInView from "./Amimation/Useinview";
import useInView from "./Useinview";

// <Reveal delay={150} dir="left">...</Reveal>
export default function Reveal({ children, delay = 0, dir = "up", className = "" }) {
  const [ref, inView] = useInView();
  const base = dir === "left" ? "reveal-left" : dir === "right" ? "reveal-right" : "reveal";
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${base} ${inView ? "show" : ""} ${className}`}
    >
      {children}
    </div>
  );
}