import SectionHeading from "../SectionHeading/SectionHeading";
import useApiCollection from "../../hooks/useApiCollection";
import "./Services.css";

function getServiceFeatures(service) {
  if (Array.isArray(service.features)) return service.features.filter(Boolean);

  return String(service.fullDescription || service.full_description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*•]\s+/.test(line))
    .map((line) => line.replace(/^[-*•]\s+/, ""));
}

function Services() {
  const { items: services, loading, error, reload } = useApiCollection("/api/services/");
  const displayServices = services
    .map((service) => ({
      ...service,
      title: service.title || service.name,
      text: service.text || service.description || service.fullDescription,
    }))
    .filter((service) => service.title && String(service.status || "").toLocaleLowerCase() === "published");

  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading
          intro="Services"
          title="Everything your home needs, in one studio"
          text="Use us for the whole project or just the part you need help with."
        />

        {loading && <p role="status">Loading services…</p>}
        {!loading && error && (
          <div className="services__empty" role="alert">
            <p>Published service details could not be loaded. Please try again or share your project through the consultation form.</p>
            <div className="services__actions">
              <button className="btn btn--outline" type="button" onClick={reload}>Retry loading services</button>
              <a className="btn btn--light" href="#contact">Discuss your project</a>
            </div>
          </div>
        )}
        {!loading && !error && displayServices.length === 0 && (
          <div className="services__empty">
            <p>No published service listings are available right now.</p>
            <a className="btn btn--light" href="#contact">Discuss your project</a>
          </div>
        )}
        {displayServices.length > 0 && (
          <ul className="services__list">
            {displayServices.map((service, index) => {
              const features = getServiceFeatures(service);
              return (
                <li className="service" key={service.id ?? service.title}>
                  <span className="service__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {service.icon && <span className="service__icon" aria-hidden="true">{service.icon}</span>}
                  <h3>{service.title}</h3>
                  {service.text && <p>{service.text}</p>}
                  {features.length > 0 && (
                    <ul className="service__features">
                      {features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  )}
                  <a className="service__link" href="#contact">Discuss your project <span aria-hidden="true">↗</span></a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Services;
