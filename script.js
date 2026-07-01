const routes = new Set(["home", "about", "services", "product", "careers", "contact"]);
const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const navPanel = document.querySelector("[data-nav-panel]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const transitionMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360;

let currentRoute = "home";
let isRouting = false;
let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function routeFromHash() {
  const route = window.location.hash.replace("#", "").trim();
  return routes.has(route) ? route : "home";
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "default";
  root.dataset.theme = nextTheme;
  localStorage.setItem("sis-theme", nextTheme);
  themeLabel.textContent = nextTheme === "dark" ? "Dark" : "Default";
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    nextTheme === "dark" ? "#06101e" : "#ffffff",
  );
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function resetReveals(page) {
  page.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.observe(element);
  });
}

async function showRoute(route, options = {}) {
  if (!routes.has(route)) {
    route = "home";
  }

  const targetPage = document.querySelector(`[data-page="${route}"]`);
  const activePage = document.querySelector(".page.is-active");

  closeMenu();

  if (!targetPage || isRouting) {
    return;
  }

  if (route === currentRoute) {
    updateActiveNav(route);
    scrollToFocusedSection(options.focusSection);
    return;
  }

  isRouting = true;
  body.classList.add("is-transitioning");

  await delay(transitionMs * 0.72);

  activePage?.classList.remove("is-active");
  activePage?.setAttribute("hidden", "");
  targetPage.removeAttribute("hidden");
  targetPage.classList.add("is-active");
  currentRoute = route;
  updateActiveNav(route);
  resetReveals(targetPage);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  updateScrollEffects();

  if (options.focusSection) {
    await delay(80);
    scrollToFocusedSection(options.focusSection);
  }

  await delay(transitionMs);
  body.classList.remove("is-transitioning");
  isRouting = false;
}

function scrollToFocusedSection(sectionId) {
  if (!sectionId) {
    return;
  }

  const section = document.getElementById(sectionId);
  section?.scrollIntoView({ behavior: transitionMs ? "smooth" : "auto", block: "start" });
}

function handleRouteClick(event) {
  const target = event.target.closest("[data-route]");
  if (!target) {
    return;
  }

  const route = target.dataset.route;
  if (!routes.has(route)) {
    return;
  }

  event.preventDefault();
  const focusSection = target.dataset.focusSection;
  const nextHash = `#${route}`;

  if (window.location.hash !== nextHash) {
    history.pushState(null, "", nextHash);
  }

  showRoute(route, { focusSection });
}

function updateScrollEffects() {
  const y = window.scrollY;
  header?.classList.toggle("is-compact", y > 18);

  document.querySelectorAll(".page.is-active .zoom-media").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight || 1;

    if (element.classList.contains("hero-media")) {
      const progress = clamp(y / viewport, 0, 1);
      element.style.setProperty("--zoom", (1.06 + progress * 0.13).toFixed(3));
      element.style.setProperty("--shift", `${(progress * 54).toFixed(1)}px`);
      return;
    }

    const centerDistance = Math.abs(rect.top + rect.height / 2 - viewport / 2);
    const visibility = 1 - clamp(centerDistance / viewport, 0, 1);
    element.style.setProperty("--zoom", (1 + visibility * 0.045).toFixed(3));
  });
}

function requestScrollTick() {
  if (ticking) {
    return;
  }

  ticking = true;
  requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12,
  },
);

const IMG_BASE = "https://www.ibase.com.tw/uploads/images/products/Small_255x170px/";
const IBASE_BASE = "https://www.ibase.com.tw/en/product/category/";

const productData = [
  {
    name: "Embedded Computing",
    slug: "Embedded_Computing",
    sub: [
      {
        name: "Motherboard",
        slug: "Motherboard",
        types: [
          { name: "Mini-ITX Motherboard", slug: "Mini-ITX_Motherboard", product: "MI1005", img: "small_MI1005.png", desc: "มาเธอร์บอร์ด Mini-ITX รองรับ Intel® Core™ Ultra 200H/200U (Arrow Lake-U/H) ประสิทธิภาพสูง ประหยัดพลังงาน เหมาะกับระบบอุตสาหกรรมขนาดกะทัดรัด" },
          { name: "ATX Motherboard", slug: "ATX_Motherboard", product: "MBB1005", img: "small_MBB1005.png", desc: "มาเธอร์บอร์ด ATX รองรับ Intel® Core™ Ultra 200S (Arrow Lake-S) สำหรับงานเดสก์ท็อปอุตสาหกรรมที่ต้องการพลังประมวลผลสูง" },
          { name: "Micro ATX Motherboard", slug: "Micro_ATX_Motherboard", product: "MB998", img: "small_MB998.png", desc: "มาเธอร์บอร์ด Micro ATX รองรับ Intel® Core™ 200E/200PE และ Gen 14/13/12 LGA1700 คุ้มค่าและขยายระบบได้ยืดหยุ่น" },
          { name: "PICO-ITX Motherboard", slug: "PICO_ITX_Motherboard", product: "PI800", img: "small_PI800.png", desc: "มาเธอร์บอร์ด PICO-ITX ขนาดเล็กพิเศษ รองรับ Intel® Atom® x7000RE Series (Amston Lake) สำหรับพื้นที่จำกัด" },
        ],
      },
      {
        name: "Single Board Computer",
        slug: "Single_Board_Computer",
        types: [
          { name: "x86-based 3.5\"", slug: "x86_based_3_5_Single_Board_Computer", product: "IB962", img: "small_IB962_.png", desc: "บอร์ดคอมพิวเตอร์ขนาด 3.5 นิ้ว รองรับ Intel® Core™ Ultra 7/5 รุ่น 100 Series Mobile Processor" },
          { name: "x86-based 2.5\"", slug: "x86_based_2_5_Single_Board_Computer", product: "IB200", img: "small_IB200.png", desc: "บอร์ดคอมพิวเตอร์ขนาด 2.5 นิ้ว รองรับ AMD Ryzen™ Embedded R2000 Series ประหยัดพลังงานสูง" },
          { name: "ARM-based 3.5\"", slug: "ARM_based_3_5_Single_Board_Computer", product: "IBR117", img: "IBR117_255X170px.png", desc: "บอร์ดคอมพิวเตอร์ 3.5 นิ้ว ใช้โปรเซสเซอร์ NXP ARM® Cortex-A9 i.MX 6 Dual 1GHz" },
          { name: "ARM-based 2.5\"", slug: "ARM_based_2_5_Single_Board_Computer", product: "IBR215", img: "small_IBR215.png", desc: "บอร์ดคอมพิวเตอร์ 2.5 นิ้ว ใช้โปรเซสเซอร์ NXP ARM® Cortex-A53 i.MX 8M Plus Quad 1.6GHz" },
        ],
      },
      {
        name: "CPU Module",
        slug: "CPU_Module",
        types: [
          { name: "COM Express", slug: "COM_Express", product: "ET981", img: "small_ET981.png", desc: "COM Express Type 6 (R3.0) CPU Module รองรับ Intel® Core™ P-Series Gen 13" },
          { name: "Qseven", slug: "QSeven", product: "IBQ800", img: "small_IBQ800.jpg", desc: "Qseven (R2.1) CPU Module รองรับ Intel® Atom® x7/x5 Processors" },
          { name: "ETX", slug: "ETX", product: "ET839", img: "small_ET839.png", desc: "ETX CPU Module รองรับ Intel® Atom® E3845 Processor ประหยัดพลังงาน" },
        ],
      },
      {
        name: "CPU Card",
        slug: "CPU_Card",
        types: [
          { name: "Full-Size CPU Card", slug: "Full-Size_CPU_Card", product: "IB996", img: "small_IB996.png", desc: "Full-Size CPU Card รองรับ Intel® Core™ DT Gen 14/13/12 (RPL-S Refresh Platform)" },
        ],
      },
      {
        name: "Carrier board",
        slug: "Carrier_board",
        types: [
          { name: "COM Express", slug: "COM_Express_Type_6", product: "IP419", img: "small_IP419.jpg", desc: "COM Express Type 6 (R3.0) Carrier Board รองรับการขยายระบบแบบโมดูลาร์" },
          { name: "Qseven", slug: "Qseven", product: "IP416", img: "small_IP416.jpg", desc: "Qseven Carrier Board สำหรับงานฝังตัวขนาดกะทัดรัด" },
          { name: "ETX", slug: "ETX_Carrier_Board", product: "IP412", img: "small_IP412.jpg", desc: "ETX (3.0) Carrier Board รองรับโมดูล ETX มาตรฐานอุตสาหกรรม" },
        ],
      },
      {
        name: "Accessories",
        slug: "Accessories",
        types: [
          { name: "Mini PCI-E Card", slug: "Mini_PCI-E_Cards_for_Expansion", product: "IBD Series", img: "small_IBDSeries.jpg", desc: "Mini PCI-E Cards สำหรับขยายฟังก์ชันการเชื่อมต่อของระบบ" },
          { name: "M.2 Card", slug: "M_2_Card", product: "IMD Series", img: "small_M_2_Cards_.png", desc: "M.2 Cards สำหรับขยายระบบจัดเก็บข้อมูลและการเชื่อมต่อ" },
          { name: "Embedded Function Card", slug: "Embedded_Function_Card", product: "ID Series", img: "small_DaughterBoard.jpg", desc: "Daughter Board (ID Series) การ์ดฟังก์ชันเสริมสำหรับระบบฝังตัว" },
        ],
      },
    ],
  },
  {
    name: "Edge AI & Intelligent System",
    slug: "Edge_AI_Intelligent_System",
    sub: [
      {
        name: "AI Computing Platform",
        slug: "AI_Computing_Platform",
        types: [
          { name: "Edge AI Computer", slug: "Edge_AI_Computer", product: "EC3020", img: "small_EC3020.png", desc: "Edge AI Computer พร้อม NVIDIA® Jetson Orin™ NX และ Orin™ Nano Series สำหรับงาน AI ที่หน้างานจริง" },
          { name: "Edge AI Server", slug: "Edge_AI_Server", product: "ES1002", img: "small_ES1002.png", desc: "Edge AI Server ใช้ AMD EPYC™ Embedded 8004 Series สำหรับงานประมวลผล AI ขนาดใหญ่" },
          { name: "AI Edge Board", slug: "AI_Edge_Board", product: "MI1005", img: "small_MI1005.png", desc: "AI Edge Board รองรับ Intel® Core™ Ultra 200H/200U Series Mobile Processors" },
        ],
      },
      {
        name: "Edge Computing / Wide Temp System",
        slug: "Edge_Computing_Wide_Temperature_System",
        types: [
          { name: "AGS Series", slug: "AGS_Series_IoT_Gateway_Edge_Computing_System", product: "AGS104T", img: "small_AGS104T.png", desc: "IoT Gateway Edge Computing System ขนาดกะทัดรัด รองรับ Intel® Atom® x7433RE/x7211RE" },
          { name: "ACS Series", slug: "ACS_Series_Advanced_Compact_Embedded_System", product: "ACS413", img: "small_ACS413.png", desc: "Advanced Compact System รองรับ Intel® Core™ i7/i5/i3 Gen 13" },
          { name: "ARS Series", slug: "ARS_Series_Advanced_Ruggedized_System", product: "ARS200", img: "small_ARS200.png", desc: "Advanced Ruggedized Waterproof Outdoor Computer รองรับ Intel® Core™ U-series Gen 14/13" },
        ],
      },
      {
        name: "Automatic Control System",
        slug: "Automatic_Control_System",
        types: [
          { name: "Automatic Control System", slug: "Automatic_Control_System", product: "AMS210", img: "small_AMS210.png", desc: "Automatic Control System รองรับ Intel® Core™ Gen 9/8 สำหรับระบบควบคุมอัตโนมัติ" },
        ],
      },
      {
        name: "Expandable Embedded System",
        slug: "Expandable_Embedded_System",
        types: [
          { name: "AES Series", slug: "AES_Series_Advanced_Expandable_System", product: "AES100", img: "small_AES100.png", desc: "Advanced Expandable System รองรับ Intel® Core™ i9/i7/i5/i3 Desktop Gen 14/13" },
          { name: "AMI Series", slug: "AMI_Series_Expandable_Fanless_System", product: "AMI242", img: "small_AMI242.png", desc: "Expandable Fanless System รองรับ Intel® Core™ i9/i7/i5/i3 Gen 14/13 (35W TDP)" },
          { name: "CMB Series", slug: "CMB_Series_Expandable_System", product: "CMB108", img: "small_CMB108.png", desc: "High Performance Expandable Industrial Computer รองรับ Intel® Core™ Gen 14/13/12 (TDP 65W)" },
        ],
      },
      {
        name: "Mini-ITX System",
        slug: "Mini_ITX_System",
        types: [
          { name: "CMI Series", slug: "CMI_Series_System_with_IBASE_Mini_ITX", product: "CMI300-1001", img: "small_CMI300-1001.png", desc: "Slim System พร้อมมาเธอร์บอร์ด IBASE MI1001AF Mini-ITX" },
        ],
      },
      {
        name: "PICO-ITX System",
        slug: "PICO_ITX_System",
        types: [
          { name: "ASB Series", slug: "ASB_Series", product: "ASB100-PI800", img: "small_ASB100-PI800.png", desc: "Palm-Sized Fanless System รองรับ Intel® Atom™ x7433RE Processor" },
          { name: "CP Series", slug: "CP_Series_Edge_Computer_with_IBASE_2_5_PICO_ITX_Board", product: "CP100", img: "small_CP100.png", desc: "Palm-Sized Fanless System รองรับ AMD Ryzen™ Embedded R2000 Series" },
        ],
      },
      {
        name: "SBC System",
        slug: "SBC_System",
        types: [
          { name: "ASB Series (3.5\" SBC)", slug: "ASB_Series_Fanless_System_with_IBASE_3_5_SBC", product: "ASB210-962H", img: "small_ASB210-962H.png", desc: "Compact System รองรับ Intel® Core™ Ultra 100H Series Mobile Processor" },
          { name: "CSB Series", slug: "CSB_Series_Slim_System_with_IBASE_3_5_SBC", product: "CSB200-818", img: "small_CSB200-818.jpg", desc: "Fanless System รองรับ Intel® Atom® E3940/E3930 & Pentium® N4200/Celeron® N3350" },
        ],
      },
    ],
  },
  {
    name: "Digital Signage Player",
    slug: "Digital_Signage_Player",
    sub: [
      {
        name: "Entry-Level Signage Player",
        slug: "Entry_Level_Signage_Player",
        types: [
          { name: "2 Display Outputs", slug: "2_Display_Outputs_Signage_Player", product: "SI-212-N", img: "small_SI-212-N.png", desc: "Fanless Signage Player 2x HDMI 2.0 รองรับ Intel® Atom® x7000E/x7000RE/N-series" },
          { name: "1 Display Output", slug: "1_Display_Outputs", product: "SI-121-N", img: "small_SI-121-N.png", desc: "Fanless Signage Player รองรับ Intel® Core® N-Series (Twin Lake) พร้อม HDMI 2.0b" },
        ],
      },
      {
        name: "Mid-Range Signage Player",
        slug: "Mid_Range_Signage_Player",
        types: [
          { name: "4 Display Outputs", slug: "4_Display_Outputs", product: "SI-664-N", img: "small_SI-664-N.png", desc: "Fanless Signage Player รองรับ Intel® Core™ Ultra Series 1 (Meteor Lake) พร้อม HDMI 2.1/2.0b" },
          { name: "3 Display Outputs", slug: "3_Display_Outputs", product: "SI-663-N", img: "small_SI-663-N.png", desc: "Fanless Signage Player รองรับ Intel® Core™ Gen 13/12 พร้อม HDMI/DP/DVI-D" },
        ],
      },
      {
        name: "Extreme Performance Signage Player",
        slug: "Extreme_Performance_Signage_Player",
        types: [
          { name: "16 Display Outputs", slug: "16_Display_Outputs", product: "SP-63ER", img: "small_SP-63E_ER.png", desc: "Video Wall Signage Player รองรับ Intel® Core™ Gen 8 พร้อม MXM Graphics สูงสุด 16x HDMI" },
          { name: "6 Display Outputs", slug: "6_Display_Outputs", product: "SI-636", img: "small_SI-636.png", desc: "Video Wall Signage Player รองรับ Intel® Core™ Gen 13/12 พร้อม 6x HDMI จาก E8860 GPU" },
          { name: "4 Display Outputs", slug: "4_Display_Outputs", product: "SI-624", img: "small_SI-624.png", desc: "Video Wall Signage Player รองรับ Intel® Core™ Gen 13/12 พร้อม NVIDIA MXM Graphics 4x DP" },
        ],
      },
      {
        name: "Outdoor / Waterproof Signage Player",
        slug: "Outdoor_Waterproof_Signage_Player",
        types: [
          { name: "Outdoor Signage Player", slug: "Outdoor_Signage_Player", product: "SE-603-N", img: "small_SE-603-N.png", desc: "Fanless Signage Player รองรับ Intel® Core™/Celeron® U-Series Gen 11 พร้อม HDMI/DP/DVI" },
          { name: "Waterproof Signage Player", slug: "Waterproof_Signage_Player", product: "SW-602-N", img: "small_SW-602-N.png", desc: "Waterproof Fanless Signage Player รองรับ Intel® Core™ Gen 11 พร้อม 2x HDMI" },
        ],
      },
      {
        name: "ARM-based Signage Player",
        slug: "ARM_based_Signage_Player",
        types: [
          { name: "MediaTek Genio-based", slug: "MediaTek_Genio-based_Signage_Player", product: "ISR500", img: "small_ISR500.png", desc: "Ruggedized Fanless Signage Player รองรับ MediaTek Genio 700/510 พร้อม 2x HDMI" },
          { name: "NXP i.MX8M-based", slug: "NXP_i_MX8M_based_Signage_Player", product: "ISR215", img: "small_ISR215.png", desc: "Fanless Signage Player รองรับ NXP i.MX 8M Plus ARM Cortex-A53 Quad พร้อม HDMI 2.0" },
        ],
      },
    ],
  },
  {
    name: "Network Appliance",
    slug: "Network_Appliance",
    sub: [
      {
        name: "Rackmount Network Appliance",
        slug: "Rackmount_Network_Appliance",
        types: [
          { name: "Performance 2U", slug: "Performance_2U_Network_Appliance", product: "INA7605", img: "small_INA7605_Preliminary.png", desc: "Performance 2U Network Appliance รองรับ Dual Intel® Xeon® Scalable Gen 5 สูงสุด 64 GbE Ports" },
          { name: "Performance 1U", slug: "Performance_1U_Network_Appliance", product: "INA7302", img: "small_INA7302.png", desc: "Performance 1U Network Appliance รองรับ AMD Ryzen™ 7000 series สูงสุด 14 GbE Ports" },
          { name: "Enterprise 1U", slug: "Enterprise_1U_Network_Appliance", product: "INA3605", img: "small_INA3605_EOL.png", desc: "Enterprise 1U Network Appliance รองรับ Intel® Xeon® E-2300 สูงสุด 16 GbE Ports" },
          { name: "Mainstream 1U", slug: "Mainstream_1U_Network_Appliance", product: "INA3608", img: "small_INA3606.png", desc: "Mainstream 1U Network Security Server รองรับ Intel® Core™ Gen 14/13/12 สูงสุด 16 GbE + Dual 10G" },
          { name: "Entry 1U", slug: "Entry_1U_Network_Appliance", product: "INA2205", img: "small_INA2205_Preliminary.png", desc: "Entry 1U Network Appliance รองรับ Intel® Atom® (Amston Lake) สูงสุด 8 GbE ports" },
        ],
      },
      {
        name: "uCPE/SD-WAN Appliance",
        slug: "uCPE_SD_WAN_Appliance",
        types: [
          { name: "Desktop uCPE/SD-WAN", slug: "Desktop_uCPE_SD_WAN_Appliance", product: "INA1607", img: "small_INA1607.png", desc: "Desktop uCPE/SD-WAN Appliance รองรับ Intel® Atom® x7405C สูงสุด 2x GbE Ports" },
        ],
      },
      {
        name: "Edge Server",
        slug: "Edge_Server",
        types: [
          { name: "Enterprise 1U Edge Server", slug: "Enterprise_1U_Edge_Server", product: "INA8505", img: "small_INA8505_EOL.png", desc: "Enterprise 1U Edge Server รองรับ Intel® Xeon® D สูงสุด 4x 25 GbE Ports" },
        ],
      },
      {
        name: "Network Interface Modules",
        slug: "Network_Interface_Modules",
        types: [
          { name: "IBN-I2H / IBN-K1H", slug: "IBN_I2H_K1H", product: "IBN-I2H / IBN-K1H", img: "small_IBN-12H-K1H.png", desc: "Network Interface Module รองรับ Intel® Ethernet Controller E830 (Connersville)" },
        ],
      },
    ],
  },
  {
    name: "RISC Platform",
    slug: "RISC_Platform",
    sub: [
      {
        name: "SMARC Module",
        slug: "SMARC_Module",
        types: [
          { name: "NXP SMARC Module", slug: "NXP_i_MX8M_based_SMARC_Module", product: "RM-N95", img: "small_RM-N95.png", desc: "Wide-Temperature SMARC™ 2.2 Module รองรับ NXP i.MX95 Cortex-A55 พร้อม Neutron NPU" },
        ],
      },
      {
        name: "Carrier Board for SMARC Module",
        slug: "Carrier_Board_for_SMARC_Module",
        types: [
          { name: "SMARC 2.1 Carrier Board", slug: "SMARC_2_1_Carrier_Board", product: "RP-103-SMC", img: "small_product_RP_103_1_0.png", desc: "Carrier Board สำหรับ SMARC™ 2.1 CPU Module" },
          { name: "SMARC 1.0 Carrier Board", slug: "SMARC_1_0_Carrier_Board", product: "RP-102-SMC", img: "small_RP-102-SMC.png", desc: "Carrier Board สำหรับ SMARC™ 1.0 CPU Module" },
        ],
      },
      {
        name: "RISC-based Single Board Computer",
        slug: "RISC_based_Single_Board_Computer",
        types: [
          { name: "3.5\" SBC", slug: "3_5_Disk_Size_SBC", product: "IBR500", img: "small_IBR500.png", desc: "Low-Power 3.5\" SBC รองรับ MediaTek Genio 700/MT8390 หรือ Genio 510/MT8370" },
          { name: "2.5\" SBC", slug: "2_5_Disk_Size_SBC", product: "IBR300", img: "small_IBR300.png", desc: "Low-Power 2.5\" SBC รองรับ NXP i.MX 93 ARM Cortex-A55 Dual Core" },
          { name: "Ultra-Compact SBC", slug: "Ultra_Compact_Single_Board_Computer", product: "IBR-SMB", img: "small_IBR-SMB.png", desc: "Ultra-Compact SBC รองรับ NXP ARM® Cortex-A53 i.MX8M Plus Lite" },
        ],
      },
      {
        name: "RISC-based Edge Computing System",
        slug: "RISC_based_Edge_Computing_System",
        types: [
          { name: "Edge Computer", slug: "Edge_Computer", product: "ISR500", img: "small_ISR500.png", desc: "Rugged Edge Computer รองรับ MediaTek Genio 700/MT8390 หรือ Genio 510/MT8370" },
        ],
      },
      {
        name: "ARM-based HMI",
        slug: "ARM_based_HMI",
        types: [
          { name: "IPR Series Industrial HMI", slug: "IPR_Series_Industrial_HMI", product: "IPR-P04F-N", img: "small_IPR-P04F-N.jpg", desc: "Industrial HMI รองรับ TI ARM® Cortex™ A8, Sitara™ AM3352 (1GHz)" },
        ],
      },
    ],
  },
  {
    name: "Panel PC & Touch Monitor",
    slug: "Panel_PC_Touch_Monitor",
    sub: [
      {
        name: "Industrial Modular Panel PC",
        slug: "Industrial_Modular_Panel_PC",
        types: [
          { name: "IXPC Series", slug: "IXPC", product: "IXPC-W270-200", img: "small_product_IXPC_Series.png", desc: "Industrial Modular Panel PC รองรับ Intel® Atom® x7000E/N-series/Core™ 3 N355" },
        ],
      },
      {
        name: "Industrial Panel PC",
        slug: "Industrial_Panel_PC",
        types: [
          { name: "IPPC Series", slug: "IPPC_Series_Compact_Panel_PC", product: "IPPC-W07", img: "small_IPPC-W07.png", desc: "Fanless Panel PC รองรับ Intel® Atom® N150/N97/Core™ 3 N355 พร้อม USB Type-C" },
        ],
      },
      {
        name: "Industrial Touch Monitor",
        slug: "Industrial_Touch_Monitor",
        types: [
          { name: "IPPL Series", slug: "IPPL_Series", product: "IPPL-W270", img: "small_IPPL-W270.png", desc: "Industrial Touch Monitor กันน้ำเต็มรูปแบบ เชื่อมต่อสาย USB Type-C เส้นเดียว" },
        ],
      },
      {
        name: "Outdoor Panel PC",
        slug: "Outdoor_Panel_PC",
        types: [
          { name: "IDOOH Series", slug: "IDOOH_Series_Sunlight_Readable_Panel_PC", product: "IDOOH-215-PC", img: "small_IDOOH-215-PC.png", desc: "Outdoor Sunlight Readable Panel PC 21.5\" รองรับ AMD Ryzen™ Embedded V1605B" },
        ],
      },
      {
        name: "ODM Panel PC",
        slug: "ODM_Panel_PC",
        types: [
          { name: "Smart Retail Panel PC", slug: "Smart_Retail_Panel_PC", product: "OFP-W2700-PCI86", img: "small_OFP-W2700_EOL.png", desc: "Open Frame Panel PC 27\" รองรับ Intel® Core™ i7-8665UE Gen 8" },
          { name: "Compact Panel PC", slug: "Compact_Panel_PC", product: "BYTEM-121-PC", img: "small_BYTEM-121-PC_1.png", desc: "All-in-One Panel PC 12.1\" รองรับ Intel® Atom® E3845" },
          { name: "Medical Panel PC", slug: "Medical_Panel_PC", product: "UMT-7212", img: "small_UMT-7211.png", desc: "Medical Panel PC 21.5\" รองรับ Intel® Core™ i5-6300U Gen 6" },
        ],
      },
    ],
  },
  {
    name: "Intelligent Transportation",
    slug: "Intelligent_Transportation",
    sub: [
      {
        name: "Railway Computer System",
        slug: "Railway_Computer_System",
        types: [
          { name: "MPT-R Series", slug: "MPT_R_Series_EN50155_Certified_Railway_Computer", product: "MPT-7100R", img: "small_MPT-7100R.png", desc: "EN50155/EN45545 Certified Railway Computer รองรับ Intel® Core™ Gen 13 พร้อม M12 และ WWAN Redundancy" },
        ],
      },
      {
        name: "In-Vehicle Computer System",
        slug: "In_Vehicle_Computer_System",
        types: [
          { name: "MPT-V Series", slug: "MPT_V_Series_E_mark_Certified_In_Vehicle_Computer", product: "MPT-3100V", img: "small_MPT-3100V.png", desc: "ITxPT & E-Mark Certified In-Vehicle Edge AI Computer รองรับ Intel® Atom® x7000RE พร้อม WWAN Redundancy" },
        ],
      },
      {
        name: "Railway Panel PC",
        slug: "Transportation_Panel_PC",
        types: [
          { name: "MPPC Series", slug: "MPPC_Series_EN50155_Transportation_Panel_PC", product: "MPPC1501PC", img: "small_MPPC1501PC(1).png", desc: "EN50155 Certified Fanless Railway Panel PC 15\" รองรับ Intel® Atom® x7-E3950" },
          { name: "BYTEM Series", slug: "BYTEM_Series_EN50155_IP65_Railway_Panel_PC", product: "BYTEM-123-PC", img: "small_BYTEM-123-PC(7).png", desc: "EN50155 Certified Fanless Railway Panel PC 12.1\" รองรับ Intel® Atom® E3845" },
        ],
      },
      {
        name: "Bar-Type PIS Panel PC",
        slug: "Bar_Type_Panel_PC",
        types: [
          { name: "MRD Series", slug: "MRD_Series_EN50155_Bay_Type_Panel_PC", product: "MRD-286", img: "small_MRD-286_EOL.png", desc: "EN50155 Compliant All-in-One Bar-Type PIS Panel PC 28.6\" รองรับ Intel® Atom® x7-E3950/Pentium® N4200" },
        ],
      },
    ],
  },
];

function buildProductUrl(catSlug, subSlug, typeSlug) {
  return `${IBASE_BASE}${catSlug}/${subSlug}/${typeSlug}`;
}

function setupProductExplorer() {
  const explorer = document.querySelector("[data-product-explorer]");
  if (!explorer) {
    return;
  }

  const cols = [
    explorer.querySelector('[data-col="0"]'),
    explorer.querySelector('[data-col="1"]'),
    explorer.querySelector('[data-col="2"]'),
  ];
  const previewEmpty = explorer.parentElement.querySelector("[data-preview-empty]");
  const previewCard = explorer.parentElement.querySelector("[data-preview-card]");
  const previewImg = explorer.parentElement.querySelector("[data-preview-img]");
  const previewFallback = explorer.parentElement.querySelector("[data-preview-fallback]");
  const previewEyebrow = explorer.parentElement.querySelector("[data-preview-eyebrow]");
  const previewName = explorer.parentElement.querySelector("[data-preview-name]");
  const previewDesc = explorer.parentElement.querySelector("[data-preview-desc]");
  const previewLink = explorer.parentElement.querySelector("[data-preview-link]");

  let activeCat = 0;
  let activeSub = 0;

  function renderCol0() {
    cols[0].innerHTML = "";
    productData.forEach((cat, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "product-item";
      item.classList.toggle("is-active", index === activeCat);
      item.innerHTML = `<span>${cat.name}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>`;
      const activate = () => {
        if (activeCat === index) {
          return;
        }
        activeCat = index;
        activeSub = 0;
        renderCol0();
        renderCol1();
        renderCol2();
      };
      item.addEventListener("mouseenter", activate);
      item.addEventListener("focus", activate);
      item.addEventListener("click", activate);
      cols[0].appendChild(item);
    });
  }

  function renderCol1() {
    cols[1].innerHTML = "";
    const cat = productData[activeCat];
    cat.sub.forEach((sub, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "product-item";
      item.classList.toggle("is-active", index === activeSub);
      item.innerHTML = `<span>${sub.name}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>`;
      const activate = () => {
        if (activeSub === index) {
          return;
        }
        activeSub = index;
        renderCol1();
        renderCol2();
      };
      item.addEventListener("mouseenter", activate);
      item.addEventListener("focus", activate);
      item.addEventListener("click", activate);
      cols[1].appendChild(item);
    });
  }

  function renderCol2() {
    cols[2].innerHTML = "";
    const cat = productData[activeCat];
    const sub = cat.sub[activeSub];
    sub.types.forEach((type) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "product-item";
      item.innerHTML = `<span>${type.name}</span>`;
      const showPreview = () => {
        cols[2].querySelectorAll(".product-item").forEach((el) => el.classList.remove("is-active"));
        item.classList.add("is-active");
        previewEmpty.hidden = true;
        previewCard.hidden = false;
        previewImg.hidden = false;
        previewFallback.hidden = true;
        previewImg.src = IMG_BASE + type.img;
        previewImg.alt = type.product;
        previewImg.onerror = () => {
          previewImg.hidden = true;
          previewFallback.hidden = false;
          previewFallback.textContent = type.product.slice(0, 2).toUpperCase();
          previewImg.onerror = null;
        };
        previewEyebrow.textContent = `${cat.name} · ${sub.name}`;
        previewName.textContent = type.product;
        previewDesc.textContent = type.desc;
        previewLink.href = buildProductUrl(cat.slug, sub.slug, type.slug);
      };
      item.addEventListener("mouseenter", showPreview);
      item.addEventListener("focus", showPreview);
      item.addEventListener("click", showPreview);
      cols[2].appendChild(item);
    });
  }

  renderCol0();
  renderCol1();
  renderCol2();
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "รับข้อมูลเรียบร้อยแล้ว กรุณาเชื่อมต่อระบบส่งอีเมลหรือ backend ในขั้นตอน production";
    form.reset();
  });
}

function setupInteractions() {
  document.addEventListener("click", handleRouteClick);

  menuToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "default" : "dark");
  });

  document.querySelector("[data-scroll-next]")?.addEventListener("click", () => {
    document.querySelector('[data-section="home-services"]')?.scrollIntoView({
      behavior: transitionMs ? "smooth" : "auto",
      block: "start",
    });
  });

  window.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("resize", requestScrollTick);
  window.addEventListener("popstate", () => showRoute(routeFromHash()));
  window.addEventListener("hashchange", () => showRoute(routeFromHash()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function boot() {
  setTheme(localStorage.getItem("sis-theme") || "default");
  setupInteractions();
  setupContactForm();
  setupProductExplorer();

  currentRoute = routeFromHash();
  document.querySelectorAll(".page").forEach((page) => {
    const isActive = page.dataset.page === currentRoute;
    page.classList.toggle("is-active", isActive);
    page.toggleAttribute("hidden", !isActive);
  });
  updateActiveNav(currentRoute);
  resetReveals(document.querySelector(`[data-page="${currentRoute}"]`));
  updateScrollEffects();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
