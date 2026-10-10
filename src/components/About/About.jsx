import "./About.css";

function About() {
  return (
    <section className="section" id="about">
      <div className="container about__inner">
        <div className="about__image">
          <img src="/images/projects/modern-residence-02-cover.png" alt="Modern architectural residence exterior render" loading="lazy" />
        </div>

        <div className="about__text">
          <p className="about__intro">About Home Design Wala</p>
          <h2>A small studio that treats every home as personal.</h2>
          <p>
            Home Design Wala is a team of architects and interior designers. We keep our
            project list short so each family gets our full attention.
          </p>
          <p>
            We believe a good home is quiet, full of natural light and built from
            materials that age well.
          </p>

        </div>
      </div>
    </section>
  );
}

export default About;
