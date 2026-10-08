import SectionHeading from "../SectionHeading/SectionHeading";
import useApiCollection from "../../hooks/useApiCollection";
import "./Services.css";

function Services() {
  const { items: services, loading, error } = useApiCollection("/api/services/");

  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading
          intro="Services"
          title="Everything your home needs, in one studio"
          text="Use us for the whole project or just the part you need help with."
        />

        {loading && <p role="status">Loading services…</p>}
        {error && <p role="alert">Services could not be loaded. {error}</p>}
        {!loading && !error && services.length === 0 && <p>No services are available yet.</p>}
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
