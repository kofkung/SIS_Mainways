import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Shield,
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Train,
  CreditCard,
  Wrench,
  Cpu,
  TestTube2,
  ShieldCheck,
  Headphones,
  Package,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { useLang } from "./i18n";
import emvGate from "../assets/emv-gate.jpg";
import heroGate from "../assets/sis-home-field-service-hero.webp";
import job6 from "../assets/services/job6.jpg";
import job3 from "../assets/services/job3.jpg";
import job5 from "../assets/services/job5.jpg";
import job13 from "../assets/services/job13.jpg";

import customerMrta from "../assets/customers/mrta.webp";
import customerStateRailway from "../assets/customers/state-railway-thailand.webp";
import customerSrtet from "../assets/customers/srtet.webp";
import customerAsiaEraOne from "../assets/customers/asia-era-one.webp";
import customerWw from "../assets/customers/ww.webp";
import customerBem from "../assets/customers/bem.webp";
import customerVix from "../assets/customers/vix.webp";
import customerBts from "../assets/customers/bts.webp";
import customerRabbitLinePay from "../assets/customers/rabbit-line-pay.webp";
import customerTrueMoney from "../assets/customers/true-money.webp";

const customers = [
  { name: "MRTA", logo: customerMrta },
  { name: "State Railway of Thailand", logo: customerStateRailway },
  { name: "SRT Electrified Train Company", logo: customerSrtet },
  { name: "Asia Era One", logo: customerAsiaEraOne },
  { name: "W&W", logo: customerWw },
  { name: "Bangkok Expressway and Metro", logo: customerBem },
  { name: "VIX Technology", logo: customerVix },
  { name: "BTS", logo: customerBts },
  { name: "Rabbit LINE Pay", logo: customerRabbitLinePay },
  { name: "TrueMoney", logo: customerTrueMoney },
];

/* ── Expertise items with icons ── */
const expertiseItems = [
  { icon: Train, label: "Automatic Fare Collection (AFC) System" },
  { icon: CreditCard, label: "EMV Automatic Gate System" },
  { icon: Cpu, label: "Ticket Issuing Machine (TIM)" },
  { icon: Zap, label: "System Integration" },
  { icon: TestTube2, label: "Testing & Commissioning" },
  { icon: Wrench, label: "Preventive & Corrective Maintenance" },
  { icon: Headphones, label: "Technical Support & Engineering Services" },
  { icon: Package, label: "Spare Parts Supply & Equipment Procurement" },
];

function CustomerLogoCard({ customer, duplicate = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className="customer-logo-card"
      aria-hidden={duplicate || undefined}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <img
        src={customer.logo}
        alt={duplicate ? "" : `${customer.name} logo`}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </motion.figure>
  );
}

function CustomerLogoSection() {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="customers-section about-customers-wrapper"
      aria-labelledby="customers-title"
    >
      <div className="customers-heading" style={{ marginTop: "40px" }}>
        <div className="customers-heading-copy">
          <h2 id="customers-title">{t("customers.title")}</h2>
          <p style={{ marginTop: "4px", color: "var(--color-ink-soft)", fontSize: "0.95rem" }}>
            {t("customers.desc")}
          </p>
        </div>
      </div>

      {reduceMotion ? (
        <div className="customer-logo-grid">
          {customers.map((customer) => (
            <CustomerLogoCard key={customer.name} customer={customer} />
          ))}
        </div>
      ) : (
        <div className="customer-marquee" aria-label={t("customers.title")}>
          <div className="customer-marquee-track">
            {[0, 1].map((copyIndex) => (
              <div
                className="customer-logo-set"
                key={copyIndex}
                aria-hidden={copyIndex === 1 || undefined}
              >
                {customers.map((customer) => (
                  <CustomerLogoCard
                    key={`${copyIndex}-${customer.name}`}
                    customer={customer}
                    duplicate={copyIndex === 1}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    const numericPart = value.replace(/[^0-9.]/g, "");
    const suffix = value.replace(/[0-9.]/g, "");
    const target = parseFloat(numericPart);
    if (Number.isNaN(target)) { setCount(value); return; }
    
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target % 1 === 0
        ? Math.round(target * eased)
        : (target * eased).toFixed(1);
      setCount(`${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);
  
  return <span ref={ref}>{count}</span>;
}

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ── Main About Page ── */
export default function EnhancedAboutPage({ navigate }) {
  const { t } = useLang();

  return (
    <div className="about-enhanced">
      <div className="about-page-container">

        {/* ═══ BOX 1: ABOUT SIS ═══ */}
        <section className="about-section-box">
          <motion.div
            className="about-hero-split"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <div className="about-hero-split-inner">
              <motion.div className="about-hero-text-col" variants={fadeLeft}>
                <span className="about-kicker-pill">
                  {t("about.kicker")}
                </span>
                <h1 className="about-hero-headline">
                  {t("about.title")}
                </h1>
                <div className="about-hero-paragraphs">
                  <p>{t("about.descP1")}</p>
                  <p>{t("about.descP2")}</p>
                </div>
              </motion.div>

              <motion.div className="about-hero-image-col" variants={fadeRight}>
                <div className="about-hero-image-wrapper">
                  <img
                    src={emvGate}
                    alt="SIS EMV Gate System"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ BOX 2: OUR EXPERTISE ═══ */}
        <section className="about-section-box">
          <motion.div
            className="about-expertise-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div className="about-expertise-header" variants={fadeUp}>
              <span className="about-kicker-pill">
                {t("about.expertise.kicker")}
              </span>
              <h2 className="about-section-title">
                {t("about.expertise.title")}
              </h2>
              <p className="about-section-subtitle">
                {t("about.expertise.desc")}
              </p>
            </motion.div>

            <motion.div className="about-expertise-grid" variants={staggerFast}>
              {expertiseItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    className="about-expertise-item"
                    key={index}
                    variants={fadeUp}
                  >
                    <div className="about-expertise-icon-ring">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <span className="about-expertise-label">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BOX 3: PROJECT EXPERIENCE — Asymmetric Layout
            ═══════════════════════════════════════════════════════════════ */}
        <section className="about-section-box">
          <motion.div
            className="about-experience-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <div className="about-experience-inner">
              {/* Left: Image stack */}
              <motion.div className="about-experience-visual" variants={fadeLeft}>
                <div className="about-experience-img-main">
                  <img
                    src={job6}
                    alt="SIS Project execution - field engineering"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="about-experience-img-float">
                  <img
                    src={job3}
                    alt="SIS Station maintenance work"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.div>

              {/* Right: Text content */}
              <motion.div className="about-experience-text" variants={fadeRight}>
                <span className="about-kicker-pill">
                  {t("about.experience.kicker")}
                </span>
                <h2 className="about-section-title">
                  {t("about.experience.title")}
                </h2>
                <div className="about-experience-paragraphs">
                  <p>{t("about.experience.descP1")}</p>
                  <p>{t("about.experience.descP2")}</p>
                  <p>{t("about.experience.descP3")}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ OUR COMMITMENT — Liquid Glass ═══ */}
        <section className="about-section-box">
          <motion.div
            className="about-commitment-glass"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div className="about-commitment-content" variants={fadeUp}>
              <span className="about-kicker-pill">
                {t("commitment.title")}
              </span>
              <p className="about-commitment-desc">
                {t("commitment.desc")}
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ CUSTOMERS ═══ */}
        <CustomerLogoSection />

        {/* ═══ CTA ═══ */}
        <section className="about-cta-section">
          <motion.div
            className="about-cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp}>{t("about.cta.title")}</motion.h2>
            <motion.p variants={fadeUp}>{t("about.cta.desc")}</motion.p>
            <motion.button
              className="about-cta-button"
              variants={fadeUp}
              onClick={() => navigate("contact")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("about.cta.button")}
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
