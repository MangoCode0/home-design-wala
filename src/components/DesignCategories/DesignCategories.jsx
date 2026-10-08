import fallbackCategories from "../../data/categories";
import SectionHeading from "../SectionHeading/SectionHeading";
import useApiCollection from "../../hooks/useApiCollection";
import "./DesignCategories.css";

function DesignCategories() {
  const [categories] = useApiCollection("/api/categories/", fallbackCategories);

  return (
    <section className="section section--beige" id="categories">
      <div className="container">
        <SectionHeading
          intro="Design categories"
          title="Browse by room or space"
          text="Looking for ideas for one part of your home? Start here."
        />

        <div className="categories__grid">
          {categories.map((category) => (
            <a href="#projects" className="category" key={category.id}>
              <img src={category.image} alt="" loading="lazy" />
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
