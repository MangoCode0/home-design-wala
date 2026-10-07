import "./Footer.css";

function Footer() {
  // new Date().getFullYear() keeps the copyright year up to date automatically.
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__logo">Home Design Wala</p>
          <p>Designs That Feel Like Home.</p>
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
            <li><a href="mailto:hello@homedesignwala.com">hello@homedesignwala.com</a></li>
            <li>+91 00000 00000</li>
            <li>Delhi NCR, India</li>
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
