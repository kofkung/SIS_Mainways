import { useEffect, useMemo, useState } from "react";
import logo from "../SiSlogo.jpg";
import logoWhite from "../assets/sis-logo-white.png";
import heroGate from "../assets/sis-mrt-fare-gates-hero.jpg";
import focusGate from "../assets/sis-bidirectional-gate-focus.jpg";
import job7 from "../assets/services/job7.jpg";
import job6 from "../assets/services/job6.jpg";
import job3 from "../assets/services/job3.jpg";
import job5 from "../assets/services/job5.jpg";
import job13 from "../assets/services/job13.jpg";

const routes = ["home", "about", "services", "projects", "products", "contact"];

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact" },
];

const services = [
  {
    icon: "gate",
    title: "Fare Gate Systems",
    body: "Bi-direction automatic gates and lane control solutions.",
  },
  {
    icon: "screen",
    title: "AFC Integration",
    body: "Seamless connection across systems, devices, and station operations.",
  },
  {
    icon: "tool",
    title: "Field Execution",
    body: "Installation, testing, and commissioning with operation handover.",
  },
  {
    icon: "support",
    title: "Service Support",
    body: "Responsive support throughout the system life cycle.",
  },
];

const portfolio = [
  {
    title: "Gate PID Replacement",
    customer: "Airport Rail Link",
    year: "2019",
    image: job6,
    category: "Fare Gate",
    body: "Replacement and installation work for a new Passenger Information Display model on fare gate equipment.",
  },
  {
    title: "Blue Line Extension Pilot Test",
    customer: "VIX Technology",
    year: "2019",
    image: job3,
    category: "Integration",
    body: "Acceptance support for Blue Line Extension Phase 1 and 2 pilot testing with station gate equipment.",
  },
  {
    title: "TVM Coin Box System",
    customer: "Airport Rail Link",
    year: "2019",
    image: job7,
    category: "AFC System",
    body: "Coin box work for Ticket Vending Machine equipment including mechanical readiness and field reference material.",
  },
  {
    title: "CCH Relocation",
    customer: "MRTA",
    year: "2019",
    image: job5,
    category: "Station Device",
    body: "OTP Central Clearing House relocation from CS Loxinfo to MRTA including transport and infrastructure coordination.",
  },
  {
    title: "Rabbit Reader Installation",
    customer: "Rabbit Card",
    year: "2019",
    image: job13,
    category: "AFC System",
    body: "Reader installation for Salaya Bus and RTC Nonthaburi City Bus payment acceptance.",
  },
];

const filterTabs = ["All Projects", "Fare Gate", "Station Device", "Integration", "AFC System"];
const processSteps = ["Planning", "Engineering", "Implementation", "Handover"];

const productCategories = [
  {
    id: "embedded",
    label: "Motherboard & SBC",
    catUrl: "https://www.ibase.com.tw/en/product/category/Embedded_Computing/Motherboard",
    products: [
      { model: "MI1005", name: "Mini-ITX Motherboard", desc: "Intel Core Ultra 200H/200U embedded board for AFC controllers and station devices.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_MI1005.png" },
      { model: "PI800", name: "PICO-ITX Motherboard", desc: "Ultra-compact Intel Atom x7000RE board for space-constrained fare gate control.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_PI800.png" },
      { model: "IB996", name: "Full-Size CPU Card", desc: "High-performance CPU card for central station AFC server and数据处理 units.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_IB996.png" },
      { model: "IB962", name: "3.5\" Single Board Computer", desc: "Intel Core Ultra 7/5 mobile processor SBC for trackside and tunnel environments.", img: "" },
    ],
  },
  {
    id: "transport",
    label: "Intelligent Transport",
    catUrl: "https://www.ibase.com.tw/en/product/category/Intelligent_Transportation",
    products: [
      { model: "MPT-R Series", name: "Railway Computer", desc: "EN 50155 certified railway computer for onboard AFC and train-ground communication.", img: "" },
      { model: "MPT-V Series", name: "In-Vehicle Computer", desc: "E-Mark certified vehicle computer for depot and maintenance yard operations.", img: "" },
      { model: "MPPC Series", name: "Railway Panel PC", desc: "Railway-grade touch panel for driver and operator interfaces in MRT cabs.", img: "" },
      { model: "MRD Series", name: "Bar-Type PIS Panel PC", desc: "Ultra-wide bar-type display for passenger information systems on platforms.", img: "" },
    ],
  },
  {
    id: "ai",
    label: "Edge AI & System",
    catUrl: "https://www.ibase.com.tw/en/product/category/Edge_AI___Intelligent_System",
    products: [
      { model: "EC3000", name: "Edge AI Computer", desc: "NVIDIA Jetson Orin NX platform for CCTV passenger counting and station security AI.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_EC3000.png" },
      { model: "AGS104T", name: "IoT Edge System", desc: "Ultra-compact IoT gateway for AFC device aggregation and remote station monitoring.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_AGS104T.png" },
      { model: "ACS413", name: "Compact Embedded System", desc: "Advanced compact system for real-time station supervision and data processing.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_ACS413.png" },
      { model: "ARS200", name: "Ruggedized System", desc: "Waterproof outdoor computer for trackside and exposed station environments.", img: "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_ARS200.png" },
    ],
  },
];

function getRouteFromHash() {
  const id = window.location.hash.replace("#", "").trim();
  return routes.includes(id) ? id : "home";
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <span className="menu-icon" aria-hidden="true" data-open={open ? "true" : "false"}>
      <i />
      <i />
    </span>
  );
}

function ServiceIcon({ type }) {
  const paths = {
    gate: (
      <>
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M9 7h6" />
        <path d="M9 17h6" />
      </>
    ),
    screen: (
      <>
        <path d="M5 6h14v10H5z" />
        <path d="M9 20h6" />
        <path d="M12 16v4" />
      </>
    ),
    tool: (
      <>
        <path d="M15 6 8 13" />
        <path d="m7 17 4-4 3 3-4 4z" />
        <path d="m14 5 5 5" />
      </>
    ),
    support: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2" />
        <path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2" />
        <path d="M15 20h-3" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className="feature-icon" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}

function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [navHidden, setNavHidden] = useState(false);

  function navigate(nextRoute) {
    if (!routes.includes(nextRoute)) {
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    window.history.pushState(null, "", `#${nextRoute}`);
    setRoute(nextRoute);
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    setFormStatus("Received. Connect this form to email or a backend before production launch.");
    event.currentTarget.reset();
  }

  const currentPage = useMemo(() => {
    return {
      home: <HomePage navigate={navigate} />,
      about: <AboutPage />,
      services: <ServicesPage />,
      projects: <ProjectsPage />,
      products: <ProductsPage />,
      contact: <ContactPage formStatus={formStatus} onSubmit={handleContactSubmit} />,
    }[route];
  }, [route, formStatus]);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRouteFromHash());
      setMenuOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      if (current > 80 && current > lastScroll) {
        setNavHidden(true);
      } else if (current === 0) {
        setNavHidden(false);
      }
      lastScroll = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);

  function showNav() { setNavHidden(false); }

  return (
    <>
      <Header route={route} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} navHidden={navHidden} showNav={showNav} />
      <main className="page-shell">{currentPage}</main>
      <Footer navigate={navigate} />
    </>
  );
}

function Header({ route, menuOpen, setMenuOpen, navigate, navHidden, showNav }) {
  return (
    <header className={`site-header${navHidden ? " is-hidden" : ""}`}>
      <button className="brand" type="button" onClick={() => navigate("home")} aria-label="SIS home">
        <img src={logoWhite} alt="SIS Siam Infinity Solution logo" />
      </button>

      <button
        className="menu-button"
        type="button"
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon open={menuOpen} />
      </button>

      <nav className="nav-panel" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={route === item.id ? "nav-link is-active" : "nav-link"}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button className="top-bar" type="button" onClick={showNav} aria-label="Show navigation" />
    </header>
  );
}

function HomePage({ navigate }) {
  return (
    <section className="home-page">
      <section className="hero cinematic">
        <figure className="hero-bg" aria-hidden="true">
          <img src={heroGate} alt="" />
        </figure>
        <div className="hero-copy reveal">
          <p className="hero-kicker">MRT Fare Gate & AFC Systems</p>
          <h1 aria-label="SIS Siam Infinity Solution Co., Ltd.">
            <span aria-hidden="true">SIS Siam Infinity</span>
            <span aria-hidden="true">Solution Co., Ltd.</span>
          </h1>
          <p>
            SIS Siam Infinity Solution delivers reliable fare collection systems, bi-direction automatic
            gates, and station integration for the MRT network.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={() => navigate("projects")}>
              View projects
              <ArrowIcon />
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate("services")}>
              Our services
            </button>
          </div>
        </div>
        <div className="feature-rail reveal">
          {services.map((service) => (
            <article className="feature-item" key={service.title}>
              <ServiceIcon type={service.icon} />
              <div>
                <h2>{service.title}</h2>
                <p>{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="focus-section">
        <div className="focus-copy reveal">
          <p className="section-kicker">Our focus</p>
          <h2>Bi-directions Automatic Gates</h2>
          <p>
            Our current focus is the development and deployment of bi-directions automatic gates that
            support controlled entry and exit flow in the same lane, improving station efficiency
            without compromising safety.
          </p>
          <button className="outline-button" type="button" onClick={() => navigate("services")}>
            Learn more
          </button>
        </div>
        <figure className="focus-media reveal">
          <img src={focusGate} alt="Bi-directions automatic fare gate concept" />
        </figure>
      </section>

      <ProcessSection />
    </section>
  );
}

function AboutPage() {
  return (
    <PageFrame
      kicker="About SIS"
      title="Infrastructure work with station-level discipline"
      text="SIS focuses on MRT fare collection systems, AFC interfaces, station devices, and field execution that stays reliable under daily passenger load."
    >
      <section className="section two-column">
        <article className="glass-card reveal">
          <span className="card-tag">Operating logic</span>
          <h2>Clear for passengers and station teams</h2>
          <p>
            Fare gate work has to be readable under pressure. We design around lane behavior, gate state,
            operator handover, and passenger guidance.
          </p>
        </article>
        <article className="glass-card reveal">
          <span className="card-tag">Field detail</span>
          <h2>Built from survey to acceptance</h2>
          <p>
            The work moves from technical survey into installation, testing, commissioning, and handover
            records that help teams maintain confidence after launch.
          </p>
        </article>
      </section>
      <ProcessSection />
    </PageFrame>
  );
}

function ServicesPage() {
  return (
    <PageFrame
      kicker="Services"
      title="MRT fare gate and AFC delivery"
      text="Focused support for automatic gates, ticketing interfaces, field devices, testing, and operation handover."
    >
      <section className="section service-list">
        {services.map((service, index) => (
          <article className="service-row reveal" key={service.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <ServiceIcon type={service.icon} />
            <div>
              <h2>{service.title}</h2>
              <p>{service.body}</p>
            </div>
          </article>
        ))}
      </section>
      <ProcessSection />
    </PageFrame>
  );
}

function ProjectsPage() {
  return (
    <PageFrame
      className="project-page"
      kicker="Our projects"
      title="SIS MRT Projects"
      text="Selected projects and references from MRTA, ARL, BEM, VIX Technology, and Rabbit Card."
    >
      <section className="section portfolio-grid">
        {portfolio.map((project) => (
          <article className="portfolio-card reveal" key={project.title}>
            <figure>
              <img src={project.image} alt={`${project.title} reference`} />
            </figure>
            <div className="portfolio-copy">
              <p className="portfolio-meta">
                {project.year} - {project.customer}
              </p>
              <h2>{project.title}</h2>
              <p>{project.body}</p>
              <button type="button" aria-label={`View ${project.title}`}>
                <ArrowIcon />
              </button>
            </div>
          </article>
        ))}
      </section>
      <ProcessSection />
    </PageFrame>
  );
}

function ProductsPage() {
  const [activeCat, setActiveCat] = useState("embedded");
  const [failedImgs, setFailedImgs] = useState({});

  const handleImgError = (model) => {
    setFailedImgs((prev) => ({ ...prev, [model]: true }));
  };

  const active = productCategories.find((c) => c.id === activeCat) || productCategories[0];

  return (
    <PageFrame
      className="product-page"
      kicker="Partner products"
      title="iBASE Industrial Computing"
      text="Industrial motherboards, railway computers, edge AI systems, and IoT gateways from iBASE Technology — deployed in AFC systems across the MRT network."
    >
      <section className="section product-section">
        <div className="product-tabs" role="tablist">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              type="button"
              aria-selected={activeCat === cat.id}
              className={`product-tab${activeCat === cat.id ? " is-active" : ""}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {active.products.map((product) => (
            <article className="product-card reveal" key={product.model}>
              <a href={active.catUrl} target="_blank" rel="noopener noreferrer" className="product-card-fig">
                {product.img && !failedImgs[product.model] ? (
                  <img
                    src={product.img}
                    alt={product.model}
                    onError={() => handleImgError(product.model)}
                    loading="lazy"
                  />
                ) : (
                  <span className="product-card-icon">{active.label[0]}</span>
                )}
                <span className="product-model">{product.model}</span>
                <span className="product-card-bar">
                  View on iBASE
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </a>
              <div className="product-card-body">
                <h2>{product.name}</h2>
                <p>{product.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function ContactPage({ formStatus, onSubmit }) {
  const [topic, setTopic] = useState("general");

  return (
    <PageFrame
      kicker="Contact"
      title="Start with the station problem"
      text="Send a short project note and the SIS team can review the station context, system scope, and next step."
    >
      <section className="section contact-layout">
        <div className="contact-note reveal">
          <img src={logo} alt="SIS Siam Infinity Solution logo" />
          <h2>Tell us what needs to move better.</h2>
          <p>
            Share the station, equipment involved, passenger-flow issue, and target timeline. That is
            enough to begin a practical review.
          </p>
          <hr />
          <p><strong>Siam Infinity Solution Co., Ltd.</strong></p>
          <p>111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240</p>
          <p>Tel: +66 089 924 3843</p>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps?q=111/2+Ramkhamhaeng+94+Alley+Saphan+Sung+Bangkok+10240&output=embed&z=15"
              allowfullscreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SIS office location"
            />
          </div>
        </div>
        <form className="contact-form reveal" onSubmit={onSubmit}>
          <label>
            Subject
            <select
              className="contact-select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            >
              <option value="general">Contact Services</option>
              <option value="product">Ask for Products</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </label>

          {topic === "product" ? (
            <>
              <label>
                Product interested
                <select className="contact-select" name="product" required>
                  <option value="">Select product...</option>
                  <option value="gate">Fare Gate Systems</option>
                  <option value="afc">AFC Integration</option>
                  <option value="field">Field Execution</option>
                </select>
              </label>
              <label>
                Company
                <input name="company" type="text" required />
              </label>
            </>
          ) : topic === "support" ? (
            <>
              <label>
                Station / Location
                <input name="station" type="text" placeholder="e.g. MRT Bang Sue" required />
              </label>
              <label>
                Device
                <input name="device" type="text" placeholder="e.g. Fare gate #12" />
              </label>
            </>
          ) : null}

          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email or phone
            <input name="contact" type="text" autoComplete="email" required />
          </label>
          <label>
            Messages
            <textarea
              name="message"
              rows={topic === "general" ? 5 : 3}
              placeholder={
                topic === "product" ? "Describe the product you are interested in..."
                  : topic === "support" ? "Describe the issue at the station..."
                  : "How can we help you?"
              }
              required
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Send project note
            <ArrowIcon />
          </button>
          <p className="form-status" role="status">
            {formStatus}
          </p>
        </form>
      </section>
    </PageFrame>
  );
}

function ProcessSection() {
  return (
    <section className="process-section">
      <div className="process-copy">
        <p className="section-kicker">End-to-end delivery</p>
        <h2>From Design to Daily Operation</h2>
      </div>
      <div className="process-track reveal">
        {processSteps.map((step, index) => (
          <article key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            <p>
              {
                [
                  "Understand station flow and technical scope.",
                  "Design system logic and integration.",
                  "Install, test, and commission on site.",
                  "Deliver documentation and operation support.",
                ][index]
              }
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageFrame({ className = "", kicker, title, text, children }) {
  return (
    <section className={`sub-page ${className}`}>
      <section className="sub-hero reveal">
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      {children}
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logoWhite} alt="SIS Siam Infinity Solution logo" />
        <p>MRT fare gates, AFC integration, station devices, and project support.</p>
        <p className="footer-contact">
          Siam Infinity Solution Co., Ltd.<br />
          111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240<br />
          Tel: +66 089 924 3843
        </p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => navigate(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      <small>&copy; 2026 SIS Siam Infinity Solution. All rights reserved.</small>
    </footer>
  );
}

export default App;
