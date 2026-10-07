import testimonials from "../../data/testimonials";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="section section--beige" id="testimonials">
      <div className="container">
        <SectionHeading intro="Client reviews" title="What our clients say" />

        <div className="testimonials__grid">
          {testimonials.map((item) => (
            <figure className="testimonial" key={item.id}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
