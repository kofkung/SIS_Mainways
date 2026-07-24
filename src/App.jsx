import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, inView } from "motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang, LangToggle } from "./i18n";
import SeoManager from "./SeoManager.jsx";
import { buildRoutePath, isPlainLeftClick, parseLocation, ROUTES, safeDecode } from "./routing.js";
import EnhancedAboutPage from "./AboutPage.jsx";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Wrench, Monitor, DoorOpen, Headphones, ArrowUpRight, Sparkles, Zap, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import logo from "../assets/sis-logo-transparent.png";
import heroGate from "../assets/sis-home-field-service-hero.webp";
import heroMrt from "../assets/sis-mrt-fare-gates-hero.jpg";
import heroBidi from "../assets/sis-bidirectional-gate-focus.jpg";
import focusGate from "../assets/sis-bidirectional-gate-focus.jpg";
import emvGate from "../assets/emv-gate.jpg";
import job7 from "../assets/services/job7.jpg";
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

const TURNSTILE_SITE_KEY = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
const CONTACT_ACCESS_KEY = String(import.meta.env.VITE_CONTACT_ACCESS_KEY || "").trim();
const CONTACT_RETURN_PARAM = "contact-sent";
const CONTACT_PENDING_KEY = "sis-contact-pending";
let turnstileScriptPromise;

function isFormSubmitEndpoint(endpoint) {
  try {
    const url = new URL(endpoint, window.location.origin);
    return url.hostname === "formsubmit.co" && url.pathname.startsWith("/ajax/");
  } catch {
    return false;
  }
}

function isWeb3FormsEndpoint(endpoint) {
  try {
    const url = new URL(endpoint, window.location.origin);
    return url.hostname === "api.web3forms.com" && url.pathname.startsWith("/submit");
  } catch {
    return false;
  }
}

function createContactReference() {
  const now = new Date();
  const dateParts = Object.fromEntries(
    new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now).map(({ type, value }) => [type, value]),
  );
  const randomPart = window.crypto?.randomUUID
    ? window.crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()
    : Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, "0");
  return `SIS-${dateParts.year}${dateParts.month}${dateParts.day}-${randomPart}`;
}

function formatBangkokTimestamp() {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "long",
    timeStyle: "medium",
    hour12: false,
  }).format(new Date());
}

function submitThroughFormSubmit(endpoint, payload) {
  const submitUrl = new URL(endpoint);
  submitUrl.pathname = submitUrl.pathname.replace(/^\/ajax\//, "/");

  const returnUrl = new URL("/contact", window.location.origin);
  returnUrl.searchParams.set(CONTACT_RETURN_PARAM, "1");

  const nativeForm = document.createElement("form");
  nativeForm.method = "POST";
  nativeForm.action = submitUrl.toString();
  nativeForm.hidden = true;

  Object.entries({
    ...payload,
    _next: returnUrl.toString(),
    _url: `${window.location.origin}/contact`,
  }).forEach(([name, value]) => {
    if (value === undefined || value === null) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    nativeForm.appendChild(input);
  });

  document.body.appendChild(nativeForm);
  nativeForm.submit();
}

function loadTurnstile() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Security verification is only available in the browser."));
  }
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const scriptId = "sis-turnstile-script";
    let script = document.getElementById(scriptId);
    const handleLoad = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        turnstileScriptPromise = undefined;
        reject(new Error("Security verification did not initialize."));
      }
    };
    const handleError = () => {
      turnstileScriptPromise = undefined;
      reject(new Error("Security verification could not be loaded."));
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    if (!script.isConnected) {
      document.head.appendChild(script);
    }
  });

  return turnstileScriptPromise;
}

const navItems = [
  { id: "home", label: "Home", labelKey: "nav.home" },
  { id: "about", label: "About", labelKey: "nav.about" },
  { id: "services", label: "Services", labelKey: "nav.services" },
  { id: "projects", label: "Projects", labelKey: "nav.projects" },
  { id: "products", label: "Products", labelKey: "nav.products" },
  { id: "contact", label: "Contact", labelKey: "nav.contact" },
];

const services = [
  {
    icon: "gate",
    title: "Bi-directions Automatic Gates",
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

const projectGalleryFrames = [
  [
    { labelKey: "projects.gallery.overview", noteKey: "projects.gallery.overviewDesc", position: "50% 50%", fit: "contain", scale: 1 },
    { labelKey: "projects.gallery.field", noteKey: "projects.gallery.fieldDesc", position: "0% 8%", fit: "cover", scale: 1.18 },
    { labelKey: "projects.gallery.detail", noteKey: "projects.gallery.detailDesc", position: "100% 10%", fit: "cover", scale: 1.34 },
  ],
  [
    { labelKey: "projects.gallery.overview", noteKey: "projects.gallery.overviewDesc", position: "50% 50%", fit: "contain", scale: 1 },
    { labelKey: "projects.gallery.field", noteKey: "projects.gallery.fieldDesc", position: "0% 20%", fit: "cover", scale: 1.2 },
    { labelKey: "projects.gallery.detail", noteKey: "projects.gallery.detailDesc", position: "100% 72%", fit: "cover", scale: 1.38 },
  ],
  [
    { labelKey: "projects.gallery.overview", noteKey: "projects.gallery.overviewDesc", position: "50% 50%", fit: "contain", scale: 1 },
    { labelKey: "projects.gallery.field", noteKey: "projects.gallery.fieldDesc", position: "0% 52%", fit: "cover", scale: 1.18 },
    { labelKey: "projects.gallery.detail", noteKey: "projects.gallery.detailDesc", position: "100% 50%", fit: "cover", scale: 1.3 },
  ],
  [
    { labelKey: "projects.gallery.overview", noteKey: "projects.gallery.overviewDesc", position: "50% 50%", fit: "contain", scale: 1 },
    { labelKey: "projects.gallery.field", noteKey: "projects.gallery.fieldDesc", position: "50% 0%", fit: "cover", scale: 1.12 },
    { labelKey: "projects.gallery.detail", noteKey: "projects.gallery.detailDesc", position: "50% 100%", fit: "cover", scale: 1.18 },
  ],
  [
    { labelKey: "projects.gallery.overview", noteKey: "projects.gallery.overviewDesc", position: "50% 50%", fit: "contain", scale: 1 },
    { labelKey: "projects.gallery.field", noteKey: "projects.gallery.fieldDesc", position: "50% 0%", fit: "cover", scale: 1.18 },
    { labelKey: "projects.gallery.detail", noteKey: "projects.gallery.detailDesc", position: "0% 100%", fit: "cover", scale: 1.34 },
  ],
];

const filterTabs = ["All Projects", "Fare Gate", "Station Device", "Integration", "AFC System"];
const processSteps = ["Planning", "Engineering", "Implementation", "Handover"];

const groupTaglines = {
  Motherboard: "Mini-ITX \u00b7 ATX \u00b7 PICO-ITX",
  "Single Board Computer": "3.5\u2033 \u00b7 2.5\u2033 \u00b7 ARM",
  "CPU Module": "COM Express \u00b7 Qseven \u00b7 ETX",
  "CPU Card & Accessories": "Full-size \u00b7 Carrier boards",
  "AI Computing": "Jetson Orin \u00b7 EPYC",
  "Edge & IoT": "Gateways \u00b7 Ruggedized",
  "Embedded System": "Expandable \u00b7 Fanless",
  "Compact & Mini System": "Palm-sized \u00b7 PICO-ITX",
  "Panel PC": "Modular \u00b7 Compact \u00b7 Outdoor",
  "Touch & ODM": "Touch monitors \u00b7 Custom",
  "Signage Player": "Entry \u00b7 Performance \u00b7 Outdoor",
  "Video Wall": "Multi-display controllers",
  "Network Appliance": "1U \u00b7 2U Rackmount",
  "Railway System": "EN 50155 \u00b7 E-Mark",
  "Railway HMI": "Cab panels \u00b7 PIS displays",
  "Module & Carrier": "SMARC 2.1",
  "RISC SBC": "3.5\u2033 \u00b7 2.5\u2033 \u00b7 Ultra-compact",
  "ARM System": "Edge \u00b7 HMI",
  "BNA Controller": "Main station controller for AFC & PSD",
};

const categoryBlurbs = {
  embedded: "Industrial motherboards, SBCs, and CPU modules for 24/7 station operation.",
  ai: "NVIDIA Jetson and AMD edge platforms for real-time AI inference at stations.",
  panel: "Operator HMI panels, touch monitors, and sunlight-readable displays.",
  signage: "Digital signage players, video-wall controllers, and network appliances.",
  transport: "EN 50155 railway computers and E-Mark in-vehicle AFC systems.",
  risc: "ARM SMARC modules, RISC single-board computers, and edge systems.",
  bna: "BNA station controllers, modules, and accessories for AFC and PSD systems.",
};

const img = (file) => `/products/${file}`;
const url = (path) => `https://www.ibase.com.tw/${path}`;

const productCategories = [
  {
    id: "embedded",
    label: "Embedded Computing",
    groups: [
      {
        name: "Motherboard",
        products: [
          { model: "MI1005", name: "Mini-ITX Motherboard", desc: "Intel Core Ultra 200H/200U for AFC controllers.", img: img("small_MI1005.png"), url: url("en/product/category/Embedded_Computing/Motherboard/Mini-ITX_Motherboard/MI1005"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Motherboards/MI1005_Datasheet.pdf" },
          { model: "MBB1005", name: "ATX Motherboard", desc: "Intel Core Ultra 200S for central AFC servers.", img: img("small_MBB1005.png"), url: url("en/product/category/Embedded_Computing/Motherboard/ATX_Motherboard/MBB1005"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Motherboards/MBB1005_Datasheet.pdf" },
          { model: "MB998", name: "Micro ATX Motherboard", desc: "Intel Core 200E/200PE for control systems.", img: img("small_MB998.png"), url: url("en/product/category/Embedded_Computing/Motherboard/Micro_ATX_Motherboard/MB998"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Motherboards/MB998_Datasheet.pdf" },
          { model: "PI800", name: "PICO-ITX Motherboard", desc: "Intel Atom x7000RE ultra-compact for fare gates.", img: img("small_PI800.png"), url: url("en/product/category/Embedded_Computing/Motherboard/PICO_ITX_Motherboard/PI800"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Motherboards/PI800_Datasheet.pdf" },
        ],
      },
      {
        name: "Single Board Computer",
        products: [
          { model: "IB962", name: '3.5" SBC', desc: "Intel Core Ultra 7/5 for trackside environments.", img: img("small_IB962_.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB962"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Disk-Size_SBCs/IB962_Datasheet.pdf" },
          { model: "IB96W", name: '3.5" SBC Wide-Temp', desc: "13th Gen Core wide-temperature for extreme conditions.", img: img("small_IB96W.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB96W"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Disk-Size_SBCs/IB96W_Datasheet.pdf" },
          { model: "IB200", name: '2.5" SBC', desc: "AMD Ryzen Embedded R2000 for compact systems.", img: img("small_IB200.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_2_5_Single_Board_Computer/IB200"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/Disk-Size_SBCs/IB200_Datasheet.pdf" },
          { model: "IBR117", name: '3.5" ARM SBC', desc: "NXP Cortex-A9 i.MX 6 for low-power edge processing.", img: img("IBR117_255X170px.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_3_5_Single_Board_Computer/IBR117"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IBR117_Datasheet.pdf" },
          { model: "IBR215", name: '2.5" ARM SBC', desc: "NXP Cortex-A53 i.MX 8M Plus for AI edge inference.", img: img("small_IBR215.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_2_5_Single_Board_Computer/IBR215"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IBR215_Datasheet.pdf" },
        ],
      },
      {
        name: "CPU Module",
        products: [
          { model: "ET981", name: "COM Express Type 6", desc: "13th Gen Intel Core P-Series for modular designs.", img: img("small_ET981.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET981"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/ET981_Datasheet.pdf" },
          { model: "ET980", name: "COM Express Type 6", desc: "12th Gen Intel Core P-series for scalable performance.", img: img("small_ET980.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET980"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/ET980_Datasheet.pdf" },
          { model: "IBQ800", name: "Qseven Module", desc: "Intel Atom x7/x5 for compact embedded upgrades.", img: img("small_IBQ800.jpg"), url: url("en/product/category/Embedded_Computing/CPU_Module/QSeven/IBQ800"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/IBQ800_Datasheet.pdf" },
          { model: "ET839", name: "ETX Module", desc: "Intel Atom E3845 for legacy industrial systems.", img: img("small_ET839.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/ETX/ET839"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/ET839_Datasheet.pdf" },
        ],
      },
      {
        name: "CPU Card & Accessories",
        products: [
          { model: "IB996", name: "Full-Size CPU Card", desc: "14th/13th/12th Gen Core for central processing.", img: img("small_IB996.png"), url: url("en/product/category/Embedded_Computing/CPU_Card/Full-Size_CPU_Card/IB996"), pdfUrl: "https://www.ibase.com.tw//english/download/Embedded_Computing/CPU_Cards/IB996_Datasheet.pdf" },
          { model: "IP419", name: "COM Express Carrier", desc: "Type 6 carrier board for custom solutions.", img: img("small_IP419.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/COM_Express_Type_6/IP419"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/IP419_Datasheet.pdf" },
          { model: "IP416", name: "Qseven Carrier", desc: "Carrier board for Qseven module integration.", img: img("small_IP416.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/Qseven/IP416"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/IP416_Datasheet.pdf" },
          { model: "IP412", name: "ETX Carrier", desc: "ETX carrier board for embedded upgrades.", img: img("small_IP412.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/ETX_Carrier_Board/IP412"), pdfUrl: "https://www.ibase.com.tw/english/download/Embedded_Computing/CPU Modules/IP412_Datasheet.pdf" },
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "Edge AI & System",
    groups: [
      {
        name: "AI Computing",
        products: [
          { model: "EC3020", name: "Edge AI Computer", desc: "NVIDIA Jetson Orin NX/Nano for passenger counting.", img: img("small_EC3020.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3020"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/EC3020_Datasheet.pdf" },
          { model: "EC3000", name: "Edge AI Computer", desc: "Jetson Orin for real-time station security AI.", img: img("small_EC3000.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3000"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/EC3000_Datasheet.pdf" },
          { model: "EC3100", name: "Edge AI Computer", desc: "Jetson Orin with extended I/O for transport AI.", img: img("small_EC3100(1).png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3100"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/EC3100_Datasheet.pdf" },
          { model: "ES1002", name: "Edge AI Server", desc: "AMD EPYC 8004 for high-throughput AI inferencing.", img: img("small_ES1002.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Server/ES1002"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/ES1002_Datasheet.pdf" },
          { model: "MI1005", name: "AI Edge Board", desc: "Intel Core Ultra as AI edge inference board.", img: img("small_MI1005.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/AI_Edge_Board/MI1005"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/MI1005_Datasheet.pdf" },
        ],
      },
      {
        name: "Edge & IoT",
        products: [
          { model: "AGS104T", name: "IoT Edge Gateway", desc: "Ultra-compact Intel Atom for AFC device aggregation.", img: img("small_AGS104T.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104T"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AGS104T_Datasheet.pdf" },
          { model: "AGS104L", name: "IoT Edge Gateway", desc: "Low-power variant for remote station monitoring.", img: img("small_AGS104L_.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104L"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AGS104L_Datasheet.pdf" },
          { model: "ACS413", name: "Compact Embedded", desc: "13th Gen Core for real-time station supervision.", img: img("small_ACS413.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ACS_Series_Advanced_Compact_Embedded_System/ACS413"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/ACS413_Datasheet.pdf" },
          { model: "ARS200", name: "Ruggedized System", desc: "IP65 waterproof for trackside environments.", img: img("small_ARS200.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ARS_Series_Advanced_Ruggedized_System/ARS200"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/ARS200_Datasheet.pdf" },
        ],
      },
      {
        name: "Embedded System",
        products: [
          { model: "AES100", name: "Expandable System", desc: "14th/13th Gen Core i9 for central concentrators.", img: img("small_AES100.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AES_Series_Advanced_Expandable_System/AES100"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AES100_Datasheet.pdf" },
          { model: "AMI242", name: "Expandable Fanless", desc: "Compact fanless for station device control.", img: img("small_AMI242.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMI_Series_Expandable_Fanless_System/AMI242"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AMI242_Datasheet.pdf" },
          { model: "AMS322", name: "Compact Expandable", desc: "11th Gen Core for medium-scale deployments.", img: img("small_AMS322.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMS_Series_Compact_Expandable_Fanless_System/AMS322"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AMS322_Datasheet.pdf" },
          { model: "CMB108", name: "Expandable Industrial PC", desc: "65W TDP for heavy processing tasks.", img: img("small_CMB108.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/CMB_Series_Expandable_System/CMB108"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/CMB108_Datasheet.pdf" },
          { model: "AMS210", name: "Auto Control System", desc: "9th/8th Gen Core for automated fare gates.", img: img("small_AMS210.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Automatic_Control_System/Automatic_Control_System/AMS210"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/AMS210_Datasheet.pdf" },
        ],
      },
      {
        name: "Compact & Mini System",
        products: [
          { model: "ASB100-PI800", name: "Palm-Sized System", desc: "Intel Atom x7433RE for space-limited kiosks.", img: img("small_ASB100-PI800.png"), url: url("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/ASB_Series/ASB100-PI800"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/ASB100-PI800_Datasheet.pdf" },
          { model: "CP100", name: "Palm-Sized System", desc: "AMD Ryzen R2000 for compact edge computing.", img: img("small_CP100.png"), url: url("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/CP_Series_Edge_Computer_with_IBASE_2_5_PICO_ITX_Board/CP100"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/CP100_Datasheet.pdf" },
          { model: "ASB210-962H", name: "Compact System", desc: "Intel Core Ultra 100H for station computing.", img: img("small_ASB210-962H.png"), url: url("en/product/category/Edge_AI_Intelligent_System/SBC_System/ASB_Series_Fanless_System_with_IBASE_3_5_SBC/ASB210-962H"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/ASB210-962H_Datasheet.pdf" },
          { model: "CSB200-818", name: "Fanless System", desc: "Intel Atom E3940 for low-power station devices.", img: img("small_CSB200-818.jpg"), url: url("en/product/category/Edge_AI_Intelligent_System/SBC_System/CSB_Series_Slim_System_with_IBASE_3_5_SBC/CSB200-818"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/CSB200-818_Datasheet.pdf" },
          { model: "CMI300-1001", name: "Slim Mini-ITX System", desc: "Slim system with IBASE Mini-ITX motherboard.", img: img("small_CMI300-1001.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Mini_ITX_System/CMI_Series_System_with_IBASE_Mini_ITX/CMI300-1001"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Systems/CMI300-1001_Datasheet.pdf" },
        ],
      },
    ],
  },
  {
    id: "panel",
    label: "Panel PC & Monitor",
    groups: [
      {
        name: "Panel PC",
        products: [
          { model: "IXPC Series", name: "Modular Panel PC", desc: "Industrial modular panel for operator workstations.", img: img("small_product_IXPC_Series.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Modular_Panel_PC/IXPC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/IXPC-W156-200_Datasheet.pdf" },
          { model: "IPPC Series", name: "Compact Panel PC", desc: "Compact panel PC for station service desks.", img: img("small_IPPC-W07.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Panel_PC/IPPC_Series_Compact_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/IPPC-121_Datasheet.pdf" },
          { model: "IDOOH Series", name: "Sunlight Readable", desc: "Outdoor panel PC for platform info kiosks.", url: url("en/product/category/Panel_PC_Touch_Monitor/Outdoor_Panel_PC/IDOOH_Series_Sunlight_Readable_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/IDOOH-215-PC_Datasheet.pdf" },
        ],
      },
      {
        name: "Touch & ODM",
        products: [
          { model: "IPPL Series", name: "Touch Monitor", desc: "Rugged touch monitor for passenger-facing displays.", img: img("small_IPPL-W270.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Touch_Monitor/IPPL_Series"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/IPPL-W156_Datasheet.pdf" },
          { model: "Smart Retail PC", name: "ODM Panel PC", desc: "Smart retail panel for ticketing kiosks.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Smart_Retail_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/OFP-W2700-PCI86_OFP-W2700-PCI50_OFP-W2700-PCV16_Datasheet.pdf" },
          { model: "Compact Panel PC", name: "ODM Panel PC", desc: "Compact ODM panel for embedded integration.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Compact_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/BYTEM-W071-PC_BYTEM-W072-PC_BYTEM-101-PC_BYTEM-121-PC_Datasheet.pdf" },
          { model: "Stainless Steel PC", name: "ODM Panel PC", desc: "Stainless steel for sanitary environments.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Stainless_Steel_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/INOSP-152-RE_INOSP-192-RE_Datasheet.pdf" },
          { model: "Medical Panel PC", name: "ODM Panel PC", desc: "Medical-grade panel for clinical applications.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Medical_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Industrial_Panel_PC_Catalog/UMT-7212_Datasheet.pdf" },
        ],
      },
    ],
  },
  {
    id: "signage",
    label: "Signage & Network",
    groups: [
      {
        name: "Signage Player",
        products: [
          { model: "SI-212-N", name: "Entry Signage Player", desc: "Fanless 2x HDMI for PIDS on MRT platforms.", img: img("small_SI-212-N.png"), url: url("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/2_Display_Outputs_Signage_Player/SI-212-N"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-212-N_Datasheet.pdf" },
          { model: "SI-121-N", name: "Entry Signage Player", desc: "Intel Core N-Series single HDMI for displays.", img: img("small_SI-121-N.png"), url: url("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/1_Display_Outputs/SI-121-N"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-121-N_Datasheet.pdf" },
          { model: "SI-664-N", name: "Perf Signage Player", desc: "Intel Core Ultra 4x HDMI for multi-display PIS.", img: img("small_SI-664-N.png"), url: url("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/4_Display_Outputs/SI_664_N"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-664-N_Datasheet.pdf" },
          { model: "SI-663-N", name: "Perf Signage Player", desc: "13th/12th Gen Core 3-output for medium signage.", img: img("small_SI-663-N.png"), url: url("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/3_Display_Outputs/SI-663-N"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-663-N_Datasheet.pdf" },
          { model: "SE-603-N", name: "Fanless Signage Player", desc: "11th Gen Core for passenger information.", img: img("small_SE-603-N.png"), url: url("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Outdoor_Signage_Player/SE-603-N") },
          { model: "SW-602-N", name: "Waterproof Signage", desc: "IP-rated outdoor for platform displays.", img: img("small_SW-602-N.png"), url: url("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Waterproof_Signage_Player/SW-602-N"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SW-602-N_Datasheet.pdf" },
          { model: "ISR215", name: "ARM Signage", desc: "NXP i.MX 8M Plus energy-efficient signage.", img: img("small_ISR215.png"), url: url("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/NXP_i_MX8M_based_Signage_Player/ISR215"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/ISR215_Datasheet.pdf" },
          { model: "ISR500", name: "ARM Signage", desc: "MediaTek Genio 700 for high-performance ARM signage.", img: img("small_ISR500.png"), url: url("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/MediaTek_Genio-based_Signage_Player/ISR500"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/ISR500_Datasheet.pdf" },
        ],
      },
      {
        name: "Video Wall",
        products: [
          { model: "SP-63ER", name: "Video Wall Player", desc: "8th Gen Core 16x HDMI for large video walls.", img: img("small_SP-63E_ER.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/16_Display_Outputs/SP-63ER"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SP-63ER_Datasheet.pdf" },
          { model: "SI-636", name: "Video Wall Player", desc: "13th/12th Gen Core 6x HDMI for multi-display.", img: img("small_SI-636.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/6_Display_Outputs/SI-636"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-636_Datasheet.pdf" },
          { model: "SI-624", name: "Video Wall Player", desc: "NVIDIA MXM 4x DP for high-res walls.", img: img("small_SI-624.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/4_Display_Outputs/SI-624"), pdfUrl: "https://www.ibase.com.tw/english/download/Digital_Signage_Catalog/SI-624_Datasheet.pdf" },
        ],
      },
      {
        name: "Network Appliance",
        products: [
          { model: "INA7605", name: "2U Network Appliance", desc: "Dual Xeon 64 GbE for central networking.", img: img("small_INA7605_Preliminary.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_2U_Network_Appliance/INA7605"), pdfUrl: "https://www.ibase.com.tw/english/download/Network_Appliances_Catalog/INA7605_Datasheet.pdf" },
          { model: "INA7302", name: "1U Perf Appliance", desc: "AMD Ryzen 14 GbE for station aggregation.", img: img("small_INA7302.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_1U_Network_Appliance/INA7302"), pdfUrl: "https://www.ibase.com.tw/english/download/Network_Appliances_Catalog/INA7302_Datasheet.pdf" },
          { model: "INA3605", name: "1U Enterprise", desc: "Xeon E-2300 16 GbE for network core.", img: img("small_INA3605_EOL.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Enterprise_1U_Network_Appliance/INA3605"), pdfUrl: "https://www.ibase.com.tw/english/download/Network_Appliances_Catalog/INA3605_Datasheet.pdf" },
          { model: "INA3608", name: "1U Security Server", desc: "14th/13th/12th Core 16GbE+10G for security.", img: img("small_INA3606.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Mainstream_1U_Network_Appliance/INA3608"), pdfUrl: "https://www.ibase.com.tw/english/download/Network_Appliances_Catalog/INA3608_Datasheet.pdf" },
          { model: "INA2205", name: "1U Entry", desc: "Intel Atom 8 GbE for compact edge.", img: img("small_INA2205_Preliminary.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Entry_1U_Network_Appliance/INA2205"), pdfUrl: "https://www.ibase.com.tw/english/download/Network_Appliances_Catalog/INA2205_Datasheet.pdf" },
        ],
      },
    ],
  },
  {
    id: "transport",
    label: "Transportation",
    groups: [
      {
        name: "Railway System",
        products: [
          { model: "MPT-R Series", name: "Railway Computer", desc: "EN 50155 certified for onboard AFC communication.", url: url("en/product/category/Intelligent_Transportation/Railway_Computer_System/MPT_R_Series_EN50155_Certified_Railway_Computer"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Transportation_Solutions_Catalog/MPT-7100R_Datasheet.pdf" },
          { model: "MPT-V Series", name: "In-Vehicle Computer", desc: "E-Mark certified for depot operations.", url: url("en/product/category/Intelligent_Transportation/In_Vehicle_Computer_System/MPT_V_Series_E_mark_Certified_In_Vehicle_Computer"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Transportation_Solutions_Catalog/MPT-7100V_Datasheet.pdf" },
          { model: "MPT-3100V-AI", name: "AI Transport System", desc: "ITxPT edge AI for intelligent transport.", img: img("small_MPT-3100V.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Transportation_System/MPT-3100V-AI"), pdfUrl: "https://www.ibase.com.tw/english/download/AI_Computing_Platform/MPT-3100V-AI_Datasheet.pdf" },
        ],
      },
      {
        name: "Railway HMI",
        products: [
          { model: "MPPC Series", name: "Railway Panel PC", desc: "Railway touch panel for cab interfaces.", url: url("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/MPPC_Series_EN50155_Transportation_Panel_PC"), pdfUrl: "https://www.ibase.com.tw/english/download/Intelligent_Transportation_Solutions_Catalog/MPPC1501PC_Datasheet.pdf" },
          { model: "BYTEM Series", name: "Railway Panel PC", desc: "Compact railway panel for onboard info.", url: url("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/BYTEM_Series_Railway_Panel_PC") },
          { model: "MRD Series", name: "Bar-Type PIS Display", desc: "Ultra-wide bar display for platform PIS.", url: url("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/MRD_Series_Bar_Type_PIS_Panel_PC") },
        ],
      },
    ],
  },
  {
    id: "risc",
    label: "RISC Platform",
    groups: [
      {
        name: "Module & Carrier",
        products: [
          { model: "SMARC Module", name: "NXP SMARC Module", desc: "ARM SMARC 2.1 module for low-power systems.", img: img("small_RM-N95.png"), url: url("en/product/category/RISC_Platform/SMARC_Module/NXP_i_MX8M_based_SMARC_Module"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/RM-N95_Datasheet.pdf" },
          { model: "SMARC Carrier 2.1", name: "SMARC Carrier", desc: "Carrier board for SMARC 2.1 module.", img: img("small_product_RP_103_1_0.png"), url: url("en/product/category/RISC_Platform/Carrier_Board_for_SMARC_Module/SMARC_2_1_Carrier_Board"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/RP-103-SMC_Datasheet.pdf" },
        ],
      },
      {
        name: "RISC SBC",
        products: [
          { model: '3.5" RISC SBC', name: "ARM SBC", desc: '3.5" ARM SBC for embedded control.', img: img("small_IBR500.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/3_5_Disk_Size_SBC"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IBR500_Datasheet.pdf" },
          { model: '2.5" RISC SBC', name: "ARM SBC", desc: '2.5" ARM SBC for compact deployments.', img: img("small_IBR300.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/2_5_Disk_Size_SBC"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IBR300_Datasheet.pdf" },
          { model: "Ultra-Compact SBC", name: "ARM SBC", desc: "Ultra-compact ARM for deeply embedded systems.", img: img("small_IBR-SMB.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/Ultra_Compact_Single_Board_Computer"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IBR-SMB_Datasheet.pdf" },
        ],
      },
      {
        name: "ARM System",
        products: [
          { model: "Edge Computer", name: "RISC Edge System", desc: "ARM edge computer for IoT connectivity.", img: img("small_ISR500.png"), url: url("en/product/category/RISC_Platform/RISC_based_Edge_Computing_System/Edge_Computer"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/ISR500_Datasheet.pdf" },
          { model: "IPR Series", name: "ARM HMI", desc: "ARM-based HMI for operator interfaces.", img: img("small_IPR-P04F-N.jpg"), url: url("en/product/category/RISC_Platform/ARM_based_HMI/IPR_Series_Industrial_HMI"), pdfUrl: "https://www.ibase.com.tw/english/download/RISC-Based_Embedded_Solutions_Catalog/IPR-P04_Datasheet.pdf" },
        ],
      },
    ],
  },
  {
    id: "bna",
    label: "BNA Parts",
    groups: [
      {
        name: "Flat Belts",
        tagline: "B116 series",
        products: [
          { model: "B11600000 Flat belt SMV1-754 x 8 x 0.65", name: "Flat belt SMV1-754", desc: "BNA flat belt for gate mechanism - 754mm length.", img: img("bna_11_B11600000_Flat_belt_SMV1-754_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600001 Flat belt SMV1-552 x 8 x 0.65", name: "Flat belt SMV1-552", desc: "BNA flat belt for gate mechanism - 552mm length.", img: img("bna_12_B11600001_Flat_belt_SMV1-552_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600002 Flat belt SMV1-93 x 8 x 0.65", name: "Flat belt SMV1-93", desc: "BNA flat belt for gate mechanism - 93mm length.", img: img("bna_13_B11600002_Flat_belt_SMV1-93_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600003 Flat belt SMV 1-493 x 8 x 0.65", name: "Flat belt SMV1-493", desc: "BNA flat belt for gate mechanism - 493mm length.", img: img("bna_14_B11600003_Flat_belt_SMV_1-493_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600004 Flat belt SMV 1-97 x 8 x 0.65", name: "Flat belt SMV1-97", desc: "BNA flat belt for gate mechanism - 97mm length.", img: img("bna_15_B11600004_Flat_belt_SMV_1-97_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600005 Flat belt F50-SBU-681 x 8 x0.8", name: "Flat belt F50-SBU-681", desc: "BNA flat belt for F50-SBU unit - 681mm length.", img: img("bna_16_B11600005_Flat_belt_F50-SBU-681_x_8_x0_8.jpg"), url: "#" },
          { model: "B11600006 Rubber ring MBN2*125", name: "Rubber ring MBN2", desc: "BNA rubber ring MBN2 size 125mm.", img: img("bna_17_B11600006_Rubber_ring_MBN2_125.jpg"), url: "#" },
          { model: "B11600010 Flat belt SMV1-128 x 8 x 0.65", name: "Flat belt SMV1-128", desc: "BNA flat belt for gate mechanism - 128mm length.", img: img("bna_18_B11600010_Flat_belt_SMV1-128_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600011 Flat belt SMV1-192 x 8 x 0.65", name: "Flat belt SMV1-192", desc: "BNA flat belt for gate mechanism - 192mm length.", img: img("bna_19_B11600011_Flat_belt_SMV1-192_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600012 Flat belt SMV1-199 x 8 x 0.65", name: "Flat belt SMV1-199", desc: "BNA flat belt for gate mechanism - 199mm length.", img: img("bna_72_B11600012_Flat_belt_SMV1-199_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600013 Flat belt SMV1-318 x 8 x 0.65", name: "Flat belt SMV1-318", desc: "BNA flat belt for gate mechanism - 318mm length.", img: img("bna_20_B11600013_Flat_belt_SMV1-318_x_8_x_0_65.jpg"), url: "#" },
          { model: "B11600014 Alignment rubber ring", name: "Alignment rubber ring", desc: "BNA alignment rubber ring for gate assembly.", img: img("bna_21_B11600014_Alignment_rubber_ring.jpg"), url: "#" },
          { model: "B11610000 Rubber mat (Cup head)", name: "Rubber mat cup head", desc: "BNA rubber mat with cup head fitting.", img: img("bna_22_B11610000_Rubber_mat__Cup_head_.jpg"), url: "#" },
        ],
      },
      {
        name: "Bearings & Belts",
        tagline: "Timing belts & ball bearings",
        products: [
          { model: "B11010533 Rubber wheel for NV front driving", name: "Rubber wheel NV front", desc: "BNA rubber wheel for NV unit front driving.", img: img("bna_23_B11010533_Rubber_wheel_for_NV_front_driv.jpg"), url: "#" },
          { model: "B11010534 Rubber wheel for NV rear driving", name: "Rubber wheel NV rear", desc: "BNA rubber wheel for NV unit rear driving.", img: img("bna_25_B11010534_Rubber_wheel_for_NV_rear_drivi.jpg"), url: "#" },
          { model: "Bearing 8-16-5F", name: "Bearing 8-16-5F", desc: "BNA ball bearing size 8x16x5mm flanged.", img: img("bna_26_Bearing_8-16-5F.jpg"), url: "#" },
          { model: "Bearing 6-10-3", name: "Bearing 6-10-3", desc: "BNA ball bearing size 6x10x3mm.", img: img("bna_27_Bearing_6-10-3.jpg"), url: "#" },
          { model: "Bearing 8-14-04", name: "Bearing 8-14-04", desc: "BNA ball bearing size 8x14x4mm.", img: img("bna_28_Bearing_8-14-04.jpg"), url: "#" },
          { model: "Bearing 3-6-2.5", name: "Bearing 3-6-2.5", desc: "BNA ball bearing size 3x6x2.5mm.", img: img("bna_29_Bearing_3-6-2_5.jpg"), url: "#" },
          { model: "Bearing 5-13-4F", name: "Bearing 5-13-4F", desc: "BNA ball bearing size 5x13x4mm flanged.", img: img("bna_30_Bearing_5-13-4F.jpg"), url: "#" },
          { model: "Bearing 5-8-2.5", name: "Bearing 5-8-2.5", desc: "BNA ball bearing size 5x8x2.5mm.", img: img("bna_31_Bearing_5-8-2_5.jpg"), url: "#" },
          { model: "Bearing 5-10-4F", name: "Bearing 5-10-4F", desc: "BNA ball bearing size 5x10x4mm flanged.", img: img("bna_32_Bearing_5-10-4F.jpg"), url: "#" },
          { model: "Bearing RoHS 717010023 CRF6-13ZZ B=5", name: "Bearing CRF6-13ZZ", desc: "BNA RoHS compliant bearing CRF6-13ZZ.", img: img("bna_33_Bearing_RoHS_717010023_CRF6-13ZZ_B_5.jpg"), url: "#" },
          { model: "Belt 6-S3M-657", name: "Belt S3M-657", desc: "BNA timing belt 6mm width, S3M pitch, 657mm.", img: img("bna_34_Belt_6-S3M-657.jpg"), url: "#" },
          { model: "Belt 6-S3M-699", name: "Belt S3M-699", desc: "BNA timing belt 6mm width, S3M pitch, 699mm.", img: img("bna_35_Belt_6-S3M-699.jpg"), url: "#" },
          { model: "Belt 123*6, S3M", name: "Belt 123x6 S3M", desc: "BNA timing belt 123x6mm S3M pitch.", img: img("bna_36_Belt_123_6__S3M.jpg"), url: "#" },
          { model: "Belt S3M-153*6", name: "Belt S3M-153x6", desc: "BNA timing belt S3M pitch, 153x6mm.", img: img("bna_73_Belt_S3M-153_6.jpg"), url: "#" },
          { model: "Belt 6-S3M-162", name: "Belt S3M-162", desc: "BNA timing belt 6mm width, S3M pitch, 162mm.", img: img("bna_38_Belt_6-S3M-162.jpg"), url: "#" },
        ],
      },
      {
        name: "Motors & Sensors",
        tagline: "Drive motors & detection sensors",
        products: [
          { model: "Assembly Motor For BNA GRG", name: "Assembly Motor BNA GRG", desc: "BNA motor assembly unit for GRG gate mechanism.", img: img("bna_40_Assembly_Motor_For_BNA_GRG.jpg"), url: "#" },
          { model: "Main Motor For BNA GRG", name: "Main Motor BNA GRG", desc: "BNA main drive motor for GRG gate.", img: img("bna_41_Main_Motor_For_BNA_GRG.jpg"), url: "#" },
          { model: "Motor หน้า", name: "Motor Front", desc: "BNA front motor unit for gate mechanism.", img: img("bna_47_Motor_หน้า.jpg"), url: "#" },
          { model: "Sensor Infrared", name: "Sensor Infrared", desc: "BNA infrared sensor for object detection.", img: img("bna_42_Sensor_Infrared.jpg"), url: "#" },
          { model: "Sensor Detect Note Box", name: "Sensor Note Box", desc: "BNA detection sensor for note box assembly.", img: img("bna_45_Sensor_Detect_Note_Box.jpg"), url: "#" },
          { model: "BNA Aligment sensor", name: "BNA Alignment Sensor", desc: "BNA alignment sensor for gate positioning.", img: img("bna_58_BNA_Aligment_sensor.jpg"), url: "#" },
          { model: "E-Directer for BNA", name: "E-Director", desc: "BNA electronic director unit for gate control.", img: img("bna_66_E-Directer_for_BNA.jpg"), url: "#" },
          { model: "BA-150 serial roller BNA", name: "BA-150 Serial Roller", desc: "BNA BA-150 serial roller assembly.", img: img("bna_68_BA-150_serial_roller_BNA.jpg"), url: "#" },
          { model: "SG04 / BNA / B393", name: "SG04 BNA B393", desc: "BNA SG04 gate controller unit B393.", img: img("bna_56_SG04___BNA___B393.jpg"), url: "#" },
        ],
      },
      {
        name: "Accessories",
        tagline: "Cables, solenoids & hardware",
        products: [
          { model: "Cable clamp", name: "Cable Clamp", desc: "BNA cable clamp for wire management.", img: img("bna_39_Cable_clamp.jpg"), url: "#" },
          { model: "BNA Cable", name: "BNA Cable", desc: "BNA connection cable for gate systems.", img: img("bna_71_BNA_Cable.jpg"), url: "#" },
          { model: "Solenoid", name: "Solenoid", desc: "BNA solenoid actuator for gate locking.", img: img("bna_44_Solenoid.jpg"), url: "#" },
          { model: "Tag RFID", name: "RFID Tag", desc: "BNA RFID tag for identification.", img: img("bna_46_Tag_RFID.jpg"), url: "#" },
          { model: "ดิส 06-Z20", name: "Disc 06-Z20", desc: "BNA disc 06-Z20 for gate mechanism.", img: img("bna_43_ดิส_06-Z20.jpg"), url: "#" },
        ],
      },
    ],
  },
];

const toSlug = (value) => String(value)
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "");

function findProductByModel(model) {
  for (const category of productCategories) {
    for (const group of category.groups) {
      const product = group.products.find((item) => item.model === model);
      if (product) return { product, category, group };
    }
  }
  return null;
}

function productRoute(categoryId, model) {
  return `model/${categoryId}/${toSlug(model)}`;
}

function groupRoute(categoryId, groupName) {
  return `group/${categoryId}/${toSlug(groupName)}`;
}

function resolveProductRoute(param) {
  if (!param) return null;
  const parts = param.split("/");

  if (parts[0] === "model" && parts.length >= 3) {
    const category = productCategories.find((item) => item.id === parts[1]);
    if (!category) return null;
    for (const group of category.groups) {
      const product = group.products.find((item) => toSlug(item.model) === parts[2]);
      if (product) return { product, category, group };
    }
    return null;
  }

  const legacyModel = parts[0] === "model" ? parts.slice(1).join("/") : param;
  return findProductByModel(safeDecode(legacyModel));
}

function resolveGroupRoute(param) {
  if (!param) return null;
  const parts = param.split("/");

  if (parts[0] === "group" && parts.length >= 3) {
    const category = productCategories.find((item) => item.id === parts[1]);
    const group = category?.groups.find((item) => toSlug(item.name) === parts[2]);
    return group ? { category, group } : null;
  }

  const legacyName = parts[0] === "group" ? parts.slice(1).join("/") : param;
  for (const category of productCategories) {
    const group = category.groups.find((item) => item.name === safeDecode(legacyName));
    if (group) return { category, group };
  }
  return null;
}

function normalizeRoute(route) {
  if (route.base !== "products" || !route.param) return route;

  if (route.param.startsWith("category/")) return route;

  const productMatch = resolveProductRoute(route.param);
  if (productMatch) {
    return {
      ...route,
      param: productRoute(productMatch.category.id, productMatch.product.model),
    };
  }

  const groupMatch = resolveGroupRoute(route.param);
  if (groupMatch) {
    return {
      ...route,
      param: groupRoute(groupMatch.category.id, groupMatch.group.name),
    };
  }

  return route;
}

function getRouteFromLocation() {
  return normalizeRoute(parseLocation());
}

function RouteLink({ navigate, to, param = null, children, onClick, ...props }) {
  const href = buildRoutePath(to, param);
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !isPlainLeftClick(event)) return;
        event.preventDefault();
        navigate(to, param);
      }}
    >
      {children}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m5 8 7 5 7-5" />
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

function MegaMenuPanel({ isOpen, onClose, onNavigateProduct, onMouseEnter, onMouseLeave }) {
  const [activeCatId, setActiveCatId] = useState("embedded");
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [failedImgs, setFailedImgs] = useState({});

  const category = productCategories.find((c) => c.id === activeCatId) || productCategories[0];
  const group = category.groups[activeGroupIdx] || category.groups[0];

  useEffect(() => { setActiveGroupIdx(0); }, [activeCatId]);
  useEffect(() => { setFailedImgs({}); }, [activeCatId, activeGroupIdx]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = () => onClose();
    window.addEventListener("scroll", fn, { passive: true, once: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isOpen, onClose]);

  return (
    <div
      className={`mega-panel${isOpen ? " is-open" : ""}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Product categories"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="mega-categories" aria-label="Product categories">
        <span className="mega-label">Categories</span>
        {productCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`mega-cat-btn${activeCatId === cat.id ? " is-active" : ""}`}
            onMouseEnter={() => setActiveCatId(cat.id)}
            onClick={() => onNavigateProduct("category/" + cat.id)}
          >
            <span className="mega-cat-dot" aria-hidden="true" />
            {cat.label}
          </button>
        ))}
        <div className="mega-cat-blurb">
          <p>{categoryBlurbs[activeCatId]}</p>
        </div>
      </nav>

      <div className="mega-groups">
        <span className="mega-label">{category.label}</span>
        <div className="mega-group-list">
          {category.groups.map((g, idx) => (
            <button
              key={g.name}
              type="button"
              className={`mega-group-btn${activeGroupIdx === idx ? " is-active" : ""}`}
              onMouseEnter={() => setActiveGroupIdx(idx)}
              onClick={() => onNavigateProduct(groupRoute(category.id, g.name))}
            >
              <span className="mega-group-bar" aria-hidden="true" />
              <span className="mega-group-text">
                <strong>{g.name}</strong>
                {groupTaglines[g.name] && <small>{groupTaglines[g.name]}</small>}
              </span>
              <svg className="mega-group-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mega-preview">
        <span className="mega-label">{group.name}</span>
        <div className="mega-preview-grid">
          {group.products.slice(0, 4).map((product) => (
            <article
              key={product.model}
              className="mega-preview-card"
              onClick={() => onNavigateProduct(productRoute(category.id, product.model))}
              role="button"
              tabIndex={isOpen ? 0 : -1}
            >
              <div className="mega-preview-fig">
                {product.img && !failedImgs[product.model] ? (
                  <img
                    src={product.img}
                    alt={product.model}
                    loading="lazy"
                    onError={() => setFailedImgs((prev) => ({ ...prev, [product.model]: true }))}
                  />
                ) : (
                  <span className="mega-preview-icon">{category.label[0]}</span>
                )}
              </div>
              <div className="mega-preview-body">
                <strong>{product.model}</strong>
                <p>{product.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          className="mega-view-all"
          onClick={() => onNavigateProduct("category/" + activeCatId)}
          tabIndex={isOpen ? 0 : -1}
        >
          View all {category.label}
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

function ProjectsMegaMenuPanel({ isOpen, onNavigateProject, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={`nav-dropdown-menu${isOpen ? " is-open" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="nav-dropdown-list">
        {portfolio.map((project, index) => (
          <button
            key={project.title}
            type="button"
            className="nav-dropdown-item"
            onClick={() => onNavigateProject(`project-${index}`)}
          >
            {project.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function ServicesMegaMenuPanel({ isOpen, onNavigateService, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={`nav-dropdown-menu${isOpen ? " is-open" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="nav-dropdown-list">
        {services.map((service, index) => (
          <button
            key={service.title}
            type="button"
            className="nav-dropdown-item"
            onClick={() => onNavigateService(`service-${index}`)}
          >
            {service.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(getRouteFromLocation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sendingState, setSendingState] = useState("idle");
  const [submittedData, setSubmittedData] = useState(null);
  const [sendError, setSendError] = useState("");
  const reduceMotion = useReducedMotion();
  const pageRef = useRef(null);
  const { t } = useLang();
  const selectedProduct = useMemo(
    () => (route.base === "products" ? resolveProductRoute(route.param)?.product || null : null),
    [route.base, route.param],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(CONTACT_RETURN_PARAM) !== "1") return;

    let pendingData = null;
    try {
      pendingData = JSON.parse(window.sessionStorage.getItem(CONTACT_PENDING_KEY) || "null");
      window.sessionStorage.removeItem(CONTACT_PENDING_KEY);
    } catch {
      // The success state still works when storage is unavailable.
    }

    url.searchParams.delete(CONTACT_RETURN_PARAM);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setSubmittedData(pendingData);
    setSendError("");
    setSendingState("success");
  }, []);

  function navigate(nextRoute, param = null) {
    if (!ROUTES.includes(nextRoute)) {
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    window.history.pushState(null, "", buildRoutePath(nextRoute, param));
    setRoute({ base: nextRoute, param, legacy: false });
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    if (sendingState === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      subject: formData.get("subject") || "general",
      name: formData.get("name"),
      contact: formData.get("contact"),
      message: formData.get("message"),
      product: formData.get("product"),
      company: formData.get("company"),
      station: formData.get("station"),
      device: formData.get("device"),
    };

    const subjectLabels = {
      general: "Contact Services",
      product: "Ask for Products",
      support: "Support",
      other: "Other",
    };

    setSendingState("sending");
    setSendError("");
    setSubmittedData(data);

    try {
      const contactEndpoint = String(import.meta.env.VITE_CONTACT_ENDPOINT || "").trim();
      if (!contactEndpoint) {
        throw new Error("The contact service is not configured yet.");
      }
      const contactEmail = String(data.contact).includes("@") ? data.contact : undefined;
      const clientReference = createContactReference();
      const payload = {
        _subject: `[SIS • ${clientReference}] ${subjectLabels[data.subject] || data.subject} — ${data.name}`,
        _template: "table",
        _honey: formData.get("website") || "",
        started_at: formData.get("started_at") || "",
        turnstile_token: formData.get("cf-turnstile-response") || "",
        _replyto: contactEmail,
        email: contactEmail,
        name: data.name,
        contact: data.contact,
        topic_code: data.subject,
        topic: subjectLabels[data.subject] || data.subject,
        product: data.product || "—",
        company: data.company || "—",
        station: data.station || "—",
        device: data.device || "—",
        message: data.message,
        page: window.location.href,
      };

      if (isFormSubmitEndpoint(contactEndpoint)) {
        try {
          window.sessionStorage.setItem(CONTACT_PENDING_KEY, JSON.stringify(data));
        } catch {
          // Form submission does not depend on browser storage.
        }
        submitThroughFormSubmit(contactEndpoint, payload);
        return true;
      }

      const usesWeb3Forms = isWeb3FormsEndpoint(contactEndpoint);
      if (usesWeb3Forms && !CONTACT_ACCESS_KEY) {
        throw new Error("The contact email service is waiting for its access key.");
      }

      const requestPayload = usesWeb3Forms ? {
        access_key: CONTACT_ACCESS_KEY,
        subject: payload._subject,
        from_name: "SIS Website • Contact Center",
        botcheck: payload._honey,
        email: contactEmail,
        replyto: contactEmail,
        "เลขอ้างอิง / Reference": clientReference,
        "วันที่รับเรื่อง / Received": formatBangkokTimestamp(),
        "ประเภทคำขอ / Request Type": payload.topic,
        "ชื่อผู้ติดต่อ / Contact Name": data.name,
        "อีเมลหรือโทรศัพท์ / Email or Phone": data.contact,
        "บริษัท / Company": payload.company,
        "สินค้าที่สนใจ / Product": payload.product,
        "สถานี / Station": payload.station,
        "อุปกรณ์ / Device": payload.device,
        "ข้อความ / Message": data.message,
        "หน้าที่ส่ง / Source Page": window.location.href,
      } : {
        ...payload,
        _url: window.location.href,
      };

      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: contactEndpoint.startsWith("/") ? "same-origin" : "omit",
        body: JSON.stringify(requestPayload),
      });

      const result = await response.json().catch(() => ({}));
      const responseMessage = result.message || result.body?.message;
      if (!response.ok || result.success === false) {
        throw new Error(responseMessage || "The email service could not accept this message.");
      }

      form.reset();
      setSubmittedData({ ...data, reference: result.reference || clientReference });
      setSendingState("success");
      return true;
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Unable to send your message right now.");
      setSendingState("error");
      return false;
    }
  }

  function handleNavigateProduct(path) {
    navigate("products", path);
  }

  const currentPage = useMemo(() => {
    return {
      home: <HomePage navigate={navigate} />,
      about: <EnhancedAboutPage navigate={navigate} />,
      services: <ServicesPage routeParam={route.param} />,
      projects: <ProjectsPage routeParam={route.param} />,
      products: <ProductsPage productModel={route.param} navigate={navigate} />,
      contact: <ContactPage isSending={sendingState === "sending"} onSubmit={handleContactSubmit} />,
      "not-found": <NotFoundPage navigate={navigate} />,
    }[route.base];
  }, [route, sendingState]);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRouteFromLocation());
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
    if (!route.legacy) return;
    window.history.replaceState(null, "", buildRoutePath(route.base, route.param));
    setRoute((current) => ({ ...current, legacy: false }));
  }, [route]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const elements = Array.from(pageRef.current?.querySelectorAll(".reveal") ?? [])
      .filter((el) => !el.closest(".snap-container"));
    if (reduceMotion) {
      elements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return undefined;
    }

    const stopObservers = elements.map((element, index) =>
      inView(
        element,
        () => {
          animate(
            element,
            { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
            { duration: 0.42, delay: Math.min(index * 0.025, 0.12), ease: [0.22, 1, 0.36, 1] },
          );
        },
        { margin: "0px 0px -8% 0px", amount: 0.12 },
      ),
    );

    return () => stopObservers.forEach((stop) => stop());
  }, [route, reduceMotion]);

  return (
    <>
      <SeoManager route={route} product={selectedProduct} shareImage={logo} />
      <Header route={route.base} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} onNavigateProduct={handleNavigateProduct} />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          ref={pageRef}
          key={`${route.base}-${route.param || "root"}`}
          className={`page-shell page-${route.base}`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {currentPage}
        </motion.main>
      </AnimatePresence>
      {route.base !== "home" && <Footer navigate={navigate} />}

      <AnimatePresence>
        {sendingState !== "idle" && (
        <motion.div
          className="sending-popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sending-dialog-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          <motion.div
            className="sending-popup-card"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, y: reduceMotion ? 0 : 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {sendingState === "sending" ? (
              <div className="sending-popup-content" aria-live="polite">
                <div className="mail-orbit" aria-hidden="true">
                  <motion.div
                    className="mail-orbit-glow"
                    animate={reduceMotion ? undefined : { scale: [0.88, 1.08, 0.88], opacity: [0.45, 0.9, 0.45] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="mail-orbit-ring"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="mail-orbit-icon"><MailIcon /></div>
                </div>
                <p className="dialog-eyebrow">{t("popup.secureTransmission")}</p>
                <h3 id="sending-dialog-title">{t("popup.sendingTitle")}</h3>
                <p>{t("popup.sendingDesc")}</p>
                <div className="sending-indicator" aria-hidden="true">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={reduceMotion ? undefined : { y: [0, -6, 0], opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            ) : sendingState === "success" ? (
              <div className="sending-popup-content success">
                <div className="success-icon-container">
                  <svg className="success-check-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="dialog-eyebrow">{t("popup.messageAccepted")}</p>
                <h3 id="sending-dialog-title">{t("popup.sentSuccess")}</h3>
                <p>{t("popup.sentDesc")}</p>
                <div className="success-data-summary">
                  <div><strong>{t("popup.from")}</strong> {submittedData?.name} ({submittedData?.contact})</div>
                  {submittedData?.reference ? (
                    <div><strong>{t("popup.reference")}</strong> {submittedData.reference}</div>
                  ) : null}
                  <div><strong>{t("popup.subjectLabel")}</strong> {{
                    general: t("form.contactServices"),
                    product: t("form.askProducts"),
                    support: t("form.support"),
                    other: t("form.other")
                  }[submittedData?.subject] || submittedData?.subject}</div>
                  <div className="success-message-text">"{submittedData?.message}"</div>
                </div>
                <button className="btn btn-primary btn-close-popup" type="button" onClick={() => setSendingState("idle")}>
                  {t("popup.done")}
                </button>
              </div>
            ) : (
              <div className="sending-popup-content error" aria-live="assertive">
                <div className="error-icon-container" aria-hidden="true">!</div>
                <p className="dialog-eyebrow">{t("popup.deliveryInterrupted")}</p>
                <h3 id="sending-dialog-title">{t("popup.notSent")}</h3>
                <p>{sendError || t("popup.checkConnection")}</p>
                <button className="btn btn-secondary btn-close-popup" type="button" onClick={() => setSendingState("idle")}>
                  {t("popup.backToForm")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
function Header({ route, menuOpen, setMenuOpen, navigate, onNavigateProduct }) {
  const [activeMega, setActiveMega] = useState(null); // null, 'products', 'projects', 'services'
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const { t } = useLang();

  useEffect(() => {
    setHeaderHidden(false);
    lastScrollY.current = 0;

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setHeaderHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    const snapContainer = document.querySelector(".snap-container");
    const handleSnapScroll = () => {
      if (!snapContainer) return;
      const currentScrollTop = snapContainer.scrollTop;
      if (currentScrollTop > lastScrollY.current && currentScrollTop > 60) {
        setHeaderHidden(true);
      } else if (currentScrollTop < lastScrollY.current) {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentScrollTop;
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    if (snapContainer) {
      snapContainer.addEventListener("scroll", handleSnapScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      if (snapContainer) {
        snapContainer.removeEventListener("scroll", handleSnapScroll);
      }
    };
  }, [route]);

  const handleMouseEnter = useCallback((menuName) => {
    clearTimeout(closeRef.current);
    openRef.current = setTimeout(() => {
      setActiveMega(menuName);
    }, 150);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openRef.current);
    closeRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 250);
  }, []);

  const closeMega = useCallback(() => {
    clearTimeout(openRef.current);
    clearTimeout(closeRef.current);
    setActiveMega(null);
  }, []);

  useEffect(() => { closeMega(); }, [route, closeMega]);
  useEffect(() => () => { clearTimeout(openRef.current); clearTimeout(closeRef.current); }, []);

  return (
    <header className={`site-header${headerHidden && !menuOpen && !activeMega ? " is-hidden" : ""}`}>
      <button className="brand" type="button" onClick={() => navigate("home")} aria-label="SIS home">
        <img src={logo} alt="SIS Siam Infinity Solution logo" />
      </button>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon open={menuOpen} />
      </button>

      <nav className="nav-panel" aria-label="Primary navigation">
        {navItems.map((item) =>
          item.id === "products" ? (
            <div
              key={item.id}
              className="mega-trigger"
              onMouseEnter={() => handleMouseEnter("products")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link${route === item.id || activeMega === "products" ? " is-active" : ""}`}
                onClick={() => {
                  if (menuOpen) {
                    navigate("products");
                    closeMega();
                    return;
                  }
                  setActiveMega(activeMega === "products" ? null : "products");
                }}
                aria-expanded={activeMega === "products"}
                aria-haspopup="dialog"
              >
                {t(item.labelKey)}
                <svg className={`mega-caret${activeMega === "products" ? " is-open" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          ) : item.id === "projects" ? (
            <div
              key={item.id}
              className="mega-trigger"
              onMouseEnter={() => handleMouseEnter("projects")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link${route === item.id || activeMega === "projects" ? " is-active" : ""}`}
                onClick={() => navigate("projects")}
                aria-expanded={activeMega === "projects"}
                aria-haspopup="dialog"
              >
                {t(item.labelKey)}
                <svg className={`mega-caret${activeMega === "projects" ? " is-open" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <ProjectsMegaMenuPanel
                isOpen={activeMega === "projects" && !menuOpen}
                onNavigateProject={(projId) => { navigate("projects", projId); closeMega(); }}
                onMouseEnter={() => handleMouseEnter("projects")}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          ) : item.id === "services" ? (
            <div
              key={item.id}
              className="mega-trigger"
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link${route === item.id || activeMega === "services" ? " is-active" : ""}`}
                onClick={() => navigate("services")}
                aria-expanded={activeMega === "services"}
                aria-haspopup="dialog"
              >
                {t(item.labelKey)}
                <svg className={`mega-caret${activeMega === "services" ? " is-open" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <ServicesMegaMenuPanel
                isOpen={activeMega === "services" && !menuOpen}
                onNavigateService={(servId) => { navigate("services", servId); closeMega(); }}
                onMouseEnter={() => handleMouseEnter("services")}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          ) : (
            <button
              key={item.id}
              type="button"
              className={route === item.id ? "nav-link is-active" : "nav-link"}
              onClick={() => { navigate(item.id); closeMega(); }}
            >
              {t(item.labelKey)}
            </button>
          )
        )}
      </nav>

      <MegaMenuPanel
        isOpen={activeMega === "products" && !menuOpen}
        onClose={closeMega}
        onNavigateProduct={(catId, model) => { onNavigateProduct(catId, model); closeMega(); }}
        onMouseEnter={() => handleMouseEnter("products")}
        onMouseLeave={handleMouseLeave}
      />

      <LangToggle />
    </header>
  );
}

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

const NEWS_LOOP_CLONE_COUNT = 4;

function NewsActivitiesSection() {
  const { t, lang } = useLang();
  const [slidePosition, setSlidePosition] = useState(NEWS_LOOP_CLONE_COUNT);
  const [isSlideTransitionEnabled, setIsSlideTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayTimer = useRef(null);
  const loopResetTimer = useRef(null);

  const newsItems = useMemo(
    () => [
      {
        id: 1,
        category: "NEWS",
        titleTh: "SIS เปิดตัวระบบประตูอัตโนมัติรองรับการชำระเงิน EMV บนสายรถไฟฟ้า MRT",
        titleEn: "SIS Launches EMV Payment Automatic Fare Gate System Across MRT Rail Lines",
        descTh: "ยกระดับระบบจัดเก็บค่าโดยสารอัตโนมัติด้วยเทคโนโลยีแตะจ่ายไร้สัมผัส เพิ่มความสะดวกสบายให้ผู้โดยสารรถไฟฟ้า MRT",
        descEn: "Upgrading AFC systems with contactless EMV tap-to-pay tech for seamless MRT commuter experiences.",
        date: "18 FEB 2026",
        image: emvGate,
      },
      {
        id: 2,
        category: "EVENT",
        titleTh: "เข้าร่วมทดสอบระบบเปิดใช้งานภาคสนาม Blue Line Extension Phase 2",
        titleEn: "Field Pilot Testing Commissioning for MRT Blue Line Extension Phase 2",
        descTh: "ทีมวิศวกร SIS ร่วมทดสอบระบบและเตรียมความพร้อมอุปกรณ์ประตูอัตโนมัติภาคสนามก่อนเปิดให้บริการประชาชน",
        descEn: "SIS engineering teams complete field testing for bi-directional automatic gate systems prior to official launch.",
        date: "05 JAN 2026",
        image: job3,
      },
      {
        id: 3,
        category: "ANNOUNCEMENT",
        titleTh: "เสร็จสิ้นโครงการย้ายศูนย์ประมวลผลระบบตั๋ว CCH สู่สำนักงานใหญ่ MRTA",
        titleEn: "Completion of CCH Central Clearing House Relocation to MRTA Infrastructure",
        descTh: "ย้ายโครงสร้างพื้นฐานระบบประมวลผลกลางอย่างราบรื่น ปลอดภัย และได้มาตรฐานความมั่นคงปลอดภัยสูงสุด",
        descEn: "Seamless infrastructure relocation of OTP Central Clearing House ensuring enterprise security & zero downtime.",
        date: "12 DEC 2025",
        image: job5,
      },
      {
        id: 4,
        category: "ACTIVITY",
        titleTh: "โครงการอัปเกรดหน้าจอแสดงผล PID บนประตูเก็บค่าโดยสารทั้ง 7 สถานีหลัก",
        titleEn: "Passenger Information Display (PID) Hardware Upgrade Across 7 Key Stations",
        descTh: "ติดตั้งและเปลี่ยนหน้าจอ PID รุ่นใหม่บนประตูอัตโนมัติ เพื่อการแสดงผลสถานะที่คมชัดและแม่นยำยิ่งขึ้น",
        descEn: "Replacement and deployment of high-definition PID screens on bi-directional fare gates for enhanced clarity.",
        date: "20 NOV 2025",
        image: job6,
      },
      {
        id: 5,
        category: "CSR",
        titleTh: "SIS มุ่งสู่ระบบคมนาคมสีเขียวยั่งยืน และการพัฒนาวิศวกรรมระบบรางไทย",
        titleEn: "SIS Drives Sustainable Green Transit Engineering & Rail Infrastructure Innovation",
        descTh: "ส่งเสริมการใช้พลังงานสะอาดและพัฒนานวัตกรรมระบบขนส่งมวลชนเพื่อลดการปล่อยคาร์บอนในเมืองใหญ่",
        descEn: "Promoting green transit solutions and innovative rail engineering to support sustainable urban mobility.",
        date: "15 OCT 2025",
        image: job13,
      },
      {
        id: 6,
        category: "NEWS",
        titleTh: "ขยายระบบรองรับบัตร Rabbit Reader สำหรับรถประจำทางสมาร์ทบัส",
        titleEn: "Expansion of Rabbit Reader Payment Integration for Smart Transit Fleet",
        descTh: "ติดตั้งหัวอ่านชำระเงินอัตโนมัติสำหรับรถประจำทางเชื่อมต่อการเดินทางอย่างเป็นระบบไร้รอยต่อ",
        descEn: "Full deployment of automatic payment reader hardware on smart bus routes connecting transit networks.",
        date: "28 SEP 2025",
        image: job7,
      },
    ],
    []
  );

  const totalItems = newsItems.length;
  const currentIndex =
    (slidePosition - NEWS_LOOP_CLONE_COUNT + totalItems) % totalItems;
  const loopedNewsItems = useMemo(
    () => [
      ...newsItems.slice(-NEWS_LOOP_CLONE_COUNT).map((item) => ({
        item,
        key: `news-clone-leading-${item.id}`,
        duplicate: true,
      })),
      ...newsItems.map((item) => ({
        item,
        key: `news-${item.id}`,
        duplicate: false,
      })),
      ...newsItems.slice(0, NEWS_LOOP_CLONE_COUNT).map((item) => ({
        item,
        key: `news-clone-trailing-${item.id}`,
        duplicate: true,
      })),
    ],
    [newsItems]
  );

  const handleNext = useCallback(() => {
    setIsSlideTransitionEnabled(true);
    setSlidePosition((prev) =>
      prev >= totalItems + NEWS_LOOP_CLONE_COUNT
        ? totalItems + NEWS_LOOP_CLONE_COUNT
        : prev + 1
    );
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setIsSlideTransitionEnabled(true);
    setSlidePosition((prev) =>
      prev <= NEWS_LOOP_CLONE_COUNT - 1
        ? NEWS_LOOP_CLONE_COUNT - 1
        : prev - 1
    );
  }, []);

  const handleSlideTransitionEnd = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    let loopPosition = null;
    if (slidePosition === totalItems + NEWS_LOOP_CLONE_COUNT) {
      loopPosition = NEWS_LOOP_CLONE_COUNT;
    }
    if (slidePosition === NEWS_LOOP_CLONE_COUNT - 1) {
      loopPosition = totalItems + NEWS_LOOP_CLONE_COUNT - 1;
    }
    if (loopPosition === null) return;

    setIsSlideTransitionEnabled(false);
    setSlidePosition(loopPosition);

    if (loopResetTimer.current) clearTimeout(loopResetTimer.current);
    loopResetTimer.current = setTimeout(() => {
      setIsSlideTransitionEnabled(true);
      loopResetTimer.current = null;
    }, 50);
  };

  const goToSlide = (index) => {
    setIsSlideTransitionEnabled(true);
    setSlidePosition(index + NEWS_LOOP_CLONE_COUNT);
  };

  useEffect(() => {
    if (isPaused) return;
    autoPlayTimer.current = setInterval(() => {
      handleNext();
    }, 4200);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, handleNext]);

  useEffect(
    () => () => {
      if (loopResetTimer.current) clearTimeout(loopResetTimer.current);
    },
    []
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) handleNext();
    if (diff < -40) handlePrev();
  };

  return (
    <section
      className="news-activities-section"
      aria-labelledby="news-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="news-heading">
        <span className="news-kicker">{t("news.kicker")}</span>
        <h2 id="news-title">{t("news.title")}</h2>
        <p className="news-subtitle">{t("news.desc")}</p>
      </div>

      <div
        className="news-slider-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className="news-nav-btn news-prev-btn"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          className="news-nav-btn news-next-btn"
          onClick={handleNext}
          aria-label="Next slide"
        >
          ›
        </button>

        <div
          className="news-slider-track"
          style={{
            "--news-position": slidePosition,
            transition: isSlideTransitionEnabled ? undefined : "none",
          }}
          onTransitionEnd={handleSlideTransitionEnd}
        >
          {loopedNewsItems.map(({ item, key, duplicate }) => (
            <article
              className="news-card-slot"
              key={key}
              aria-hidden={duplicate ? true : undefined}
            >
              <div
                className="news-card-glass"
                tabIndex={duplicate ? -1 : 0}
              >
                <div className="news-card-media">
                  <img
                    src={item.image}
                    alt={lang === "th" ? item.titleTh : item.titleEn}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="news-card-content">
                  <span className="news-badge">{item.category}</span>
                  <h3 className="news-card-title">
                    {lang === "th" ? item.titleTh : item.titleEn}
                  </h3>
                  <p className="news-card-desc">
                    {lang === "th" ? item.descTh : item.descEn}
                  </p>
                  <div className="news-card-footer">
                    <span className="news-card-date">{item.date}</span>
                    <span className="news-card-readmore">
                      {t("news.readMore")} <span className="arrow-icon">→</span>
                    </span>
                  </div>
                </div>
                <div className="news-card-overlay">
                  <span className="news-badge-overlay">{item.category}</span>
                  <h3 className="news-title-overlay">
                    {lang === "th" ? item.titleTh : item.titleEn}
                  </h3>
                  <p className="news-desc-overlay">
                    {lang === "th" ? item.descTh : item.descEn}
                  </p>
                  <span className="news-readmore-overlay">
                    {t("news.readMore")} →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="news-pagination-dots" aria-label="News slides">
        {newsItems.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`news-dot ${currentIndex === idx ? "active" : ""}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function ScrollIndicator({
  total,
  activeIndex,
  scrollToSection,
  visible,
  onActivity,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      className={`snap-indicators${visible ? " is-visible" : ""}`}
      role="tablist"
      aria-label="Page sections"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerMove={onActivity}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`snap-dot${i === activeIndex ? " is-active" : ""}`}
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to section ${i + 1}`}
          onClick={() => {
            onActivity();
            scrollToSection(i);
          }}
        />
      ))}
    </div>
  );
}

function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map(({ segment }) => segment);
  }
  return Array.from(text);
}

function TypingHeadline({ primary, accent, active }) {
  const reduceMotion = useReducedMotion();
  const primaryCharacters = useMemo(() => splitGraphemes(primary), [primary]);
  const accentCharacters = useMemo(() => splitGraphemes(accent), [accent]);
  const [typing, setTyping] = useState({ primary: 0, accent: 0, activeLine: null });

  useEffect(() => {
    if (reduceMotion || !active) {
      setTyping({
        primary: primaryCharacters.length,
        accent: accentCharacters.length,
        activeLine: null,
      });
      return undefined;
    }

    let frameId;
    let startTime;
    let lastPrimary = -1;
    let lastAccent = -1;
    let lastActiveLine = null;
    const initialDelay = 260;
    const characterDuration = 46;
    const linePause = 240;

    const publish = (primaryCount, accentCount, activeLine) => {
      if (
        primaryCount === lastPrimary
        && accentCount === lastAccent
        && activeLine === lastActiveLine
      ) return;

      lastPrimary = primaryCount;
      lastAccent = accentCount;
      lastActiveLine = activeLine;
      setTyping({ primary: primaryCount, accent: accentCount, activeLine });
    };

    publish(0, 0, "primary");

    const typeFrame = (time) => {
      if (startTime === undefined) startTime = time;
      const elapsed = time - startTime;

      if (elapsed < initialDelay) {
        frameId = window.requestAnimationFrame(typeFrame);
        return;
      }

      const typingTime = elapsed - initialDelay;
      const primaryDuration = primaryCharacters.length * characterDuration;

      if (typingTime < primaryDuration) {
        const primaryCount = Math.min(
          primaryCharacters.length,
          Math.floor(typingTime / characterDuration) + 1,
        );
        publish(primaryCount, 0, "primary");
        frameId = window.requestAnimationFrame(typeFrame);
        return;
      }

      if (typingTime < primaryDuration + linePause) {
        publish(primaryCharacters.length, 0, "primary");
        frameId = window.requestAnimationFrame(typeFrame);
        return;
      }

      const accentTime = typingTime - primaryDuration - linePause;
      const accentCount = Math.min(
        accentCharacters.length,
        Math.floor(accentTime / characterDuration) + 1,
      );
      const isComplete = accentCount >= accentCharacters.length;
      publish(
        primaryCharacters.length,
        accentCount,
        isComplete ? null : "accent",
      );

      if (!isComplete) frameId = window.requestAnimationFrame(typeFrame);
    };

    frameId = window.requestAnimationFrame(typeFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [accentCharacters, active, primaryCharacters, reduceMotion]);

  return (
    <h1 className="hero-typing-headline" aria-label={`${primary} ${accent}`}>
      <span
        aria-hidden="true"
        className={`hero-slogan-line hero-slogan-primary${typing.activeLine === "primary" ? " is-typing" : ""}`}
      >
        {primaryCharacters.slice(0, typing.primary).join("") || "\u00A0"}
      </span>
      <span
        aria-hidden="true"
        className={`hero-slogan-line hero-slogan-accent${typing.activeLine === "accent" ? " is-typing" : ""}`}
      >
        {accentCharacters.slice(0, typing.accent).join("") || "\u00A0"}
      </span>
    </h1>
  );
}

function HomePage({ navigate }) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const snapRef = useRef(null);
  const [activeSnap, setActiveSnap] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [indicatorsVisible, setIndicatorsVisible] = useState(true);
  const sectionCount = 5;
  const isAnimating = useRef(false);
  const scrollAnimation = useRef(null);
  const previousScrollTop = useRef(0);
  const indicatorTimer = useRef(null);
  const wheelGestureLocked = useRef(false);
  const wheelGestureTimer = useRef(null);

  const clearIndicatorTimer = useCallback(() => {
    if (indicatorTimer.current) {
      window.clearTimeout(indicatorTimer.current);
      indicatorTimer.current = null;
    }
  }, []);

  const scheduleIndicatorHide = useCallback(() => {
    clearIndicatorTimer();
    indicatorTimer.current = window.setTimeout(() => {
      setIndicatorsVisible(false);
      indicatorTimer.current = null;
    }, 2000);
  }, [clearIndicatorTimer]);

  const showIndicators = useCallback(() => {
    setIndicatorsVisible(true);
    scheduleIndicatorHide();
  }, [scheduleIndicatorHide]);

  const holdIndicators = useCallback(() => {
    clearIndicatorTimer();
    setIndicatorsVisible(true);
  }, [clearIndicatorTimer]);

  useEffect(() => {
    document.documentElement.classList.add("has-snap-scroll");
    showIndicators();
    return () => {
      document.documentElement.classList.remove("has-snap-scroll");
      clearIndicatorTimer();
      scrollAnimation.current?.stop();
    };
  }, [clearIndicatorTimer, showIndicators]);

  useEffect(() => {
    const container = snapRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const sections = [...container.querySelectorAll(":scope > .snap-section")];
      const index = sections.reduce((closestIndex, section, sectionIndex) => {
        const currentDistance = Math.abs(sections[closestIndex].offsetTop - scrollTop);
        const nextDistance = Math.abs(section.offsetTop - scrollTop);
        return nextDistance < currentDistance ? sectionIndex : closestIndex;
      }, 0);

      if (Math.abs(scrollTop - previousScrollTop.current) > 2) {
        setScrollDirection(scrollTop > previousScrollTop.current ? "down" : "up");
      }

      previousScrollTop.current = scrollTop;
      if (!isAnimating.current) {
        setActiveSnap(Math.min(index, sectionCount - 1));
      }
      showIndicators();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [showIndicators]);

  const scrollToSection = useCallback((index) => {
    const container = snapRef.current;
    if (!container || isAnimating.current) return;

    const sections = [...container.querySelectorAll(":scope > .snap-section")];
    const section = sections[index];
    if (!section) return;

    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    const targetScroll = Math.min(section.offsetTop, maxScroll);
    const currentScroll = container.scrollTop;

    showIndicators();
    setScrollDirection(targetScroll >= currentScroll ? "down" : "up");
    setActiveSnap(index);

    if (Math.abs(targetScroll - currentScroll) < 1) return;

    isAnimating.current = true;
    scrollAnimation.current?.stop();

    if (reduceMotion) {
      container.scrollTop = targetScroll;
      isAnimating.current = false;
      return;
    }

    const viewportDistance = Math.abs(targetScroll - currentScroll) / Math.max(container.clientHeight, 1);
    const transitionDuration = Math.min(1.08, Math.max(0.84, viewportDistance * 0.9));

    container.classList.add("is-section-scrolling");
    scrollAnimation.current = animate(currentScroll, targetScroll, {
      duration: transitionDuration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => {
        container.scrollTop = value;
      },
      onComplete: () => {
        container.scrollTop = targetScroll;
        container.classList.remove("is-section-scrolling");
        setActiveSnap(index);
        isAnimating.current = false;
        scrollAnimation.current = null;
      },
    });
  }, [reduceMotion, showIndicators]);

  useEffect(() => {
    const container = snapRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      showIndicators();

      if (wheelGestureTimer.current) window.clearTimeout(wheelGestureTimer.current);
      wheelGestureTimer.current = window.setTimeout(() => {
        wheelGestureLocked.current = false;
        wheelGestureTimer.current = null;
      }, 180);

      if (wheelGestureLocked.current || isAnimating.current) return;
      wheelGestureLocked.current = true;

      const sections = [...container.querySelectorAll(":scope > .snap-section")];
      const currentIndex = sections.reduce((closestIndex, section, sectionIndex) => {
        const closestDistance = Math.abs(sections[closestIndex].offsetTop - container.scrollTop);
        const sectionDistance = Math.abs(section.offsetTop - container.scrollTop);
        return sectionDistance < closestDistance ? sectionIndex : closestIndex;
      }, 0);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(sectionCount - 1, currentIndex + direction));

      if (nextIndex !== currentIndex) scrollToSection(nextIndex);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (wheelGestureTimer.current) window.clearTimeout(wheelGestureTimer.current);
      wheelGestureTimer.current = null;
      wheelGestureLocked.current = false;
    };
  }, [scrollToSection, showIndicators]);

  const heroSlides = useMemo(() => [
    {
      image: heroGate,
      primaryKey: null,
      accentKey: "hero.slide1.accent",
    },
    {
      image: heroMrt,
      primaryKey: "hero.slide2.primary",
      accentKey: "hero.slide2.accent",
    },
    {
      image: heroBidi,
      primaryKey: "hero.slide3.primary",
      accentKey: "hero.slide3.accent",
    },
  ], []);

  // Cloned first slide for continuous forward loop
  const extendedSlides = useMemo(
    () => [...heroSlides, heroSlides[0]],
    [heroSlides]
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const heroTimerRef = useRef(null);

  const nextHeroSlide = useCallback(() => {
    setIsTransitioning(true);
    setHeroIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    heroTimerRef.current = setInterval(nextHeroSlide, 5500);
    return () => clearInterval(heroTimerRef.current);
  }, [nextHeroSlide]);

  const handleTrackTransitionEnd = useCallback(() => {
    if (heroIndex >= heroSlides.length) {
      setIsTransitioning(false);
      setHeroIndex(0);
    }
  }, [heroIndex, heroSlides.length]);

  const goToHeroSlide = useCallback(
    (idx) => {
      setIsTransitioning(true);
      setHeroIndex(idx);
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      heroTimerRef.current = setInterval(nextHeroSlide, 5500);
    },
    [nextHeroSlide]
  );

  const activeDisplayIndex = heroIndex % heroSlides.length;

  return (
    <div className="snap-container" data-scroll-direction={scrollDirection} ref={snapRef}>
      <section className={`snap-section hero cinematic${activeSnap === 0 ? " is-active" : ""}`}>
        <div className="hero-slider" aria-hidden="true">
          <div
            className={`hero-slider-track${isTransitioning ? " is-sliding" : ""}`}
            style={{
              transform: `translateX(-${heroIndex * 100}%)`,
              transition: isTransitioning
                ? "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {extendedSlides.map((slide, i) => {
              const isActive = (heroIndex % heroSlides.length) === (i % heroSlides.length);
              return (
                <figure
                  className={`hero-slide${isActive ? " is-active" : " is-blurred"}`}
                  key={i}
                >
                  <img
                    src={slide.image}
                    alt=""
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </figure>
              );
            })}
          </div>
          <div className="hero-slider-overlay" />
        </div>
        <div className="hero-layout">
          <div className="hero-copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDisplayIndex}
                className="hero-slide-text-container"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {Boolean(heroSlides[activeDisplayIndex].primaryKey && t(heroSlides[activeDisplayIndex].primaryKey)) && (
                  <motion.p
                    className="hero-slide-kicker"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {t(heroSlides[activeDisplayIndex].primaryKey)}
                  </motion.p>
                )}
                <motion.h1
                  className="hero-slide-accent-title"
                  initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {t(heroSlides[activeDisplayIndex].accentKey)}
                </motion.h1>
              </motion.div>
            </AnimatePresence>
          </div>
          <nav className="hero-slider-nav" aria-label="Hero slides">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`hero-slider-dot${activeDisplayIndex === i ? " active" : ""}`}
                onClick={() => goToHeroSlide(i)}
                aria-label={`Slide ${i + 1}`}
                type="button"
              />
            ))}
          </nav>
        </div>
      </section>

      <section className={`snap-section snap-focus${activeSnap === 1 ? " is-active" : ""}`}>
        <div className="focus-pro-max-wrapper">
          <div className="focus-pro-max-card reveal">
            <div className="focus-pro-max-content">
              <span className="focus-pro-max-kicker">
                <Sparkles size={14} />
                FEATURED INNOVATION
              </span>
              <h2
                className="focus-pro-max-title clickable-title"
                onClick={() => navigate("projects")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("projects")}
              >
                NEW EMV GATE
                <span className="title-arrow"> ↗</span>
              </h2>
              <p className="focus-pro-max-desc">{t("focus.desc")}</p>

              <div className="focus-pro-max-chips">
                <span className="focus-pro-max-chip">
                  <Zap size={14} />
                  Bi-directional Control
                </span>
                <span className="focus-pro-max-chip">
                  <CreditCard size={14} />
                  EMV Contactless Payment
                </span>
                <span className="focus-pro-max-chip">
                  <ShieldCheck size={14} />
                  High Security Standard
                </span>
              </div>
            </div>

            <div
              className="focus-pro-max-visual"
              onClick={() => navigate("projects")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("projects")}
              title="Click to view projects"
            >
              <div className="focus-pro-max-img-wrapper">
                <img src={emvGate} alt="NEW EMV GATE" loading="lazy" decoding="async" />
              </div>
              <div className="focus-pro-max-live-badge">
                <span className="focus-pro-max-dot" />
                <span>Live Deployment — MRT Stations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`snap-section snap-process${activeSnap === 2 ? " is-active" : ""}`}>
        <ProcessSection navigate={navigate} />
      </section>

      <section className={`snap-section snap-customers${activeSnap === 3 ? " is-active" : ""}`}>
        <NewsActivitiesSection />
      </section>

      <section className={`snap-section snap-footer${activeSnap === 4 ? " is-active" : ""}`}>
        <Footer navigate={navigate} compact={false} />
      </section>

      <ScrollIndicator
        total={sectionCount}
        activeIndex={activeSnap}
        scrollToSection={scrollToSection}
        visible={indicatorsVisible}
        onActivity={showIndicators}
        onMouseEnter={holdIndicators}
        onMouseLeave={scheduleIndicatorHide}
      />
    </div>
  );
}


function ServicesPage({ routeParam }) {
  const [focusedService, setFocusedService] = useState(null);
  const { t } = useLang();
  const reduceMotion = useReducedMotion();

  const serviceCapabilities = [
    [
      "ออกแบบและติดตั้งประตูอัตโนมัติสองทิศทาง (Bi-directional)",
      "ทดสอบระบบความปลอดภัยและเซ็นเซอร์ตรวจจับผู้โดยสาร",
      "ส่งมอบพร้อมใช้งานตามมาตรฐานระบบขนส่งมวลชน"
    ],
    [
      "เชื่อมต่อระบบตั๋วโดยสารและหัวอ่านตั๋วทุกประเภท",
      "รองรับการชำระเงิน EMV Contactless / QR / Smartcard",
      "บริหารจัดการข้อมูลการเดินทางและรายงานผลการทำงาน"
    ],
    [
      "สำรวจและประเมินสภาพหน้างานก่อนการติดตั้งจริง",
      "ติดตั้งอุปกรณ์ภาคสนามและเดินสายสัญญาณอย่างพิถีพิถัน",
      "ทดสอบการทำงานของอุปกรณ์ภาคสนาม (Field Testing)"
    ],
    [
      "บริการดูแลรักษาและบำรุงรักษาระบบเชิงป้องกัน (PM)",
      "ทีมวิศวกรและช่างผู้เชี่ยวชาญคอยสนับสนุน 24 ชั่วโมง",
      "สำรองอะไหล่และอุปกรณ์ทดแทนเพื่อความต่อเนื่องของการให้บริการ"
    ]
  ];

  const serviceKeys = [
    { titleKey: "service.fareGate.title", bodyKey: "service.fareGate.body", domainKey: "services.domain.fareGate" },
    { titleKey: "service.afc.title", bodyKey: "service.afc.body", domainKey: "services.domain.afc" },
    { titleKey: "service.field.title", bodyKey: "service.field.body", domainKey: "services.domain.field" },
    { titleKey: "service.support.title", bodyKey: "service.support.body", domainKey: "services.domain.support" },
  ];

  useEffect(() => {
    if (!routeParam?.startsWith("service-")) return undefined;
    const index = Number.parseInt(routeParam.replace("service-", ""), 10);
    if (Number.isNaN(index) || index < 0 || index >= services.length) return undefined;

    setFocusedService(index);
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(`service-field-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 180);
    const focusTimer = window.setTimeout(() => setFocusedService(null), 2200);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(focusTimer);
    };
  }, [routeParam]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="corporate-services-page">
      <motion.header 
        className="corporate-services-hero"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="corporate-hero-container">
          <span className="corporate-badge">{t("services.kicker")} & โซลูชั่นวิศวกรรม</span>
          <h1 id="services-page-title" className="corporate-title">
            ระบบประตูอัตโนมัติ & นวัตกรรม AFC
          </h1>
          <p className="corporate-subtitle">
            ให้บริการงานวิศวกรรมเฉพาะทางสำหรับระบบประตูเก็บค่าโดยสารอัตโนมัติ การเชื่อมต่อระบบตั๋ว และการดูแลรักษาอุปกรณ์ภาคสนามสำหรับระบบขนส่งมวลชน
          </p>
        </div>
      </motion.header>

      <section className="corporate-services-section">
        <motion.div 
          className="corporate-services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {services.map((service, index) => (
            <motion.article
              variants={itemVariants}
              className={`corporate-service-card ${focusedService === index ? "is-focused" : ""}`}
              id={`service-field-${index}`}
              key={service.title}
              whileHover={reduceMotion ? {} : { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className="corporate-card-top">
                <div className="corporate-icon-wrapper">
                  <ServiceIcon type={service.icon} />
                </div>
                <span className="corporate-card-index">0{index + 1}</span>
              </div>
              <div className="corporate-card-content">
                <h3>{t(serviceKeys[index].titleKey)}</h3>
                <p>{t(serviceKeys[index].bodyKey)}</p>
                <ul className="corporate-capability-list">
                  {serviceCapabilities[index].map((cap, i) => (
                    <li key={i}>
                      <span className="capability-dot" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="corporate-card-footer">
                <span className="corporate-domain-badge">{t(serviceKeys[index].domainKey)}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div 
          className="corporate-trust-banner"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="trust-item">
            <strong>7 สถานี MRT หลัก</strong>
            <span>ติดตั้งและทดสอบประตูระบบสายสีน้ำเงิน</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <strong>วิศวกรผู้เชี่ยวชาญ</strong>
            <span>ดูแลและสนับสนุนงานภาคสนามอย่างมืออาชีพ</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <strong>มาตรฐานสากล</strong>
            <span>รองรับการทำงานแบบ Bi-directional ปลอดภัยสูง</span>
          </div>
        </motion.div>
      </section>
    </section>
  );
}

function ProjectsPage({ routeParam }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const portfolioKeys = [
    { titleKey: "portfolio.1.title", bodyKey: "portfolio.1.body", catKey: "portfolio.1.category", layoutClass: "project-large" },
    { titleKey: "portfolio.2.title", bodyKey: "portfolio.2.body", catKey: "portfolio.2.category", layoutClass: "project-tall" },
    { titleKey: "portfolio.3.title", bodyKey: "portfolio.3.body", catKey: "portfolio.3.category", layoutClass: "project-wide" },
    { titleKey: "portfolio.4.title", bodyKey: "portfolio.4.body", catKey: "portfolio.4.category", layoutClass: "project-square" },
    { titleKey: "portfolio.5.title", bodyKey: "portfolio.5.body", catKey: "portfolio.5.category", layoutClass: "project-square" },
  ];
  const activeProject = activeProjectIndex === null ? null : portfolio[activeProjectIndex];
  const activeProjectKeys = activeProjectIndex === null ? null : portfolioKeys[activeProjectIndex];
  const galleryFrames = activeProjectIndex === null ? [] : projectGalleryFrames[activeProjectIndex];

  function openProject(index) {
    setActiveProjectIndex(index);
    setActiveSlide(0);
    setSlideDirection(1);
  }

  function closeProject() {
    setActiveProjectIndex(null);
    setActiveSlide(0);
  }

  function showSlide(nextIndex) {
    if (!galleryFrames.length) return;
    const normalizedIndex = (nextIndex + galleryFrames.length) % galleryFrames.length;
    setSlideDirection(normalizedIndex >= activeSlide ? 1 : -1);
    setActiveSlide(normalizedIndex);
  }

  function moveSlide(direction) {
    setSlideDirection(direction);
    setActiveSlide((current) => (current + direction + galleryFrames.length) % galleryFrames.length);
  }

  useEffect(() => {
    document.body.classList.toggle("project-modal-open", activeProjectIndex !== null);
    return () => document.body.classList.remove("project-modal-open");
  }, [activeProjectIndex]);

  useEffect(() => {
    if (activeProjectIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeProject();
      if (event.key === "ArrowLeft") moveSlide(-1);
      if (event.key === "ArrowRight") moveSlide(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProjectIndex, galleryFrames.length]);

  useEffect(() => {
    if (routeParam) {
      const element = document.getElementById(routeParam);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight-project");
          setTimeout(() => {
            element.classList.remove("highlight-project");
          }, 2000);
        }, 150);
      }
    }
  }, [routeParam]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="premium-projects-page">
      <motion.section 
        className="premium-projects-hero"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="premium-projects-hero-copy">
          <p className="premium-projects-kicker">{t("projects.kicker")}</p>
          <h1 id="projects-page-title" className="premium-projects-title">{t("projects.title")}</h1>
          <p className="premium-projects-desc">{t("projects.desc")}</p>
        </div>
        <aside className="premium-projects-summary" aria-label={t("projects.summaryTitle")}>
          <span className="premium-summary-count">{String(portfolio.length).padStart(2, "0")}</span>
          <div className="premium-summary-text">
            <strong>{t("projects.summaryTitle")}</strong>
            <small>{t("projects.summaryDesc")}</small>
          </div>
        </aside>
      </motion.section>

      <section className="premium-projects-showcase">
        <header className="premium-showcase-heading">
          <p className="premium-projects-kicker">{t("projects.showcaseKicker")}</p>
          <h2 id="projects-showcase-title">{t("projects.showcaseTitle")}</h2>
        </header>

        <motion.div 
          className="premium-portfolio-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolio.map((project, index) => (
            <motion.article 
              variants={itemVariants}
              className={`premium-portfolio-card ${portfolioKeys[index].layoutClass}`} 
              key={project.title} 
              id={`project-${index}`}
            >
              <figure className="premium-portfolio-figure">
                <img src={project.image} alt={`${project.title} reference`} loading="lazy" />
                <div className="premium-portfolio-overlay">
                  <span className="premium-portfolio-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="premium-portfolio-info">
                    <div className="premium-portfolio-topline">
                      <span className="premium-portfolio-cat">{t(portfolioKeys[index].catKey)}</span>
                      <span className="premium-portfolio-year">{project.year}</span>
                    </div>
                    <h3>{t(portfolioKeys[index].titleKey)}</h3>
                    <p>{t(portfolioKeys[index].bodyKey)}</p>
                  </div>
                  <button
                    className="premium-portfolio-action"
                    type="button"
                    aria-label={`${t("projects.viewProject")}: ${t(portfolioKeys[index].titleKey)}`}
                    onClick={() => openProject(index)}
                  >
                    <span>{t("projects.viewProject")}</span>
                    <ArrowIcon />
                  </button>
                </div>
              </figure>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="premium-project-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-popup-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeProject();
            }}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
          >
            <motion.div
              className="premium-project-modal-content"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 40, scale: reduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <button 
                className="premium-project-modal-close" 
                type="button" 
                onClick={closeProject}
                aria-label={t("projects.gallery.close")}
                autoFocus
              >
                <span aria-hidden="true">✕</span>
              </button>

              <div className="premium-project-modal-layout">
                <section className="premium-project-gallery">
                  <div className="premium-gallery-header">
                    <span>{t("projects.gallery.eyebrow")}</span>
                    <span>{String(activeSlide + 1).padStart(2, "0")} / {String(galleryFrames.length).padStart(2, "0")}</span>
                  </div>

                  <div className="premium-gallery-stage">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.figure
                        className="premium-gallery-slide"
                        key={`${activeProject.title}-${activeSlide}`}
                        drag={reduceMotion ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.14}
                        onDragEnd={(_, info) => {
                          if (Math.abs(info.offset.x) < 55 && Math.abs(info.velocity.x) < 450) return;
                          moveSlide(info.offset.x < 0 ? 1 : -1);
                        }}
                        initial={{ opacity: 0, x: reduceMotion ? 0 : slideDirection * 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: reduceMotion ? 0 : slideDirection * -40, scale: 0.98 }}
                        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <img
                          className="premium-gallery-image"
                          src={activeProject.image}
                          alt={`${t(activeProjectKeys.titleKey)} - ${t(galleryFrames[activeSlide].labelKey)}`}
                          draggable="false"
                          style={{
                            objectFit: galleryFrames[activeSlide].fit,
                            objectPosition: galleryFrames[activeSlide].position,
                          }}
                        />
                        <figcaption className="premium-gallery-caption">
                          <strong>{t(galleryFrames[activeSlide].labelKey)}</strong>
                          <p>{activeSlide === 0 ? t(activeProjectKeys.bodyKey) : t(galleryFrames[activeSlide].noteKey)}</p>
                        </figcaption>
                      </motion.figure>
                    </AnimatePresence>

                    <button className="premium-gallery-arrow prev" type="button" onClick={() => moveSlide(-1)} aria-label={t("projects.gallery.previous")}>
                      <span aria-hidden="true">&#8249;</span>
                    </button>
                    <button className="premium-gallery-arrow next" type="button" onClick={() => moveSlide(1)} aria-label={t("projects.gallery.next")}>
                      <span aria-hidden="true">&#8250;</span>
                    </button>
                  </div>

                  <div className="premium-gallery-thumbs" role="tablist" aria-label={t("projects.gallery.select")}>
                    {galleryFrames.map((frame, index) => (
                      <button
                        key={frame.labelKey}
                        className={index === activeSlide ? "is-active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={index === activeSlide}
                        onClick={() => showSlide(index)}
                      >
                        <img src={activeProject.image} alt="" style={{ objectFit: frame.fit, objectPosition: frame.position }} />
                        <span>{t(frame.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="premium-project-details">
                  <div className="premium-project-meta">
                    <span className="premium-project-cat">{t(activeProjectKeys.catKey)}</span>
                    <span className="premium-project-count">{String(activeProjectIndex + 1).padStart(2, "0")} / {String(portfolio.length).padStart(2, "0")}</span>
                  </div>
                  <h2 id="project-popup-title">{t(activeProjectKeys.titleKey)}</h2>
                  <p className="premium-project-full-desc">{t(activeProjectKeys.bodyKey)}</p>

                  <dl className="premium-project-facts">
                    <div>
                      <dt>{t("projects.gallery.client")}</dt>
                      <dd>{activeProject.customer}</dd>
                    </div>
                    <div>
                      <dt>{t("projects.gallery.year")}</dt>
                      <dd>{activeProject.year}</dd>
                    </div>
                  </dl>

                  <div className="premium-project-highlights">
                    <h3>{t("projects.gallery.highlights")}</h3>
                    <ul>
                      <li>{t("projects.popup.bullet1")}</li>
                      <li>{t("projects.popup.bullet2")}</li>
                      <li>{t("projects.popup.bullet3")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



function TurnstileField({ onVerified, onExpired, onUnavailable }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) return undefined;

    let cancelled = false;
    let widgetId = null;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: "contact",
          theme: "dark",
          size: "flexible",
          appearance: "interaction-only",
          retry: "auto",
          "refresh-expired": "auto",
          callback: onVerified,
          "expired-callback": onExpired,
          "timeout-callback": onExpired,
          "error-callback": onUnavailable,
        });
      })
      .catch(onUnavailable);

    return () => {
      cancelled = true;
      if (widgetId !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // The widget may already have removed itself after an expired challenge.
        }
      }
    };
  }, [onExpired, onUnavailable, onVerified]);

  return <div ref={containerRef} className="turnstile-widget" />;
}

function ContactPage({ isSending, onSubmit }) {
  const [topic, setTopic] = useState("general");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [challengeVersion, setChallengeVersion] = useState(0);
  const [isVerified, setIsVerified] = useState(!TURNSTILE_SITE_KEY);
  const [challengeUnavailable, setChallengeUnavailable] = useState(false);
  const { t } = useLang();

  const handleVerified = useCallback(() => {
    setIsVerified(true);
    setChallengeUnavailable(false);
  }, []);
  const handleExpired = useCallback(() => setIsVerified(false), []);
  const handleUnavailable = useCallback(() => {
    setIsVerified(false);
    setChallengeUnavailable(true);
  }, []);

  async function handleSubmit(event) {
    const completed = await onSubmit(event);
    setStartedAt(Date.now());
    if (TURNSTILE_SITE_KEY) {
      setIsVerified(false);
      setChallengeUnavailable(false);
      setChallengeVersion((current) => current + 1);
    }
    return completed;
  }

  return (
    <PageFrame
      kicker={t("contact.kicker")}
      title={t("contact.title")}
      text={t("contact.desc")}
    >
      <section className="section contact-layout">
        <div className="contact-note reveal">
          <img src={logo} alt="SIS Siam Infinity Solution logo" />
          <h2>{t("contact.tellUs")}</h2>
          <p>{t("contact.tellUsDesc")}</p>
          <hr />
          <p><strong>{t("contact.company")}</strong></p>
          <p>{t("contact.address")}</p>
          <p>{t("contact.tel")}</p>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps?q=111/2+Ramkhamhaeng+94+Alley+Saphan+Sung+Bangkok+10240&output=embed&z=15"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SIS office location"
            />
          </div>
        </div>
        <form className="contact-form reveal" onSubmit={handleSubmit} aria-busy={isSending}>
          <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="started_at" value={startedAt} />
          <label>
            {t("form.subject")}
            <select
              className="contact-select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              name="subject"
            >
              <option value="general">{t("form.contactServices")}</option>
              <option value="product">{t("form.askProducts")}</option>
              <option value="support">{t("form.support")}</option>
              <option value="other">{t("form.other")}</option>
            </select>
          </label>

          {topic === "product" ? (
            <>
              <label>
                {t("form.productInterested")}
                <select className="contact-select" name="product" required>
                  <option value="">{t("form.selectProduct")}</option>
                  <option value="gate">{t("form.fareGate")}</option>
                  <option value="afc">{t("form.afcIntegration")}</option>
                  <option value="field">{t("form.fieldExecution")}</option>
                </select>
              </label>
              <label>
                {t("form.companyLabel")}
                <input name="company" type="text" autoComplete="organization" maxLength="200" required />
              </label>
            </>
          ) : topic === "support" ? (
            <>
              <label>
                {t("form.station")}
                <input name="station" type="text" maxLength="200" placeholder={t("form.stationPlaceholder")} required />
              </label>
              <label>
                {t("form.device")}
                <input name="device" type="text" maxLength="200" placeholder={t("form.devicePlaceholder")} />
              </label>
            </>
          ) : null}

          <label>
            {t("form.name")}
            <input name="name" type="text" autoComplete="name" minLength="2" maxLength="120" required />
          </label>
          <label>
            {t("form.emailOrPhone")}
            <input name="contact" type="text" autoComplete="email" inputMode="email" maxLength="190" required />
          </label>
          <label>
            {t("form.messages")}
            <textarea
              name="message"
              rows={topic === "general" ? 5 : 3}
              minLength="10"
              maxLength="5000"
              placeholder={
                topic === "product" ? t("form.productPlaceholder")
                  : topic === "support" ? t("form.supportPlaceholder")
                  : t("form.generalPlaceholder")
              }
              required
            />
          </label>
          {TURNSTILE_SITE_KEY ? (
            <div className="turnstile-shell">
              <TurnstileField
                key={challengeVersion}
                onVerified={handleVerified}
                onExpired={handleExpired}
                onUnavailable={handleUnavailable}
              />
              <p className={challengeUnavailable ? "turnstile-note is-error" : "turnstile-note"} role={challengeUnavailable ? "alert" : undefined}>
                {challengeUnavailable ? t("form.securityUnavailable") : t("form.securityProtected")}
              </p>
            </div>
          ) : null}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSending || (Boolean(TURNSTILE_SITE_KEY) && (!isVerified || challengeUnavailable))}
          >
            {isSending ? t("form.sending") : t("form.sendMessage")}
            <ArrowIcon />
          </button>
        </form>
      </section>
    </PageFrame>
  );
}

function ProcessSection({ navigate }) {
  const { t } = useLang();

  const processCardsData = [
    {
      icon: Wrench,
      titleEn: "REPAIR & MAINTENANCE",
      badgeKey: "process.step1.badge",
      descKey: "process.step1.desc",
    },
    {
      icon: Monitor,
      titleEn: "PRODUCTS & AFC SOLUTIONS",
      badgeKey: "process.step2.badge",
      descKey: "process.step2.desc",
    },
    {
      icon: DoorOpen,
      titleEn: "DEPLOYMENT & INSTALLATION",
      badgeKey: "process.step3.badge",
      descKey: "process.step3.desc",
    },
    {
      icon: Headphones,
      titleEn: "CONSULTING & ARCHITECTURE",
      badgeKey: "process.step4.badge",
      descKey: "process.step4.desc",
    },
  ];

  return (
    <section className="services-pro-max-section" aria-labelledby="services-promax-title">
      <header className="services-pro-max-header reveal">
        <span className="services-pro-max-kicker">
          {t("process.kicker")}
        </span>
        <h2 id="services-promax-title" className="services-pro-max-title">
          {t("process.title")}
        </h2>
      </header>
      <div className="services-pro-max-grid reveal">
        {processCardsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.titleEn}
              className="services-pro-max-card"
              onClick={() => navigate("services", `service-${index}`)}
            >
              <div className="services-pro-max-card-accent" />
              <div className="services-pro-max-card-top">
                <div className="services-pro-max-icon-box">
                  <Icon size={20} />
                </div>
                <span className="services-pro-max-badge">{t(item.badgeKey)}</span>
              </div>
              <h3 className="services-pro-max-card-title">{item.titleEn}</h3>
              <p className="services-pro-max-card-desc">{t(item.descKey)}</p>
              <div className="services-pro-max-card-footer">
                <span>Learn More</span>
                <div className="services-pro-max-arrow-btn">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          );
        })}
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


function AllCategoriesOverview({ navigate }) {
  const { t } = useLang();
  return (
    <section className="sub-page product-details-page">
      <div className="product-breadcrumb">
        <span>{t("products.home")}</span>
        <span className="sep">/</span>
        <span className="current">{t("nav.products")}</span>
      </div>
      <div className="category-header">
        <h1>{t("products.allCategories")}</h1>
        <p>{t("products.allCategoriesDesc")}</p>
      </div>
      <div className="product-grid">
        {productCategories.map(cat => {
          const firstProduct = cat.groups
            ?.flatMap((group) => group.products)
            .find((product) => product.img);
          return (
          <RouteLink key={cat.id} navigate={navigate} to="products" param={`category/${cat.id}`} className="product-card">
            <div className="product-card-img">
              {firstProduct?.img ? (
                <img src={firstProduct.img} alt={cat.label} decoding="async" />
              ) : (
                <div className="placeholder-img">{cat.label[0]}</div>
              )}
            </div>
            <div className="product-card-info">
              <h3>{cat.label}</h3>
              <p>{cat.groups.length} {t("products.productGroups")}</p>
            </div>
          </RouteLink>
        )})}
      </div>
    </section>
  );
}

function CategoryOverview({ catId, navigate }) {
  const { t } = useLang();
  const category = productCategories.find(c => c.id === catId);
  if (!category) return <NotFoundPage navigate={navigate} />;

  return (
    <section className="sub-page product-details-page">
      <div className="product-breadcrumb">
        <span>{t("products.home")}</span>
        <span className="sep">/</span>
        <RouteLink navigate={navigate} to="products">{t("nav.products")}</RouteLink>
        <span className="sep">/</span>
        <span className="current">{category.label}</span>
      </div>
      <div className="category-header">
        <h1>{category.label}</h1>
        <p>{categoryBlurbs[category.id]}</p>
      </div>
      
      {category.groups.map(group => (
        <div key={group.name} className="group-section">
          <div className="group-section-header">
            <h2>{group.name}</h2>
            <RouteLink navigate={navigate} to="products" param={groupRoute(category.id, group.name)} className="view-all-link">
              {t("products.viewAllArrow")}
            </RouteLink>
          </div>
          <div className="product-grid">
            {group.products.slice(0, 4).map(product => (
              <RouteLink key={product.model} navigate={navigate} to="products" param={productRoute(category.id, product.model)} className="product-card">
                <div className="product-card-img">
                  {product.img ? (
                    <img src={product.img} alt={product.model} decoding="async" />
                  ) : (
                    <span className="placeholder">{product.model[0]}</span>
                  )}
                </div>
                <div className="product-card-info">
                  <h3>{product.model}</h3>
                  <p>{product.name}</p>
                </div>
              </RouteLink>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function GroupOverview({ selection, navigate }) {
  const { t } = useLang();
  if (!selection) return <NotFoundPage navigate={navigate} />;
  const { category: parentCat, group: foundGroup } = selection;

  return (
    <section className="sub-page product-details-page">
      <div className="product-breadcrumb">
        <span>{t("products.home")}</span>
        <span className="sep">/</span>
        <RouteLink navigate={navigate} to="products">{t("nav.products")}</RouteLink>
        <span className="sep">/</span>
        <RouteLink navigate={navigate} to="products" param={`category/${parentCat.id}`}>{parentCat.label}</RouteLink>
        <span className="sep">/</span>
        <span className="current">{foundGroup.name}</span>
      </div>
      <div className="category-header">
        <h1>{foundGroup.name}</h1>
        <p>{t("products.exploreAll")} {foundGroup.name} {t("products.category")}.</p>
      </div>
      <div className="product-grid">
        {foundGroup.products.map(product => (
          <RouteLink key={product.model} navigate={navigate} to="products" param={productRoute(parentCat.id, product.model)} className="product-card">
            <div className="product-card-img">
              {product.img ? (
                <img src={product.img} alt={product.model} decoding="async" />
              ) : (
                <span className="placeholder">{product.model[0]}</span>
              )}
            </div>
            <div className="product-card-info">
              <h3>{product.model}</h3>
              <p>{product.name}</p>
            </div>
          </RouteLink>
        ))}
      </div>
    </section>
  );
}

function ProductDetails({ selection, navigate }) {
  const [activeTab, setActiveTab] = useState("features");
  const { t } = useLang();
  const currentProduct = selection?.product;
  const currentCategory = selection?.category;

  if (!currentProduct) {
    return <NotFoundPage navigate={navigate} />;
  }

  const isBnaProduct = currentCategory.id === "bna";
  const bnaPartCode = isBnaProduct
    ? currentProduct.model.match(/^[A-Z]+(?:\d[\w-]*|-\d[\w-]*)/)?.[0]
    : null;
  const displayModel = bnaPartCode || currentProduct.model;
  const heroFeatures = isBnaProduct
    ? [1, 2, 3, 4].map((number) => t(`bna.feature${number}`))
    : [1, 2, 3, 4].map((number) => t(`product.feature${number}`));

  return (
    <section className="sub-page product-details-page">
      <div className="product-breadcrumb">
        <span>{t("products.home")}</span>
        <span className="sep">/</span>
        <RouteLink navigate={navigate} to="products">{t("nav.products")}</RouteLink>
        <span className="sep">/</span>
        <RouteLink navigate={navigate} to="products" param={`category/${currentCategory.id}`}>{currentCategory.label}</RouteLink>
        <span className="sep">/</span>
        <span className="current">{displayModel}</span>
      </div>

      <div className="product-hero">
        <div className="product-hero-image">
          {currentProduct.img ? (
            <img src={currentProduct.img} alt={currentProduct.model} decoding="async" fetchPriority="high" />
          ) : (
            <div className="placeholder-img">{currentCategory.label[0]}</div>
          )}
        </div>
        <div className={`product-hero-info${isBnaProduct ? " is-bna" : ""}`}>
          <h1>{displayModel}</h1>
          <h2>{currentProduct.name}</h2>
          <p className="product-hero-desc">{currentProduct.desc}</p>
          <ul className="product-hero-features">
            {heroFeatures.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <div className="product-hero-actions">
            <button type="button" className="btn-inquiry" onClick={() => navigate("contact")}>{t("products.inquiry")}</button>
            <a href={currentProduct.pdfUrl || currentProduct.url} target="_blank" rel="noopener noreferrer" className="btn-download" style={{textDecoration: "none", display: "inline-flex", alignItems: "center"}}>{t("products.datasheet")}</a>
          </div>
        </div>
      </div>

      <div className="product-tabs-section">
        <div className="product-tabs-nav">
          <button className={activeTab === "features" ? "is-active" : ""} onClick={() => setActiveTab("features")}>{t("products.features")}</button>
          <button className={activeTab === "specs" ? "is-active" : ""} onClick={() => setActiveTab("specs")}>{t("products.specs")}</button>
          <button className={activeTab === "ordering" ? "is-active" : ""} onClick={() => setActiveTab("ordering")}>{t("products.ordering")}</button>
        </div>
        <div className="product-tabs-content">
          <div className={`tab-pane ${activeTab === "features" ? "active" : ""}`}>
            <h3>{t("products.keyFeatures")}</h3>
            <p>{t("products.keyFeaturesDesc")} <strong>{currentProduct.model}</strong></p>
          </div>
          <div className={`tab-pane ${activeTab === "specs" ? "active" : ""}`}>
            <h3>{t("products.techSpecs")}</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <th>{t("products.formFactor")}</th>
                  <td>{currentProduct.name}</td>
                </tr>
                <tr>
                  <th>{t("products.processor")}</th>
                  <td>{t("products.processorValue")}</td>
                </tr>
                <tr>
                  <th>{t("products.memory")}</th>
                  <td>Up to 64GB DDR4/DDR5</td>
                </tr>
                <tr>
                  <th>{t("products.networking")}</th>
                  <td>{t("products.networkingValue")}</td>
                </tr>
                <tr>
                  <th>{t("products.operatingTemp")}</th>
                  <td>{t("products.operatingTempValue")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`tab-pane ${activeTab === "ordering" ? "active" : ""}`}>
            <h3>{t("products.orderingTitle")}</h3>
            <p>{t("products.orderingDesc")} <strong>{currentProduct.model}</strong></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsPage({ productModel, navigate }) {
  if (!productModel || productModel === "all") {
    return <AllCategoriesOverview navigate={navigate} />;
  }

  const [type, id] = productModel.split("/");

  if (type === "category") return <CategoryOverview catId={id} navigate={navigate} />;
  if (type === "group") return <GroupOverview selection={resolveGroupRoute(productModel)} navigate={navigate} />;
  if (type === "model" || !productModel.includes("/")) {
    return <ProductDetails selection={resolveProductRoute(productModel)} navigate={navigate} />;
  }

  return <NotFoundPage navigate={navigate} />;
}

function NotFoundPage({ navigate }) {
  const { t } = useLang();
  return (
    <section className="sub-page system-message-page">
      <div className="system-message-card">
        <p className="section-kicker">404</p>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.desc")}</p>
        <button className="btn btn-primary" type="button" onClick={() => navigate("home")}>
          {t("notFound.action")}
        </button>
      </div>
    </section>
  );
}

function Footer({ navigate, compact = false }) {
  const { t } = useLang();
  return (
    <footer className={`site-footer${compact ? " site-footer--compact" : ""}`}>
      <div className="footer-brand">
        <img src={logo} alt="SIS Siam Infinity Solution logo" />
        <p>{t("footer.desc")}</p>
        <p className="footer-contact">
          {t("footer.company")}<br />
          {t("footer.address")}<br />
          {t("footer.tel")}
        </p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => navigate(item.id)}>
            {t(item.labelKey)}
          </button>
        ))}
      </nav>
      <small>{t("footer.copyright")}</small>
    </footer>
  );
}

export default App;
