import ProjectCard from "../ProjectCard/ProjectCard";
import SectionHeading from "../SectionHeading/SectionHeading";
import Reveal from "../Reveal/Reveal";
import useApiCollection from "../../hooks/useApiCollection";
import "./FeaturedProjects.css";

function FeaturedProjects() {
  const { items: projects, loading, error } = useApiCollection("/api/projects/");

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeading
          intro="Featured projects"
          title="Recent homes we have designed"
          text="A selection of residences, interiors and gardens from the past three years."
        />

        {loading && <p role="status">Loading projects…</p>}
        {error && <p role="alert">Projects could not be loaded. {error}</p>}
        {!loading && !error && projects.length === 0 && <p>No projects are available yet.</p>}
        <div className="projects__grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 0.12}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
