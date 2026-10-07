import useReveal from "../../hooks/useReveal";
import "./Reveal.css";

// Wrap anything in <Reveal> and it fades up gently when scrolled into view.
// "delay" (in seconds) lets us stagger several items one after another.
function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default Reveal;
