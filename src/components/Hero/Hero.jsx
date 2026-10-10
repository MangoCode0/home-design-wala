import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__text">
            <p className="hero__intro">Architecture and interior design studio</p>
            <h1 className="hero__title">Designs That Feel Like Home.</h1>
            <p className="hero__copy">
              We design homes around the way you live: bright rooms, honest materials and
              plans that are easy to build.
            </p>
            <div className="hero__actions">
              <a href="#projects" className="btn btn--light">View our projects</a>
              <a href="#contact" className="btn btn--outline">Book a consultation</a>
            </div>
          </div>
          <aside className="hero__feature" aria-label="Featured design">
            <span className="hero__feature-label">Featured design</span>
            <a href="/projects/static/static-contemporary-villa" className="hero__feature-link">
              Contemporary Villa <span aria-hidden="true">↗</span>
            </a>
            <span className="hero__feature-category">Architecture</span>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Hero;
