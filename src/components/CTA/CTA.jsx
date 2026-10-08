import { useState } from "react";
import { apiRequest } from "../../api/client";
import "./CTA.css";

const emptyEnquiry = { name: "", email: "", phone: "", city: "", project: "", message: "" };

function CTA() {
  const [form, setForm] = useState(emptyEnquiry);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSubmitted(false);
    try {
      await apiRequest("/api/enquiries/", { method: "POST", body: form });
      setForm(emptyEnquiry);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || "Your request could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section cta" id="contact">
      <div className="container cta__inner">
        <h2>Planning a new home or a renovation?</h2>
        <p>Share a few details about your project and the studio can get back to you.</p>
        <form className="cta__form" onSubmit={submit}>
          <div className="cta__fields">
            <label>Name<input name="name" value={form.name} onChange={update} autoComplete="name" required maxLength="200" /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required maxLength="320" /></label>
            <label>Phone<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" required maxLength="40" /></label>
            <label>City<input name="city" value={form.city} onChange={update} autoComplete="address-level2" maxLength="120" /></label>
            <label className="cta__field-wide">Project type<input name="project" value={form.project} onChange={update} required maxLength="200" /></label>
            <label className="cta__field-wide">How can we help?<textarea name="message" value={form.message} onChange={update} rows="4" required /></label>
          </div>
          {error && <p className="cta__message cta__message--error" role="alert">{error}</p>}
          {submitted && <p className="cta__message" role="status">Your enquiry has been sent. Thank you.</p>}
          <button className="btn btn--light" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Request a consultation"}</button>
        </form>
      </div>
    </section>
  );
}

export default CTA;
