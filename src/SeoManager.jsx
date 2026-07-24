import { useEffect } from "react";
import { useLang } from "./i18n";
import { buildRoutePath } from "./routing";

const pageMeta = {
  home: {
    th: ["SIS | ระบบประตูเก็บค่าโดยสาร MRT และ AFC", "บริษัท สยาม อินฟินิตี้ โซลูชั่น จำกัด ให้บริการระบบประตูเก็บค่าโดยสาร AFC อุปกรณ์สถานี และงานติดตั้งระบบรถไฟฟ้า"],
    en: ["SIS | MRT Fare Gate and AFC Systems", "Siam Infinity Solution provides MRT fare gates, AFC integration, station devices, and field implementation services."],
  },
  about: {
    th: ["เกี่ยวกับ SIS | Siam Infinity Solution", "รู้จัก Siam Infinity Solution และแนวทางการทำงานด้านระบบประตูเก็บค่าโดยสาร AFC และอุปกรณ์สถานี"],
    en: ["About SIS | Siam Infinity Solution", "Learn about Siam Infinity Solution and our approach to fare gate, AFC, and station-device projects."],
  },
  services: {
    th: ["บริการระบบ MRT และ AFC | SIS", "บริการออกแบบ ติดตั้ง ทดสอบ และสนับสนุนระบบประตูเก็บค่าโดยสาร AFC และอุปกรณ์สถานี"],
    en: ["MRT and AFC Services | SIS", "Design, installation, testing, commissioning, and support for fare gates, AFC systems, and station devices."],
  },
  projects: {
    th: ["ผลงานระบบรถไฟฟ้า | SIS", "ผลงานและประสบการณ์ของ SIS ด้านระบบประตูเก็บค่าโดยสาร AFC และอุปกรณ์สถานี"],
    en: ["Rail Transit Projects | SIS", "Selected SIS experience in fare gate, AFC integration, and station-device projects."],
  },
  products: {
    th: ["สินค้าและอุปกรณ์ระบบสถานี | SIS", "สินค้า Embedded Computing, Edge AI, Panel PC, Transportation และอะไหล่ BNA สำหรับระบบสถานี"],
    en: ["Station Systems and Products | SIS", "Embedded computing, Edge AI, panel PCs, transportation systems, and BNA parts for station applications."],
  },
  contact: {
    th: ["ติดต่อ SIS | Siam Infinity Solution", "ติดต่อทีม SIS เพื่อปรึกษาโครงการ สอบถามสินค้า หรือขอรับการสนับสนุนระบบสถานี"],
    en: ["Contact SIS | Siam Infinity Solution", "Contact SIS about projects, product enquiries, and station-system support."],
  },
  "not-found": {
    th: ["ไม่พบหน้า | SIS", "ไม่พบหน้าที่คุณต้องการ กรุณากลับไปยังหน้าหลักของ SIS"],
    en: ["Page Not Found | SIS", "The requested page could not be found. Return to the SIS home page."],
  },
};

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export default function SeoManager({ route, product, shareImage }) {
  const { lang } = useLang();

  useEffect(() => {
    const fallback = pageMeta[route.base] || pageMeta["not-found"];
    let [title, description] = fallback[lang] || fallback.en;

    if (route.base === "products" && product) {
      title = `${product.model} | SIS`;
      description = product.desc || description;
    }

    const configuredOrigin = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
    const origin = configuredOrigin || window.location.origin;
    const canonicalUrl = new URL(buildRoutePath(route.base, route.param), `${origin}/`).href;
    const imageUrl = new URL(shareImage, `${origin}/`).href;

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: product ? "product" : "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: product?.img ? new URL(product.img, `${origin}/`).href : imageUrl });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: lang === "th" ? "th_TH" : "en_US" });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let structuredData = document.head.querySelector("#sis-organization-schema");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.id = "sis-organization-schema";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Siam Infinity Solution Co., Ltd.",
      alternateName: "SIS",
      url: origin,
      logo: imageUrl,
      telephone: ["+66 83 066 2462", "+66 2 001 0518"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "111/2 Ramkhamhaeng 94 Alley",
        addressLocality: "Saphan Sung",
        addressRegion: "Bangkok",
        postalCode: "10240",
        addressCountry: "TH",
      },
    });
  }, [lang, product, route.base, route.param, shareImage]);

  return null;
}
