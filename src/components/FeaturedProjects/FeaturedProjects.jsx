import ProjectCard from "../ProjectCard/ProjectCard";
import SectionHeading from "../SectionHeading/SectionHeading";
import Reveal from "../Reveal/Reveal";
import { getProjectCategoryName } from "../../data/publicPortfolio";
import "./FeaturedProjects.css";

function FeaturedProjects({
  projects,
  categories,
  loading,
  error,
  selectedCategory,
  onClearCategory,
}) {
  const displayedProjects = selectedCategory
    ? projects.filter((project) => (
      getProjectCategoryName(project, categories).toLocaleLowerCase()
      === selectedCategory.toLocaleLowerCase()
    ))
    : projects;

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeading
          intro="Featured projects"
          title="Recent homes we have designed"
          text="A selection of residences, interiors and gardens from the past three years."
        />

        {loading && <p role="status">Loading live projects…</p>}
        {error && <p className="projects__notice" role="alert">Live projects could not be loaded. Showing the locally available portfolio.</p>}
        {selectedCategory && (
          <div className="projects__filter">
            <p>Showing {displayedProjects.length} {displayedProjects.length === 1 ? "project" : "projects"} in {selectedCategory}.</p>
            <button type="button" onClick={onClearCategory}>Show all projects</button>
          </div>
        )}
        {!loading && !error && displayedProjects.length === 0 && (
          <p>{selectedCategory ? `No published projects are currently listed in ${selectedCategory}.` : "No projects are available yet."}</p>
        )}
        <div className="projects__grid">
          {displayedProjects.map((project, index) => (
            <Reveal key={`${project.detailPath ? "static" : "api"}-${project.id}`} delay={(index % 3) * 0.12}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
