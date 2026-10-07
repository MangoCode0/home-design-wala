import "./ProjectCard.css";

// One project tile. It only displays the data it receives through "project".
function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__image">
        <img src={project.image} alt={`${project.title}, ${project.location}`} loading="lazy" />
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__meta">
        {project.category}, {project.location}, {project.year}
      </p>
    </article>
  );
}

export default ProjectCard;
