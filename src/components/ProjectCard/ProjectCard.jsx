import { Link } from "react-router-dom";
import "./ProjectCard.css";

const fallbackImage = "/images/projects/contemporary-villa-cover.png";

// One project tile. It only displays the data it receives through "project".
function ProjectCard({ project }) {
  const card = (
    <article className="project-card">
      <div className="project-card__image">
        <img
          src={project.image || fallbackImage}
          alt={project.title}
          loading="lazy"
          onError={(event) => {
            if (event.currentTarget.getAttribute("src") !== fallbackImage) {
              event.currentTarget.src = fallbackImage;
            }
          }}
        />
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__meta">
        {[project.category, project.location, project.year].filter(Boolean).join(", ")}
      </p>
    </article>
  );

  const detailPath = project.detailPath
    || (project.id ? `/projects/${encodeURIComponent(project.id)}` : null);

  return detailPath
    ? <Link className="project-card__link" to={detailPath}>{card}</Link>
    : card;
}

export default ProjectCard;
