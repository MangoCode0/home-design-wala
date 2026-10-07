import services from "../../data/services";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./Services.css";

function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading
          intro="Services"
          title="Everything your home needs, in one studio"
          text="Use us for the whole project or just the part you need help with."
        />

        <ul className="services__list">
          {services.map((service) => (
            <li className="service" key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;
