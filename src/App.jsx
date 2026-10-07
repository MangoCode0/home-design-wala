import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import DesignCategories from "./components/DesignCategories/DesignCategories";
import Services from "./components/Services/Services";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import About from "./components/About/About";
import Testimonials from "./components/Testimonials/Testimonials";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer/Footer";

// App only decides the ORDER of the sections. Each section lives in its own file.
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProjects />
        <DesignCategories />
        <Services />
        <HowItWorks />
        <About />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
