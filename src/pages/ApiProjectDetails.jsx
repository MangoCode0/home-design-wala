import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../api/client";
import "./StaticProjectDetails.css";

const fallbackImage = "/images/projects/contemporary-villa-cover.png";

function getGallery(project) {
  const images = Array.isArray(project.gallery)
    ? project.gallery.filter((image) => typeof image === "string" && image.trim())
    : [];
  const cover = typeof project.image === "string" ? project.image.trim() : "";
  const uniqueImages = [...new Set([cover, ...images].filter(Boolean))];
  return uniqueImages.length ? uniqueImages : [fallbackImage];
}

function getSpecifications(project) {
  return [
    ["Location", project.location],
    ["Plot size", project.plotSize],
    ["Built-up area", project.size],
    ["Bedrooms", project.bedrooms],
    ["Bathrooms", project.bathrooms],
    ["Floors", project.floors],
    ["Style", project.style],
    ["Year", project.year],
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim());
}

function ApiProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setProject(null);
    setError("");
    setLoading(true);
    setActiveImageIndex(0);

    getApi(`/api/projects/${encodeURIComponent(projectId)}`)
      .then((result) => {
        if (!result || typeof result !== "object" || !result.id) {
          throw new Error("The project response was not valid.");
        }
        if (active) setProject(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this project.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <main className="static-project-page">
        <div className="container static-project__not-found">
          <p role="status">Loading project details…</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    const notFound = /API request failed \(404\)/.test(error);
    return (
      <main className="static-project-page">
        <div className="container static-project__not-found">
          <p className="static-project__eyebrow">PORTFOLIO</p>
          <h1>{notFound ? "Project not found" : "Project details unavailable"}</h1>
          <p role={notFound ? undefined : "alert"}>
            {notFound ? "This published project is not available." : error || "Project details could not be loaded. Please try again later."}
          </p>
          <Link to="/#projects" className="btn btn--dark">Back to projects</Link>
        </div>
      </main>
    );
  }

  const gallery = getGallery(project);
  const specifications = getSpecifications(project);
  const features = Array.isArray(project.features)
    ? project.features.filter((feature) => typeof feature === "string" && feature.trim())
    : [];
  const activeImage = gallery[activeImageIndex];

  const showImage = (index) => {
    setActiveImageIndex((index + gallery.length) % gallery.length);
  };

  return (
    <main className="static-project-page">
      <div className="container static-project">
        <Link to="/#projects" className="static-project__back">← Back to projects</Link>
        <header className="static-project__heading">
          {project.category && <p className="static-project__eyebrow">{project.category}</p>}
          <h1>{project.title}</h1>
          {project.location && <p className="api-project__location">{project.location}</p>}
        </header>

        <section className="static-project__gallery" aria-label={`${project.title} gallery`}>
          <div className="static-project__viewer">
            <img
              src={activeImage}
              alt={`${project.title}, image ${activeImageIndex + 1} of ${gallery.length}`}
              onError={(event) => {
                if (event.currentTarget.getAttribute("src") !== fallbackImage) {
                  event.currentTarget.src = fallbackImage;
                }
              }}
            />
            {gallery.length > 1 && (
              <>
                <button
                  className="static-project__arrow static-project__arrow--previous"
                  type="button"
                  onClick={() => showImage(activeImageIndex - 1)}
                  aria-label="Show previous image"
                >
                  ‹
                </button>
                <button
                  className="static-project__arrow static-project__arrow--next"
                  type="button"
                  onClick={() => showImage(activeImageIndex + 1)}
                  aria-label="Show next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="static-project__thumbnails" aria-label="Choose a gallery image">
              {gallery.map((image, index) => (
                <button
                  className={`static-project__thumbnail ${index === activeImageIndex ? "is-active" : ""}`}
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => showImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        {(project.description || specifications.length > 0 || features.length > 0 || project.floorPlan?.url) && (
          <div className="api-project__details">
            {project.description && (
              <section className="api-project__description">
                <p className="static-project__eyebrow">Project overview</p>
                <p>{project.description}</p>
              </section>
            )}
            {specifications.length > 0 && (
              <section className="api-project__specifications" aria-labelledby="project-specifications-title">
                <h2 id="project-specifications-title">Project details</h2>
                <dl>
                  {specifications.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            {features.length > 0 && (
              <section className="api-project__features">
                <h2>Features</h2>
                <ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </section>
            )}
            {project.floorPlan?.url && (
              <a className="btn btn--dark api-project__floor-plan" href={project.floorPlan.url} target="_blank" rel="noreferrer">
                View floor plan{project.floorPlan.name ? `: ${project.floorPlan.name}` : ""}
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default ApiProjectDetails;
