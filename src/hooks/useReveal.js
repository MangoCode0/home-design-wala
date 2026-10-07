import { useEffect, useRef, useState } from "react";

// Small custom hook: tells us when an element has scrolled into view.
// Returns [ref, visible]. Attach "ref" to an element; "visible" turns true once it appears.
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only animate once
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect(); // clean up when the component is removed
  }, []);

  return [ref, visible];
}

export default useReveal;
