import steps from "../../data/steps";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="section section--dark" id="process">
      <div className="container">
        <SectionHeading
          light
          intro="How it works"
          title="From first call to front door in four steps"
        />

        {/* An ordered list <ol> is the right tag because the steps happen in order */}
        <ol className="steps__list">
          {steps.map((step) => (
            <li className="step" key={step.id}>
              <span className="step__number">{step.id}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
