import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import staticProjects from "../data/staticProjects";
import useApiCollection from "../hooks/useApiCollection";
import { getProjectCategoryName } from "../data/publicPortfolio";
import "./StaticProjectDetails.css";

function StaticProjectDetails() {
  const { projectId } = useParams();
  const project = staticProjects.find((item) => item.id === projectId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { items: apiProjects } = useApiCollection("/api/projects/");
  const { items: apiCategories } = useApiCollection("/api/categories/");
  const apiMatch = project && apiProjects.find((item) => (
    String(item.status || "").toLocaleLowerCase() === "published"
    && String(item.title || "").trim().toLocaleLowerCase() === project.title.trim().toLocaleLowerCase()
    && (!String(item.image || "").trim() || String(item.image).trim() === project.image)
  ));
  const apiCategoryName = apiMatch && getProjectCategoryName(apiMatch, apiCategories);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [projectId]);

  if (!project) {
    return (
      <main className="static-project-page">
        <div className="container static-project__not-found">
          <p className="static-project__eyebrow">PORTFOLIO</p>
          <h1>Project not found</h1>
          <p>This project is not available in the public portfolio.</p>
          <Link to="/#projects" className="btn btn--dark">Back to projects</Link>
        </div>
      </main>
    );
  }

  const activeImage = project.gallery[activeImageIndex];
  const showPrevious = () => {
    setActiveImageIndex((current) => (current - 1 + project.gallery.length) % project.gallery.length);
  };
  const showNext = () => {
    setActiveImageIndex((current) => (current + 1) % project.gallery.length);
  };

  return (
    <main className="static-project-page">
      <div className="container static-project">
        <Link to="/#projects" className="static-project__back">← Back to projects</Link>
        <header className="static-project__heading">
          <p className="static-project__eyebrow">{apiCategoryName && apiCategoryName !== "Uncategorised" ? apiCategoryName : project.category}</p>
          <h1>{project.title}</h1>
        </header>

        <section className="static-project__gallery" aria-label={`${project.title} gallery`}>
          <div className="static-project__viewer">
            <img
              src={activeImage}
              alt={`${project.title}, image ${activeImageIndex + 1} of ${project.gallery.length}`}
            />
            {project.gallery.length > 1 && (
              <>
                <button
                  className="static-project__arrow static-project__arrow--previous"
                  type="button"
                  onClick={showPrevious}
                  aria-label="Show previous image"
                >
                  ‹
                </button>
                <button
                  className="static-project__arrow static-project__arrow--next"
                  type="button"
                  onClick={showNext}
                  aria-label="Show next image"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {project.gallery.length > 1 && (
            <div className="static-project__thumbnails" aria-label="Choose a gallery image">
              {project.gallery.map((image, index) => (
                <button
                  className={`static-project__thumbnail ${index === activeImageIndex ? "is-active" : ""}`}
                  type="button"
                  key={image}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default StaticProjectDetails;
