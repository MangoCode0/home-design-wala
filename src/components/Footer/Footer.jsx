import "./Footer.css";
import useApiResource from "../../hooks/useApiResource";

function Footer() {
  const year = new Date().getFullYear();
  const { value: settings, loading, error } = useApiResource("/api/settings/");
  const socialLinks = [
    ["Instagram", settings?.instagramUrl],
    ["Facebook", settings?.facebookUrl],
    ["YouTube", settings?.youtubeUrl],
    ["Pinterest", settings?.pinterestUrl],
  ].filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-heading">
            <img src="/images/home-design-wala-logo.png" alt="Home Design Wala logo" />
            <p className="footer__logo">{settings?.businessName || "Home Design Wala"}</p>
          </div>
          {settings?.shortDescription && <p>{settings.shortDescription}</p>}
        </div>

        <nav aria-label="Footer">
          <h3>Explore</h3>
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <div>
          <h3>Contact</h3>
          <ul>
            {settings?.businessEmail && <li><a href={`mailto:${settings.businessEmail}`}>{settings.businessEmail}</a></li>}
            {settings?.phoneNumber && <li><a href={`tel:${settings.phoneNumber}`}>{settings.phoneNumber}</a></li>}
            {settings?.whatsappNumber && <li><a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a></li>}
            {settings?.businessAddress && <li>{settings.businessAddress}</li>}
            {settings?.businessHours && <li>{settings.businessHours}</li>}
            {socialLinks.map(([label, url]) => <li key={label}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}
            {loading && <li role="status">Loading contact details…</li>}
            {error && <li role="alert">Contact details are temporarily unavailable.</li>}
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {year} Home Design Wala. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
