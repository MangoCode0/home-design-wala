import { useMemo, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import DesignCategories from "./components/DesignCategories/DesignCategories";
import Services from "./components/Services/Services";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import About from "./components/About/About";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer/Footer";
import SiteMetadata from "./components/SiteMetadata";
import useApiCollection from "./hooks/useApiCollection";
import { buildPublicPortfolio } from "./data/publicPortfolio";

// App only decides the ORDER of the sections. Each section lives in its own file.
function App() {
  const projectCollection = useApiCollection("/api/projects/");
  const categoryCollection = useApiCollection("/api/categories/");
  const [selectedCategory, setSelectedCategory] = useState("");
  const portfolio = useMemo(
    () => buildPublicPortfolio(categoryCollection.items, projectCollection.items),
    [categoryCollection.items, projectCollection.items],
  );

  return (
    <>
      <SiteMetadata />
      <Navbar />
      <main>
        <Hero />
        <FeaturedProjects
          projects={portfolio.projects}
          categories={portfolio.categories}
          loading={projectCollection.loading}
          error={projectCollection.error}
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory("")}
        />
        <DesignCategories
          categories={portfolio.categories}
          projects={portfolio.projects}
          loading={categoryCollection.loading}
          error={categoryCollection.error}
          onSelectCategory={setSelectedCategory}
        />
        <Services />
        <HowItWorks />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
