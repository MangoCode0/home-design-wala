import "./SectionHeading.css";

// Repeated heading block: an optional small intro line, a big title and an optional paragraph.
function SectionHeading({ intro, title, text, light = false }) {
  return (
    <div className={`section-heading ${light ? "section-heading--light" : ""}`}>
      {intro && <p className="section-heading__intro">{intro}</p>}
      <h2 className="section-heading__title">{title}</h2>
      {text && <p className="section-heading__text">{text}</p>}
    </div>
  );
}

export default SectionHeading;
