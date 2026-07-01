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

const imgBase = "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/small_";

const productCategories = [
  {
    id: "embedded",
    label: "Embedded Computing",
    catUrl: "https://www.ibase.com.tw/en/product/category/Embedded_Computing",
    groups: [
      {
        name: "Motherboard",
        products: [
          { model: "MI1005", name: "Mini-ITX Motherboard", desc: "Intel Core Ultra 200H/200U for AFC controllers and station devices.", img: imgBase + "MI1005.png" },
          { model: "MBB1005", name: "ATX Motherboard", desc: "Intel Core Ultra 200S for central station AFC servers.", img: imgBase + "MBB1005.png" },
          { model: "MB998", name: "Micro ATX Motherboard", desc: "Intel Core 200E/200PE for medium-footprint control systems.", img: imgBase + "MB998.png" },
          { model: "PI800", name: "PICO-ITX Motherboard", desc: "Intel Atom x7000RE ultra-compact for fare gate control.", img: imgBase + "PI800.png" },
        ],
      },
      {
        name: "Single Board Computer",
        products: [
          { model: "IB962", name: '3.5" SBC', desc: "Intel Core Ultra 7/5 for trackside and tunnel environments.", img: imgBase + "IB962.png" },
          { model: "IB96W", name: '3.5" SBC Wide-Temp', desc: "13th Gen Intel Core wide-temperature for extreme conditions.", img: imgBase + "IB96W.png" },
          { model: "IB200", name: '2.5" SBC', desc: "AMD Ryzen Embedded R2000 for compact embedded systems.", img: imgBase + "IB200.png" },
          { model: "IBR117", name: '3.5" ARM SBC', desc: "NXP ARM Cortex-A9 i.MX 6 for low-power edge processing." },
          { model: "IBR215", name: '2.5" ARM SBC', desc: "NXP ARM Cortex-A53 i.MX 8M Plus for AI edge inference." },
        ],
      },
      {
        name: "CPU Module",
        products: [
          { model: "ET981", name: "COM Express Type 6", desc: "13th Gen Intel Core P-Series for modular system design.", img: imgBase + "ET981.png" },
          { model: "ET980", name: "COM Express Type 6", desc: "12th Gen Intel Core P-series for scalable performance." },
          { model: "IBQ800", name: "Qseven Module", desc: "Intel Atom x7/x5 for compact embedded upgrades." },
          { model: "ET839", name: "ETX Module", desc: "Intel Atom E3845 for legacy industrial systems." },
        ],
      },
      {
        name: "CPU Card & Accessories",
        products: [
          { model: "IB996", name: "Full-Size CPU Card", desc: "14th/13th/12th Gen Intel Core for central AFC processing.", img: imgBase + "IB996.png" },
          { model: "IP419", name: "COM Express Carrier", desc: "Type 6 carrier board for custom embedded solutions." },
          { model: "IP416", name: "Qseven Carrier", desc: "Carrier board for Qseven module integration." },
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "Edge AI & System",
    catUrl: "https://www.ibase.com.tw/en/product/category/Edge_AI___Intelligent_System",
    groups: [
      {
        name: "AI Computing",
        products: [
          { model: "EC3020", name: "Edge AI Computer", desc: "NVIDIA Jetson Orin NX/Nano for CCTV passenger counting.", img: imgBase + "EC3020.png" },
          { model: "EC3000", name: "Edge AI Computer", desc: "Jetson Orin platform for real-time station security AI.", img: imgBase + "EC3000.png" },
          { model: "EC3100", name: "Edge AI Computer", desc: "Jetson Orin with extended I/O for transportation AI." },
          { model: "ES1002", name: "Edge AI Server", desc: "AMD EPYC Embedded 8004 for high-throughput AI inferencing.", img: imgBase + "ES1002.png" },
        ],
      },
      {
        name: "Edge & IoT System",
        products: [
          { model: "AGS104T", name: "IoT Edge Gateway", desc: "Ultra-compact Intel Atom gateway for AFC device aggregation.", img: imgBase + "AGS104T.png" },
          { model: "AGS104L", name: "IoT Edge Gateway", desc: "Low-power variant for remote station monitoring." },
          { model: "ACS413", name: "Compact Embedded System", desc: "13th Gen Intel Core for real-time station supervision.", img: imgBase + "ACS413.png" },
          { model: "ARS200", name: "Ruggedized System", desc: "IP65 waterproof outdoor computer for trackside use.", img: imgBase + "ARS200.png" },
        ],
      },
      {
        name: "Expandable System",
        products: [
          { model: "AES100", name: "Advanced Expandable System", desc: "14th/13th Gen Intel Core i9 for central data concentrators.", img: imgBase + "AES100.png" },
          { model: "AMI242", name: "Compact Expandable Fanless", desc: "Fanless system for station device control.", img: imgBase + "AMI242.png" },
          { model: "AMS322", name: "Compact Expandable System", desc: "11th Gen Intel Core for medium-scale deployments.", img: imgBase + "AMS322.png" },
          { model: "CMB108", name: "Expandable Industrial PC", desc: "High-performance 65W TDP for heavy processing tasks.", img: imgBase + "CMB108.png" },
          { model: "AMS210", name: "Automatic Control System", desc: "9th/8th Gen Intel Core for automated fare gate operations.", img: imgBase + "AMS210.png" },
        ],
      },
      {
        name: "Compact System",
        products: [
          { model: "ASB100-PI800", name: "Palm-Sized System", desc: "Intel Atom x7433RE for space-limited kiosks.", img: imgBase + "ASB100-PI800.png" },
          { model: "CP100", name: "Palm-Sized System", desc: "AMD Ryzen Embedded R2000 for compact edge computing.", img: imgBase + "CP100.png" },
          { model: "CSB200-818", name: "Fanless System", desc: "Intel Atom E3940 for low-power station devices." },
          { model: "CMI300-1001", name: "Slim Mini-ITX System", desc: "Slim form factor with IBASE Mini-ITX motherboard." },
        ],
      },
    ],
  },
  {
    id: "panel",
    label: "Panel PC & Monitor",
    catUrl: "https://www.ibase.com.tw/en/product/category/Panel_PC___ePaper",
    groups: [
      {
        name: "Panel PC",
        products: [
          { model: "IXPC Series", name: "Modular Panel PC", desc: "Industrial modular panel PC for station operator workstations." },
          { model: "IPPC Series", name: "Compact Panel PC", desc: "Compact industrial panel PC for service desks." },
          { model: "IDOOH Series", name: "Sunlight Readable Panel PC", desc: "Outdoor panel PC for platform information kiosks." },
        ],
      },
      {
        name: "Touch Monitor & ODM",
        products: [
          { model: "IPPL Series", name: "Industrial Touch Monitor", desc: "Rugged touch monitor for passenger-facing displays." },
          { model: "Smart Retail PC", name: "ODM Panel PC", desc: "Smart retail panel PC for ticketing and info kiosks." },
          { model: "Stainless Steel PC", name: "ODM Panel PC", desc: "Stainless steel panel PC for sanitary environments." },
          { model: "Medical Panel PC", name: "ODM Panel PC", desc: "Medical-grade panel PC for clinical applications." },
        ],
      },
    ],
  },
  {
    id: "signage",
    label: "Signage & Network",
    catUrl: "https://www.ibase.com.tw/en/product/category/Digital_Signage_Player",
    groups: [
      {
        name: "Signage Player",
        products: [
          { model: "SI-212-N", name: "Entry Signage Player", desc: "Fanless 2x HDMI for PIDS on MRT platforms.", img: imgBase + "SI-212-N.png" },
          { model: "SI-121-N", name: "Entry Signage Player", desc: "Intel Core N-Series single HDMI for information displays.", img: imgBase + "SI-121-N.png" },
          { model: "SI-664-N", name: "Perf Signage Player", desc: "Intel Core Ultra 4x HDMI for multi-display PIS.", img: imgBase + "SI-664-N.png" },
          { model: "SI-663-N", name: "Perf Signage Player", desc: "13th/12th Gen Intel Core 3-output for medium signage." },
          { model: "SE-603-N", name: "Fanless Signage Player", desc: "11th Gen Intel Core reliable for passenger information.", img: imgBase + "SE-603-N.png" },
          { model: "SW-602-N", name: "Waterproof Signage Player", desc: "IP-rated outdoor for platform information displays.", img: imgBase + "SW-602-N.png" },
          { model: "ISR215", name: "ARM Signage Player", desc: "NXP i.MX 8M Plus energy-efficient for digital signage.", img: imgBase + "ISR215.png" },
          { model: "ISR500", name: "ARM Signage Player", desc: "MediaTek Genio 700 for high-performance ARM signage." },
        ],
      },
      {
        name: "Video Wall",
        products: [
          { model: "SP-63ER", name: "Video Wall Player", desc: "8th Gen Intel Core with 16x HDMI for large video walls." },
          { model: "SI-636", name: "Video Wall Player", desc: "13th/12th Gen Intel Core 6x HDMI for multi-display." },
          { model: "SI-624", name: "Video Wall Player", desc: "NVIDIA MXM 4x DP for high-resolution video walls." },
        ],
      },
      {
        name: "Network Appliance",
        products: [
          { model: "INA7605", name: "2U Network Appliance", desc: "Dual 5th Gen Xeon 64 GbE for central station networking.", img: imgBase + "INA7605.png" },
          { model: "INA7302", name: "1U Performance Appliance", desc: "AMD Ryzen 7000 14 GbE for station network aggregation.", img: imgBase + "INA7302.png" },
          { model: "INA3605", name: "1U Enterprise Appliance", desc: "Xeon E-2300 16 GbE for main station network core.", img: imgBase + "INA3605.png" },
          { model: "INA3608", name: "1U Security Server", desc: "14th/13th/12th Gen Intel Core 16GbE + 10G for security." },
          { model: "INA2205", name: "1U Entry Appliance", desc: "Intel Atom 8 GbE for compact station network edge.", img: imgBase + "INA2205.png" },
        ],
      },
    ],
  },
  {
    id: "transport",
    label: "Transportation",
    catUrl: "https://www.ibase.com.tw/en/product/category/Intelligent_Transportation",
    groups: [
      {
        name: "Railway System",
        products: [
          { model: "MPT-R Series", name: "Railway Computer", desc: "EN 50155 certified for onboard AFC and train-ground communication." },
          { model: "MPT-V Series", name: "In-Vehicle Computer", desc: "E-Mark certified for depot and maintenance yard operations." },
          { model: "MPT-3100V-AI", name: "AI Transport System", desc: "ITxPT & E-Mark edge AI for intelligent transport systems." },
        ],
      },
      {
        name: "Railway HMI",
        products: [
          { model: "MPPC Series", name: "Railway Panel PC", desc: "Railway touch panel for driver and operator cab interfaces." },
          { model: "BYTEM Series", name: "Railway Panel PC", desc: "Compact railway panel PC for onboard passenger info." },
          { model: "MRD Series", name: "Bar-Type PIS Display", desc: "Ultra-wide bar display for platform passenger information." },
        ],
      },
    ],
  },
  {
    id: "risc",
    label: "RISC Platform",
    catUrl: "https://www.ibase.com.tw/en/product/category/RISC_Platform",
    groups: [
      {
        name: "Module & Carrier",
        products: [
          { model: "SMARC Module", name: "NXP SMARC Module", desc: "ARM-based SMARC 2.1 module for low-power embedded systems." },
          { model: "SMARC Carrier 2.1", name: "SMARC Carrier Board", desc: "Carrier board for SMARC 2.1 module integration." },
        ],
      },
      {
        name: "RISC SBC",
        products: [
          { model: '3.5" RISC SBC', name: "ARM Single Board Computer", desc: "3.5\" ARM-based SBC for embedded control applications." },
          { model: '2.5" RISC SBC', name: "ARM Single Board Computer", desc: "2.5\" ARM-based SBC for compact edge deployments." },
          { model: "Ultra-Compact SBC", name: "ARM SBC", desc: "Ultra-compact ARM board for deeply embedded systems." },
        ],
      },
      {
        name: "ARM System",
        products: [
          { model: "Edge Computer", name: "RISC Edge System", desc: "ARM-based edge computer for IoT and device connectivity." },
          { model: "IPR Series", name: "ARM HMI", desc: "ARM-based industrial HMI for operator touch interfaces." },
        ],
      },
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
      text="Complete product catalog from iBASE Technology — embedded motherboards, edge AI systems, panel PCs, signage players, network appliances, railway computers, and RISC platforms deployed across the MRT network."
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

        {active.groups.map((group) => (
          <div key={group.name} className="product-group">
            <h3 className="product-subhead">{group.name}</h3>
            <div className="product-grid">
              {group.products.map((product) => (
                <article className="product-card reveal" key={product.model}>
                  <div className="product-card-fig">
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
                    <a
                      href={active.catUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-card-bar"
                    >
                      View on iBASE
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
                        <path d="M7 17 17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  </div>
                  <div className="product-card-body">
                    <h2>{product.name}</h2>
                    <p>{product.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
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
