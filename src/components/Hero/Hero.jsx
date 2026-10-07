import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__intro">Architecture and interior design studio</p>
          <h1 className="hero__title">Designs That Feel Like Home.</h1>
          <p className="hero__copy">
            We design homes around the way you live: bright rooms, honest materials and
            plans that are easy to build.
          </p>
          <div className="hero__actions">
            <a href="#projects" className="btn btn--dark">View our projects</a>
            <a href="#contact" className="btn btn--outline">Book a consultation</a>
          </div>
        </div>

        {/* The arched frame is the signature shape of the site */}
        <div className="hero__image">
          <img src="/images/hero.svg" alt="Sunlit living room with tall arched windows" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
