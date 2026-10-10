import { useEffect, useState } from "react";
import "./Navbar.css";

// The links shown in the menu. "href" points to a section id on the page.
const links = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false); // has the page been scrolled?
  const [menuOpen, setMenuOpen] = useState(false); // is the mobile menu open?

  // Listen to scrolling so the bar can get a background after we leave the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled || menuOpen ? "navbar--solid" : ""}`}>
      <div className="container navbar__inner">
        <a href="#top" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src="/images/home-design-wala-logo.png" alt="" />
          <span>Home Design Wala</span>
        </a>

        <nav className={`navbar__menu ${menuOpen ? "navbar__menu--open" : ""}`} aria-label="Main">
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--dark navbar__cta" onClick={() => setMenuOpen(false)}>
            Book a consultation
          </a>
        </nav>

        <button
          className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
