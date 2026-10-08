import fallbackProjects from "../../data/projects";
import ProjectCard from "../ProjectCard/ProjectCard";
import SectionHeading from "../SectionHeading/SectionHeading";
import Reveal from "../Reveal/Reveal";
import useApiCollection from "../../hooks/useApiCollection";
import "./FeaturedProjects.css";

function FeaturedProjects() {
  const [projects] = useApiCollection("/api/projects/", fallbackProjects);

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeading
          intro="Featured projects"
          title="Recent homes we have designed"
          text="A selection of residences, interiors and gardens from the past three years."
        />

        <div className="projects__grid">
          {/* .map() makes one card for every project in the data file */}
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
