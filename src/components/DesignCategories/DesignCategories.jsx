import SectionHeading from "../SectionHeading/SectionHeading";
import useApiCollection from "../../hooks/useApiCollection";
import "./DesignCategories.css";

function DesignCategories() {
  const { items: categories, loading, error } = useApiCollection("/api/categories/");

  return (
    <section className="section section--beige" id="categories">
      <div className="container">
        <SectionHeading
          intro="Design categories"
          title="Browse by room or space"
          text="Looking for ideas for one part of your home? Start here."
        />

        {loading && <p role="status">Loading categories…</p>}
        {error && <p role="alert">Categories could not be loaded. {error}</p>}
        {!loading && !error && categories.length === 0 && <p>No categories are available yet.</p>}
        <div className="categories__grid">
          {categories.map((category) => (
            <a href="#projects" className="category" key={category.id}>
              {category.image && <img src={category.image} alt="" loading="lazy" />}
              <div className="category__label">
                <h3>{category.name}</h3>
                <p>{category.count} designs</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DesignCategories;
