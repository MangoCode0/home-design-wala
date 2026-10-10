import SectionHeading from "../SectionHeading/SectionHeading";
import { getProjectsForCategory } from "../../data/publicPortfolio";
import "./DesignCategories.css";

const fallbackImage = "/images/projects/contemporary-villa-cover.png";

function DesignCategories({ categories, projects, loading, error, onSelectCategory }) {
  return (
    <section className="section section--beige" id="categories">
      <div className="container">
        <SectionHeading
          intro="Design categories"
          title="Browse by room or space"
          text="Looking for ideas for one part of your home? Start here."
        />

        {loading && <p className="categories__notice" role="status">Loading live categories…</p>}
        {error && <p className="categories__notice" role="alert">Live categories could not be loaded. Showing categories from the local portfolio.</p>}
        {!loading && !error && categories.length === 0 && <p className="categories__notice">No portfolio categories are available yet.</p>}
        <div className="categories__grid">
          {categories.map((category) => {
            const categoryProjects = category.projects || getProjectsForCategory(category, projects, categories);
            const categoryImage = categoryProjects.find((project) => project.image)?.image
              || category.image
              || fallbackImage;
            return (
              <a
                href="#projects"
                className="category"
                key={category.id ?? category.name.toLocaleLowerCase()}
                aria-label={`${category.name}, ${categoryProjects.length} ${categoryProjects.length === 1 ? "design" : "designs"}`}
                onClick={() => onSelectCategory(category.name)}
              >
                <img
                  src={categoryImage}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    if (event.currentTarget.getAttribute("src") !== fallbackImage) {
                      event.currentTarget.src = fallbackImage;
                    }
                  }}
                />
                <div className="category__label">
                  <h3>{category.name}</h3>
                  <p>{categoryProjects.length} {categoryProjects.length === 1 ? "design" : "designs"}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DesignCategories;
