import { createContext, useContext, useState, useCallback, useEffect } from "react";

const translations = {
  // ── Navigation ──
  "nav.home": { th: "หน้าหลัก", en: "Home" },
  "nav.about": { th: "เกี่ยวกับเรา", en: "About" },
  "nav.services": { th: "บริการ", en: "Services" },
  "nav.projects": { th: "ผลงาน", en: "Projects" },
  "nav.products": { th: "สินค้า", en: "Products" },
  "nav.contact": { th: "ติดต่อเรา", en: "Contact" },

  // ── Header CTA ──
  "header.cta": { th: "ติดต่อเรา", en: "Contact Us" },

  // ── Hero Section ──
  "hero.kicker": { th: "ระบบประตูเก็บค่าโดยสาร MRT & AFC", en: "MRT Fare Gate & AFC Systems" },
  "hero.title1": { th: "SIS Siam Infinity", en: "SIS Siam Infinity" },
  "hero.title2": { th: "Solution Co., Ltd.", en: "Solution Co., Ltd." },
  "hero.slogan1": { th: "แก้ทุกปัญหา สร้างทุกความเป็นไปได้", en: "Solve every problem, create every possibility," },
  "hero.slogan2": { th: "อย่างไร้ขีดจำกัด", en: "without limits." },
  "hero.slide1.primary": { th: "", en: "" },
  "hero.slide1.accent": { th: "แก้ทุกปัญหา", en: "Solve Every Problem" },
  "hero.slide2.primary": { th: "นวัตกรรมระบบประตูอัตโนมัติ & AFC", en: "Automatic Fare Gate & AFC Innovation" },
  "hero.slide2.accent": { th: "สร้างทุกความเป็นไปได้", en: "Create Every Possibility" },
  "hero.slide3.primary": { th: "ยกระดับการเดินทางและการชำระเงิน", en: "Elevating Mobility & Payment Systems" },
  "hero.slide3.accent": { th: "อย่างไร้ขีดจำกัด", en: "Without Limits" },
  "hero.desc": {
    th: "SIS Siam Infinity Solution ให้บริการระบบเก็บค่าโดยสาร ประตูอัตโนมัติแบบสองทิศทาง และงานติดตั้งระบบสถานีสำหรับเครือข่ายรถไฟฟ้า MRT",
    en: "SIS Siam Infinity Solution delivers reliable fare collection systems, bi-direction automatic gates, and station integration for the MRT network.",
  },
  "hero.viewProjects": { th: "ดูผลงาน", en: "View projects" },
  "hero.ourServices": { th: "บริการของเรา", en: "Our services" },

  // ── Customers Section ──
  "customers.kicker": { th: "ความไว้วางใจจากพันธมิตร", en: "Trusted partnerships" },
  "customers.title": { th: "ลูกค้าของเรา", en: "Our clients" },
  "customers.desc": {
    th: "จากประสบการณ์ในการร่วมงานกับองค์กรด้านระบบราง การเดินทาง และการชำระเงิน",
    en: "From our experience working with leading rail, mobility, and payment organizations.",
  },
  "customers.pause": { th: "หยุดการเลื่อนโลโก้ชั่วคราว", en: "Pause logo movement" },
  "customers.resume": { th: "เล่นการเลื่อนโลโก้ต่อ", en: "Resume logo movement" },

  // ── Services ──
  "service.fareGate.title": { th: "Bi-directions Automatic Gates", en: "Bi-directions Automatic Gates" },
  "service.fareGate.body": { th: "ประตูอัตโนมัติแบบสองทิศทางและระบบควบคุมช่องทาง", en: "Bi-direction automatic gates and lane control solutions." },
  "service.afc.title": { th: "ระบบ AFC Integration", en: "AFC Integration" },
  "service.afc.body": { th: "การเชื่อมต่อที่ราบรื่นระหว่างระบบ อุปกรณ์ และการดำเนินงานสถานี", en: "Seamless connection across systems, devices, and station operations." },
  "service.field.title": { th: "งานติดตั้งภาคสนาม", en: "Field Execution" },
  "service.field.body": { th: "การติดตั้ง ทดสอบ และตรวจรับงานพร้อมส่งมอบการดำเนินงาน", en: "Installation, testing, and commissioning with operation handover." },
  "service.support.title": { th: "บริการสนับสนุน", en: "Service Support" },
  "service.support.body": { th: "การสนับสนุนที่ตอบสนองตลอดวงจรชีวิตของระบบ", en: "Responsive support throughout the system life cycle." },

  // ── Focus Section ──
  "focus.kicker": { th: "จุดเน้น", en: "Our focus" },
  "focus.title": { th: "Bi-directions Automatic Gates", en: "Bi-directions Automatic Gates" },
  "focus.desc": {
    th: "เราพัฒนาและติดตั้งประตูอัตโนมัติแบบสองทิศทาง ที่รองรับการควบคุมการเข้า-ออกในช่องทางเดียวกัน เพื่อเพิ่มประสิทธิภาพการให้บริการของสถานี พร้อมคงไว้ซึ่งมาตรฐานด้านความปลอดภัย",
    en: "We develop and deploy bi-directional automatic gates that support controlled entry and exit flow in the same lane, enhancing station service efficiency while maintaining high safety standards.",
  },
  "focus.learnMore": { th: "เรียนรู้เพิ่มเติม", en: "Learn more" },

  // ── Process Section ──
  "process.kicker": { th: "บริการและการดำเนินงาน", en: "Services & Operations" },
  "process.title": { th: "ขอบเขตการให้บริการ", en: "Core Service Process" },
  "process.summary": { th: "ความเชี่ยวชาญที่เชื่อมต่อกัน ตั้งแต่การวางระบบจนถึงการดูแลระยะยาว", en: "Connected disciplines, from system planning through long-term care." },
  "process.step1.badge": { th: "ซ่อมบำรุง", en: "Maintenance" },
  "process.step1.desc": {
    th: "บริการตรวจเช็ค บำรุงรักษา และซ่อมแซมอุปกรณ์ระบบ AFC โดยช่างผู้เชี่ยวชาญ",
    en: "Professional maintenance and repair services to maximize AFC system reliability and minimize downtime.",
  },
  "process.step2.badge": { th: "จัดจำหน่าย", en: "Supply & Sales" },
  "process.step2.desc": {
    th: "จำหน่ายอุปกรณ์ อะไหล่แท้ และโซลูชันระบบ AFC คุณภาพสูงมาตรฐานสากล",
    en: "Supply of high-quality AFC equipment, spare parts, and integrated fare collection solutions.",
  },
  "process.step3.badge": { th: "ติดตั้งระบบ", en: "Deployment" },
  "process.step3.desc": {
    th: "ติดตั้ง เดินสาย ทดสอบ และเปิดใช้งานระบบ AFC ภาคสนามอย่างสมบูรณ์และปลอดภัย",
    en: "Complete installation, integration, testing, and commissioning services for AFC systems.",
  },
  "process.step4.badge": { th: "ให้คำปรึกษา", en: "Consulting" },
  "process.step4.desc": {
    th: "ให้คำปรึกษา ออกแบบสถาปัตยกรรมระบบ และวางแผนการเชื่อมต่อระบบ AFC แบบครบวงจร",
    en: "Expert consulting and scalable AFC system design tailored to your business requirements.",
  },

  // ── News & Activities Section ──
  "news.kicker": { th: "NEWS & ACTIVITIES", en: "NEWS & ACTIVITIES" },
  "news.title": { th: "ข่าวสาร & กิจกรรม", en: "News & Activities" },
  "news.desc": {
    th: "ติดตามข่าวสาร กิจกรรม และความเคลื่อนไหวล่าสุดของบริษัท",
    en: "Follow our latest news, events and company activities.",
  },
  "news.readMore": { th: "อ่านเพิ่มเติม", en: "Read More" },

  // ── About Page ──
  "about.kicker": { th: "About SIS", en: "About SIS" },
  "about.title": {
    th: "Engineering Excellence for Railway & AFC Infrastructure",
    en: "Engineering Excellence for Railway & AFC Infrastructure",
  },
  "about.visitProjects": { th: "ดูผลงาน", en: "Visit projects" },
  "about.descP1": {
    th: "Siam Infinity Solution Co., Ltd. (SIS) เป็นบริษัทผู้เชี่ยวชาญด้านวิศวกรรมระบบจัดเก็บค่าโดยสารอัตโนมัติ (Automatic Fare Collection: AFC) และโครงสร้างพื้นฐานสำหรับระบบขนส่งมวลชน โดยให้บริการด้านการออกแบบ ติดตั้ง บูรณาการระบบ (System Integration) ทดสอบ ทดสอบและเปิดใช้งานระบบ (Testing & Commissioning) บำรุงรักษา ตลอดจนการจัดหาอะไหล่และอุปกรณ์ที่เกี่ยวข้อง เพื่อสนับสนุนการดำเนินงานของระบบขนส่งมวลชนให้มีประสิทธิภาพ ความมั่นคง และความพร้อมใช้งานอย่างต่อเนื่อง",
    en: "Siam Infinity Solution Co., Ltd. (SIS) is a specialized engineering enterprise focusing on Automatic Fare Collection (AFC) systems and mass transit infrastructure. We deliver end-to-end design, installation, system integration, testing & commissioning, preventive/corrective maintenance, as well as spare parts supply and equipment procurement to support continuous, reliable, and secure mass transit operations.",
  },
  "about.descP2": {
    th: "ด้วยประสบการณ์ในการดำเนินงานด้านระบบ AFC และอุปกรณ์ภายในสถานีรถไฟฟ้า SIS มุ่งเน้นการดำเนินงานตามมาตรฐานวิศวกรรมและข้อกำหนดของโครงการในทุกขั้นตอน พร้อมให้ความสำคัญกับคุณภาพ ความปลอดภัย ความน่าเชื่อถือของระบบ และการส่งมอบบริการที่ตอบสนองต่อความต้องการของลูกค้าอย่างมีประสิทธิภาพ",
    en: "With extensive field experience in AFC systems and station equipment, SIS adheres strictly to engineering standards and project specifications at every stage. We prioritize quality, safety, system availability, and customer satisfaction.",
  },

  // Our Expertise
  "about.expertise.kicker": { th: "Our Expertise", en: "Our Expertise" },
  "about.expertise.title": { th: "ขอบเขตความเชี่ยวชาญและการให้บริการ", en: "Scope of Expertise & Engineering Services" },
  "about.expertise.desc": {
    th: "SIS ให้บริการด้านวิศวกรรมและการสนับสนุนทางเทคนิคสำหรับระบบรถไฟฟ้าและระบบจัดเก็บค่าโดยสารอัตโนมัติ ครอบคลุมขอบเขตงาน ดังต่อไปนี้",
    en: "SIS provides specialized engineering and technical support services for rail transit and automatic fare collection systems, covering:",
  },

  // Project Experience
  "about.experience.kicker": { th: "Project Experience", en: "Project Experience" },
  "about.experience.title": { th: "ประสบการณ์ในการดำเนินโครงการ", en: "Proven Track Record & Project Delivery" },
  "about.experience.descP1": {
    th: "SIS มีประสบการณ์ในการดำเนินโครงการด้านระบบจัดเก็บค่าโดยสารอัตโนมัติ (AFC) สำหรับระบบรถไฟฟ้าขนส่งมวลชน ครอบคลุมงานติดตั้ง บูรณาการระบบ ทดสอบและเปิดใช้งานระบบ รวมถึงการบำรุงรักษาอุปกรณ์ภายในสถานีรถไฟฟ้า",
    en: "SIS brings extensive experience in executing AFC projects for urban mass transit rail networks, encompassing gate installation, system integration, testing & commissioning, and station equipment maintenance.",
  },
  "about.experience.descP2": {
    th: "การดำเนินงานทุกโครงการเป็นไปตามมาตรฐานทางวิศวกรรม ข้อกำหนดด้านคุณภาพ และข้อกำหนดด้านความปลอดภัย เพื่อให้ระบบสามารถปฏิบัติงานได้อย่างมีเสถียรภาพ พร้อมรองรับการให้บริการผู้โดยสารได้อย่างต่อเนื่อง",
    en: "Every project execution complies strictly with international engineering standards, quality control measures, and safety protocols to ensure high system stability and uninterrupted passenger operations.",
  },
  "about.experience.descP3": {
    th: "ตลอดระยะเวลาการดำเนินงาน SIS ได้รับความไว้วางใจจากหน่วยงานและองค์กรผู้ให้บริการระบบขนส่งมวลชนในการดำเนินงานด้านวิศวกรรมระบบ AFC และอุปกรณ์ที่เกี่ยวข้อง ซึ่งสะท้อนถึงความเชี่ยวชาญ ความรับผิดชอบ และมาตรฐานการดำเนินงานของบริษัท",
    en: "Throughout our journey, SIS has earned the enduring trust of mass transit authorities and rail operators for critical AFC engineering services—a testament to our technical competence, responsibility, and operational standards.",
  },

  // Our Commitment
  "commitment.title": { th: "Our Commitment", en: "Our Commitment" },
  "commitment.desc": {
    th: "SIS ยึดมั่นในการดำเนินงานตามหลักวิศวกรรม มาตรฐานคุณภาพ และความปลอดภัย โดยให้ความสำคัญกับการวางแผน การบริหารโครงการ และการควบคุมคุณภาพในทุกกระบวนการ มุ่งมั่นพัฒนาเทคโนโลยีและบริการเพื่อเป็นพันธมิตรที่ได้รับความไว้วางใจในการสนับสนุนการพัฒนาโครงสร้างพื้นฐานระบบขนส่งมวลชนของประเทศไทย",
    en: "SIS adheres strictly to engineering principles, quality control, and safety standards across all project phases. We continuously advance our technological capabilities to remain a trusted partner elevating Thailand's mass transit infrastructure.",
  },
  "commitment.tag1": { th: "วิศวกรรม & ควบคุมคุณภาพมาตรฐานสากล", en: "Engineering Excellence & Quality Control" },
  "commitment.tag2": { th: "เสถียรภาพและความพร้อมใช้งานระยะยาว", en: "High Availability & Long-term Reliability" },
  "commitment.tag3": { th: "พันธมิตรผู้ให้บริการระบบรางที่ได้รับความไว้วางใจ", en: "Trusted Thailand Rail Infrastructure Partner" },
  "about.card1.desc": {
    th: "ออกแบบและติดตั้งประตูอัตโนมัติ Bi-directional Automatic Gates ที่รองรับการควบคุมทิศทางการเข้า-ออกในช่องทางเดียวกัน พร้อมระบบเชื่อมต่อเซิร์ฟเวอร์ศูนย์กลาง CCH (Central Clearing House) และรองรับการชำระเงินแบบ Open-Loop (EMV Credit/Debit)",
    en: "Design and installation of bi-directional automatic fare gates with same-lane entry/exit flow control, integrated with Central Clearing House (CCH) servers and Open-Loop EMV payment acceptance.",
  },
  "about.card2.tag": { th: "ผลงานภาคสนาม", en: "Field Execution" },
  "about.card2.title": { th: "ส่งมอบงานวิศวกรรมใน 7 สถานีรถไฟฟ้า MRT สายสีน้ำเงิน", en: "Engineering Delivery Across 7 MRT Blue Line Stations" },
  "about.card2.desc": {
    th: "ครอบคลุมกระบวนการตั้งแต่การสำรวจทางเทคนิคหน้างาน การติดตั้งฮาร์ดแวร์ประตู การทดสอบระบบทางเดินรถ การตรวจรับมอบงานพร้อมเอกสารปฏิบัติงาน และทีมบริการซ่อมบำรุงแบบ 24/7 SLA",
    en: "Comprehensive execution from technical site survey, gate hardware installation, and station acceptance testing to handover documentation and 24/7 SLA field maintenance.",
  },
  "about.vision.kicker": { th: "วิสัยทัศน์องค์กร", en: "Corporate Vision" },
  "about.vision.title": { th: "ยกระดับระบบคมนาคมสีเขียวอย่างยั่งยืน", en: "Elevating Sustainable Green Transit" },
  "about.vision.desc": {
    th: "มุ่งสู่การเป็นพันธมิตรที่ได้รับความไว้วางใจในอุตสาหกรรมระบบราง ด้วยความเชี่ยวชาญด้านวิศวกรรมแบบครบวงจร เทคโนโลยีมาตรฐานสากล ที่ใส่ใจสิ่งแวดล้อม พร้อมส่งมอบโซลูชันที่มีคุณภาพ เพื่อยกระดับระบบคมนาคมสีเขียวอย่างยั่งยืน",
    en: "Striving to be a trusted partner in the rail transit industry through end-to-end engineering expertise, eco-conscious international standard technology, and high-quality solutions to sustainably elevate green transportation.",
  },

  // ── About Page · Stats ──
  "about.stats.kicker": { th: "ตัวเลขที่พูดแทนเรา", en: "Numbers That Speak" },
  "about.stats.title": { th: "ผลงานที่เราภาคภูมิใจ", en: "Achievements We're Proud Of" },
  "about.stats.years": { th: "ปีประสบการณ์", en: "Years Experience" },
  "about.stats.yearsValue": { th: "10+", en: "10+" },
  "about.stats.stations": { th: "สถานีที่ติดตั้ง", en: "Stations Installed" },
  "about.stats.stationsValue": { th: "50+", en: "50+" },
  "about.stats.projects": { th: "โครงการสำเร็จ", en: "Completed Projects" },
  "about.stats.projectsValue": { th: "100+", en: "100+" },
  "about.stats.uptime": { th: "ระบบทำงานต่อเนื่อง", en: "System Uptime" },
  "about.stats.uptimeValue": { th: "99.9%", en: "99.9%" },

  // ── About Page · Values ──
  "about.values.kicker": { th: "สิ่งที่เรายึดมั่น", en: "What We Stand For" },
  "about.values.title": { th: "ค่านิยมองค์กร", en: "Our Core Values" },
  "about.values.v1.title": { th: "ความรับผิดชอบ", en: "Responsibility" },
  "about.values.v1.desc": { th: "เรารับผิดชอบทุกขั้นตอนตั้งแต่ต้นจนจบ เพื่อให้ลูกค้ามั่นใจในคุณภาพงาน", en: "We take full ownership of every phase from start to finish, so clients can trust the quality of our work." },
  "about.values.v2.title": { th: "ความปลอดภัย", en: "Safety First" },
  "about.values.v2.desc": { th: "ความปลอดภัยคือมาตรฐานสูงสุดในทุกการปฏิบัติงาน ทั้งของทีมงานและผู้โดยสาร", en: "Safety is the highest standard in every operation, for both our teams and the passengers." },
  "about.values.v3.title": { th: "บริการจริงใจ", en: "Sincere Service" },
  "about.values.v3.desc": { th: "เราให้บริการด้วยใจ ใส่ใจทุกรายละเอียด และพร้อมสนับสนุนลูกค้าอย่างต่อเนื่อง", en: "We serve with heart, pay attention to every detail, and continuously support our clients." },
  "about.values.v4.title": { th: "นวัตกรรม", en: "Innovation" },
  "about.values.v4.desc": { th: "เราพัฒนาและปรับปรุงกระบวนการทำงานอย่างต่อเนื่อง เพื่อให้ทันกับเทคโนโลยีที่เปลี่ยนแปลง", en: "We continuously develop and improve our processes to keep pace with evolving technology." },
  "about.values.v5.title": { th: "ทีมเวิร์ค", en: "Teamwork" },
  "about.values.v5.desc": { th: "ความสำเร็จของเราเกิดจากการทำงานร่วมกันเป็นทีมอย่างมีประสิทธิภาพ", en: "Our success comes from working together as an effective, unified team." },
  "about.values.v6.title": { th: "ความเป็นมืออาชีพ", en: "Professionalism" },
  "about.values.v6.desc": { th: "เราทำงานด้วยมาตรฐานระดับสากล พร้อมส่งมอบงานตามกำหนดเวลา", en: "We work to international standards and deliver on schedule, every time." },

  // ── About Page · Timeline ──
  "about.timeline.kicker": { th: "เส้นทางของเรา", en: "Our Journey" },
  "about.timeline.title": { th: "เหตุการณ์สำคัญ", en: "Key Milestones" },
  "about.timeline.y1.year": { th: "2015", en: "2015" },
  "about.timeline.y1.title": { th: "ก่อตั้งบริษัท", en: "Company Founded" },
  "about.timeline.y1.desc": { th: "SIS Siam Infinity Solution ก่อตั้งขึ้นด้วยวิสัยทัศน์ในการให้บริการระบบรถไฟฟ้าแบบครบวงจร", en: "SIS Siam Infinity Solution was founded with a vision to deliver comprehensive rail transit services." },
  "about.timeline.y2.year": { th: "2017", en: "2017" },
  "about.timeline.y2.title": { th: "สัญญาแรกกับ MRT", en: "First MRT Contract" },
  "about.timeline.y2.desc": { th: "รับงานติดตั้งระบบ AFC และประตูเก็บค่าโดยสารให้กับสถานีรถไฟฟ้าใต้ดินเป็นครั้งแรก", en: "Secured our first contract for AFC system installation and fare gates at MRT stations." },
  "about.timeline.y3.year": { th: "2020", en: "2020" },
  "about.timeline.y3.title": { th: "ขยายทีมงาน", en: "Team Expansion" },
  "about.timeline.y3.desc": { th: "ขยายทีมวิศวกรและช่างเทคนิคเพื่อรองรับโครงการขนาดใหญ่", en: "Expanded our engineering and technical teams to support large-scale projects." },
  "about.timeline.y4.year": { th: "2023", en: "2023" },
  "about.timeline.y4.title": { th: "EMV Gate รุ่นใหม่", en: "New EMV Gate Launch" },
  "about.timeline.y4.desc": { th: "เปิดตัวระบบ EMV Gate ที่รองรับการชำระเงินผ่านบัตรเครดิตแบบไร้สัมผัส", en: "Launched EMV Gate system supporting contactless credit card payment." },
  "about.timeline.y5.year": { th: "2025", en: "2025" },
  "about.timeline.y5.title": { th: "ก้าวสู่อนาคต", en: "Into the Future" },
  "about.timeline.y5.desc": { th: "มุ่งพัฒนาระบบ Open-Loop Payment และ AI-Powered Maintenance สำหรับเครือข่ายรถไฟฟ้า", en: "Pushing forward with Open-Loop Payment and AI-Powered Maintenance for rail networks." },

  // ── About Page · Team ──
  "about.team.kicker": { th: "ทีมงานของเรา", en: "Our Team" },
  "about.team.title": { th: "ผู้นำที่ขับเคลื่อนองค์กร", en: "Leadership That Drives Us" },
  "about.team.m1.name": { th: "คุณสมชาย", en: "Somchai" },
  "about.team.m1.role": { th: "กรรมการผู้จัดการ", en: "Managing Director" },
  "about.team.m2.name": { th: "คุณวิภาวี", en: "Wipawee" },
  "about.team.m2.role": { th: "ผู้จัดการฝ่ายวิศวกรรม", en: "Engineering Manager" },
  "about.team.m3.name": { th: "คุณธนพล", en: "Thanaphon" },
  "about.team.m3.role": { th: "หัวหน้าฝ่ายปฏิบัติการ", en: "Head of Operations" },
  "about.team.m4.name": { th: "คุณปรียาภรณ์", en: "Preeyaporn" },
  "about.team.m4.role": { th: "ผู้จัดการฝ่ายขายและบริการ", en: "Sales & Service Manager" },

  // ── About Page · Gallery ──
  "about.gallery.kicker": { th: "วัฒนธรรมองค์กร", en: "Company Culture" },
  "about.gallery.title": { th: "บรรยากาศการทำงาน", en: "Our Working Environment" },

  // ── About Page · CTA ──
  "about.cta.title": { th: "พร้อมร่วมงานกับเรา?", en: "Ready to Work With Us?" },
  "about.cta.desc": { th: "ติดต่อเราวันนี้เพื่อพูดคุยเกี่ยวกับโครงการของคุณ เราพร้อมให้คำปรึกษาและสนับสนุนทุกขั้นตอน", en: "Contact us today to discuss your project. We're ready to consult and support you every step of the way." },
  "about.cta.button": { th: "ติดต่อเรา", en: "Get In Touch" },

  // ── Services Page ──
  "services.kicker": { th: "บริการ", en: "Services" },
  "services.title": { th: "Bi-directions Automatic Gates", en: "Bi-directions Automatic Gates" },
  "services.desc": {
    th: "สนับสนุนเฉพาะทางสำหรับประตูอัตโนมัติ อินเทอร์เฟซตั๋ว อุปกรณ์ภาคสนาม การทดสอบ และการส่งมอบการดำเนินงาน",
    en: "Focused support for automatic gates, ticketing interfaces, field devices, testing, and operation handover.",
  },
  "services.heroNote": {
    th: "ดูแลตั้งแต่สำรวจหน้างาน เชื่อมต่อระบบ ไปจนถึงส่งมอบพร้อมใช้งาน",
    en: "From site survey and system integration to operational handover.",
  },
  "services.heroImageAlt": {
    th: "ประตูเก็บค่าโดยสารอัตโนมัติในสถานีรถไฟฟ้า",
    en: "Automatic fare gate in a modern railway station",
  },
  "services.heroMetric": { th: "บริการหลักที่เชื่อมต่อกัน", en: "Connected service disciplines" },
  "services.heroMetricDesc": { th: "ครอบคลุมระบบตลอดวงจรงาน", en: "One complete delivery cycle" },
  "services.scopeKicker": { th: "ขอบเขตบริการ", en: "Service scope" },
  "services.scopeTitle": {
    th: "เชื่อมทุกส่วนของระบบ ให้พร้อมใช้งานจริง",
    en: "Every system layer, ready for operation",
  },
  "services.scopeDesc": {
    th: "ทีมเดียวประสานงานตั้งแต่อุปกรณ์หน้าช่องทาง ระบบ AFC งานภาคสนาม และการสนับสนุนหลังส่งมอบ",
    en: "One specialist team coordinating lane equipment, AFC integration, field execution, and post-handover support.",
  },
  "services.domain.fareGate": { th: "การไหลของผู้โดยสาร", en: "Passenger flow" },
  "services.domain.afc": { th: "การเชื่อมต่อระบบ", en: "System interface" },
  "services.domain.field": { th: "ความพร้อมหน้างาน", en: "Site readiness" },
  "services.domain.support": { th: "ดูแลตลอดวงจร", en: "Lifecycle care" },
  "services.description": { th: "รายละเอียด:", en: "Description:" },
  "services.exampleContext": { th: "บริบทตัวอย่าง:", en: "Example Context:" },
  "services.exampleContextDesc": {
    th: "นี่คือรายละเอียดการดำเนินงานอ้างอิงสำหรับ {title} ในสภาพแวดล้อมสถานีจำลอง Siam Infinity Solution รับประกันการปฏิบัติตามมาตรฐาน MRTA ท้องถิ่นและจัดทำการสำรวจทางเทคนิค รายการตรวจสอบการตรวจรับ และรายงานการส่งมอบ",
    en: "This is a reference implementation detail for {title} at a simulated station environment. Siam Infinity Solution ensures compliance with local MRTA standards and provides technical surveys, commissioning checklists, and handover reports.",
  },
  "services.bullet1": { th: "การวางแผนสถานที่ การวิเคราะห์มิติ และการสำรวจระยะห่างโครงสร้าง", en: "Site planning, dimensional analysis, and structural clearance surveys" },
  "services.bullet2": { th: "การเดินสายไฟ สายสื่อสาร และการกำหนดค่าเครือข่าย", en: "Electrical wiring, communication cabling, and networking configuration" },
  "services.bullet3": { th: "การตรวจสอบประสิทธิภาพระดับหน่วยและการตรวจสอบการเชื่อมต่อสถานี", en: "Unit-level performance validation and station integration checks" },
  "services.bullet4": { th: "การฝึกอบรมการบำรุงรักษาภาคปฏิบัติและการส่งมอบคู่มือการดำเนินงาน", en: "Hands-on maintenance training and detailed operational manual handover" },

  // ── Projects Page ──
  "projects.kicker": { th: "ผลงานของเรา", en: "Our projects" },
  "projects.title": { th: "โครงการ MRT ของ SIS", en: "SIS MRT Projects" },
  "projects.desc": {
    th: "โครงการและข้อมูลอ้างอิงจาก MRTA, ARL, BEM, VIX Technology และ Rabbit Card",
    en: "Selected projects and references from MRTA, ARL, BEM, VIX Technology, and Rabbit Card.",
  },
  "projects.summaryTitle": { th: "โครงการอ้างอิง", en: "Reference projects" },
  "projects.summaryDesc": { th: "ระบบ AFC และอุปกรณ์สถานี", en: "AFC systems and station equipment" },
  "projects.showcaseKicker": { th: "ผลงานที่คัดสรร", en: "Selected work" },
  "projects.showcaseTitle": { th: "งานภาคสนามที่ส่งมอบจริง", en: "Delivered in real operating environments" },
  "projects.viewProject": { th: "ดูรายละเอียด", en: "View project" },
  "projects.gallery.label": { th: "แกลเลอรีภาพโครงการ", en: "Project image gallery" },
  "projects.gallery.eyebrow": { th: "เรื่องราวผ่านภาพ", en: "Project visual story" },
  "projects.gallery.overview": { th: "ภาพรวมโครงการ", en: "Project overview" },
  "projects.gallery.field": { th: "การทำงานหน้างาน", en: "On-site execution" },
  "projects.gallery.detail": { th: "รายละเอียดอุปกรณ์", en: "Equipment detail" },
  "projects.gallery.overviewDesc": { th: "ภาพรวมของขอบเขตงานและสภาพแวดล้อมจริงของโครงการ", en: "An overview of the project scope and its real operating environment." },
  "projects.gallery.fieldDesc": { th: "การติดตั้ง ตรวจสอบ และประสานงานโดยทีมงานในพื้นที่ปฏิบัติงานจริง", en: "Installation, verification, and coordination by the team in the live work area." },
  "projects.gallery.detailDesc": { th: "มุมใกล้ของอุปกรณ์และรายละเอียดทางเทคนิคที่เกี่ยวข้องกับการส่งมอบ", en: "A closer look at the equipment and technical details involved in delivery." },
  "projects.gallery.hint": { th: "ปัดภาพ หรือใช้ปุ่มลูกศรเพื่อดูมุมถัดไป", en: "Swipe the image or use the arrows to explore" },
  "projects.gallery.previous": { th: "ภาพก่อนหน้า", en: "Previous image" },
  "projects.gallery.next": { th: "ภาพถัดไป", en: "Next image" },
  "projects.gallery.select": { th: "เลือกมุมภาพ", en: "Select an image" },
  "projects.gallery.close": { th: "ปิดรายละเอียดโครงการ", en: "Close project details" },
  "projects.gallery.client": { th: "ลูกค้า", en: "Client" },
  "projects.gallery.year": { th: "ปีโครงการ", en: "Project year" },
  "projects.gallery.highlights": { th: "ขอบเขตการส่งมอบ", en: "Delivery highlights" },
  "projects.popup.overview": { th: "ภาพรวม:", en: "Overview:" },
  "projects.popup.example": { th: "บริบทตัวอย่างและการดำเนินงาน:", en: "Example Context & Implementation:" },
  "projects.popup.exampleDesc": {
    th: "โครงการนี้ถูกดำเนินการที่หน้างานภายใต้การดำเนินงานสถานีที่ใช้งานอยู่ Siam Infinity Solution จัดการการสำรวจเบื้องต้น การจัดเตรียมอุปกรณ์ การปรับแนวเครื่องจักร การเดินสายภาคสนาม และการเชื่อมต่อเครือข่าย MRT ท้องถิ่น รายงานการตรวจรับรายวันและบันทึกการทดสอบถูกส่งให้ลูกค้าเพื่อลงนามขั้นสุดท้าย",
    en: "This project was deployed on-site under active station operations. Siam Infinity Solution managed the initial survey, device staging, mechanical alignment, field wiring, and local MRT network integration. Daily commissioning reports and test logs were submitted to the client for final sign-off.",
  },
  "projects.popup.bullet1": { th: "การเชื่อมต่อเครื่องจักรครบวงจรและการสำรวจความพร้อมทางไฟฟ้า", en: "Full mechanical integration and electrical readiness surveys" },
  "projects.popup.bullet2": { th: "การตรวจสอบการไหลแบบสองช่องทางและการทดสอบพลังงานแบตเตอรี่สำรอง", en: "Dual-lane flow validation checks and backup battery power testing" },
  "projects.popup.bullet3": { th: "การส่งมอบให้ผู้ปฏิบัติงานสำเร็จและชุดเอกสารการบำรุงรักษา", en: "Successful operator handover and maintenance documentation package" },

  // ── Portfolio items ──
  "portfolio.1.title": { th: "การเปลี่ยน PID ประตูเก็บค่าโดยสาร", en: "Gate PID Replacement" },
  "portfolio.1.body": { th: "งานเปลี่ยนและติดตั้งจอแสดงข้อมูลผู้โดยสารรุ่นใหม่บนอุปกรณ์ประตูเก็บค่าโดยสาร", en: "Replacement and installation work for a new Passenger Information Display model on fare gate equipment." },
  "portfolio.1.category": { th: "ประตูเก็บค่าโดยสาร", en: "Fare Gate" },
  "portfolio.2.title": { th: "การทดสอบนำร่องสายสีน้ำเงินส่วนต่อขยาย", en: "Blue Line Extension Pilot Test" },
  "portfolio.2.body": { th: "สนับสนุนการตรวจรับสายสีน้ำเงินส่วนต่อขยายเฟส 1 และ 2 การทดสอบนำร่องกับอุปกรณ์ประตูสถานี", en: "Acceptance support for Blue Line Extension Phase 1 and 2 pilot testing with station gate equipment." },
  "portfolio.2.category": { th: "การเชื่อมต่อระบบ", en: "Integration" },
  "portfolio.3.title": { th: "ระบบกล่องเหรียญ TVM", en: "TVM Coin Box System" },
  "portfolio.3.body": { th: "งานกล่องเหรียญสำหรับอุปกรณ์เครื่องจำหน่ายตั๋วอัตโนมัติ รวมถึงความพร้อมทางกลไกและเอกสารอ้างอิงภาคสนาม", en: "Coin box work for Ticket Vending Machine equipment including mechanical readiness and field reference material." },
  "portfolio.3.category": { th: "ระบบ AFC", en: "AFC System" },
  "portfolio.4.title": { th: "การย้าย CCH", en: "CCH Relocation" },
  "portfolio.4.body": { th: "การย้าย OTP Central Clearing House จาก CS Loxinfo ไปยัง MRTA รวมถึงการขนส่งและการประสานงานโครงสร้างพื้นฐาน", en: "OTP Central Clearing House relocation from CS Loxinfo to MRTA including transport and infrastructure coordination." },
  "portfolio.4.category": { th: "อุปกรณ์สถานี", en: "Station Device" },
  "portfolio.5.title": { th: "การติดตั้งเครื่องอ่าน Rabbit", en: "Rabbit Reader Installation" },
  "portfolio.5.body": { th: "การติดตั้งเครื่องอ่านสำหรับรถบัส Salaya และรถบัสเมือง RTC นนทบุรี เพื่อรับชำระเงิน", en: "Reader installation for Salaya Bus and RTC Nonthaburi City Bus payment acceptance." },
  "portfolio.5.category": { th: "ระบบ AFC", en: "AFC System" },

  // ── Contact Page ──
  "contact.kicker": { th: "ติดต่อ", en: "Contact" },
  "contact.title": { th: "เริ่มต้นจากปัญหาของสถานี", en: "Start with the station problem" },
  "contact.desc": {
    th: "ส่งข้อความโครงการสั้นๆ แล้วทีม SIS จะตรวจสอบบริบทสถานี ขอบเขตระบบ และขั้นตอนต่อไป",
    en: "Send a short project note and the SIS team can review the station context, system scope, and next step.",
  },
  "contact.tellUs": { th: "บอกเราว่าอะไรต้องทำงานดีกว่านี้", en: "Tell us what needs to move better." },
  "contact.tellUsDesc": {
    th: "แจ้งสถานี อุปกรณ์ที่เกี่ยวข้อง ปัญหาการไหลของผู้โดยสาร และกำหนดเวลาเป้าหมาย เพียงเท่านี้ก็เพียงพอที่จะเริ่มการตรวจสอบเชิงปฏิบัติ",
    en: "Share the station, equipment involved, passenger-flow issue, and target timeline. That is enough to begin a practical review.",
  },
  "contact.company": { th: "บริษัท สยาม อินฟินิตี้ โซลูชั่น จำกัด", en: "Siam Infinity Solution Co., Ltd." },
  "contact.address": { th: "111/2 ซอยรามคำแหง 94 สะพานสูง กรุงเทพฯ 10240", en: "111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240" },
  "contact.tel": { th: "โทร: +66 083-066-2462, 02-001-0518", en: "Tel: +66 083-066-2462, 02-001-0518" },

  // ── Contact Form ──
  "form.subject": { th: "เรื่อง", en: "Subject" },
  "form.contactServices": { th: "ติดต่อบริการ", en: "Contact Services" },
  "form.askProducts": { th: "สอบถามสินค้า", en: "Ask for Products" },
  "form.support": { th: "สนับสนุน", en: "Support" },
  "form.other": { th: "อื่นๆ", en: "Other" },
  "form.productInterested": { th: "สินค้าที่สนใจ", en: "Product interested" },
  "form.selectProduct": { th: "เลือกสินค้า...", en: "Select product..." },
  "form.fareGate": { th: "ระบบประตูเก็บค่าโดยสาร", en: "Fare Gate Systems" },
  "form.afcIntegration": { th: "ระบบ AFC Integration", en: "AFC Integration" },
  "form.fieldExecution": { th: "งานติดตั้งภาคสนาม", en: "Field Execution" },
  "form.companyLabel": { th: "บริษัท", en: "Company" },
  "form.station": { th: "สถานี / สถานที่", en: "Station / Location" },
  "form.stationPlaceholder": { th: "เช่น MRT บางซื่อ", en: "e.g. MRT Bang Sue" },
  "form.device": { th: "อุปกรณ์", en: "Device" },
  "form.devicePlaceholder": { th: "เช่น ประตู #12", en: "e.g. Fare gate #12" },
  "form.name": { th: "ชื่อ", en: "Name" },
  "form.emailOrPhone": { th: "อีเมลหรือเบอร์โทร", en: "Email or phone" },
  "form.messages": { th: "ข้อความ", en: "Messages" },
  "form.productPlaceholder": { th: "อธิบายสินค้าที่คุณสนใจ...", en: "Describe the product you are interested in..." },
  "form.supportPlaceholder": { th: "อธิบายปัญหาที่สถานี...", en: "Describe the issue at the station..." },
  "form.generalPlaceholder": { th: "เราช่วยอะไรคุณได้บ้าง?", en: "How can we help you?" },
  "form.sending": { th: "กำลังส่ง…", en: "SENDING…" },
  "form.sendMessage": { th: "ส่งข้อความ", en: "SEND MESSAGE" },
  "form.securityProtected": { th: "แบบฟอร์มนี้ได้รับการป้องกันจากข้อความอัตโนมัติ", en: "This form is protected from automated messages." },
  "form.securityUnavailable": { th: "โหลดการตรวจสอบความปลอดภัยไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่", en: "Security verification could not load. Please refresh and try again." },

  // ── Sending Popup ──
  "popup.secureTransmission": { th: "การส่งที่ปลอดภัย", en: "Secure transmission" },
  "popup.sendingTitle": { th: "กำลังส่งข้อความของคุณ", en: "Sending your message" },
  "popup.sendingDesc": { th: "กำลังเชื่อมต่อคำถามของคุณไปยังทีม SIS กรุณาเปิดหน้าต่างนี้ไว้", en: "Connecting your enquiry to the SIS team. Please keep this window open." },
  "popup.messageAccepted": { th: "ข้อความถูกรับแล้ว", en: "Message accepted" },
  "popup.sentSuccess": { th: "ส่งสำเร็จ", en: "Sent successfully" },
  "popup.sentDesc": { th: "ข้อความของคุณกำลังเดินทางไปยังทีม SIS", en: "Your message is on its way to the SIS team." },
  "popup.from": { th: "จาก:", en: "From:" },
  "popup.reference": { th: "เลขอ้างอิง:", en: "Reference:" },
  "popup.subjectLabel": { th: "เรื่อง:", en: "Subject:" },
  "popup.done": { th: "เสร็จสิ้น", en: "Done" },
  "popup.deliveryInterrupted": { th: "การส่งถูกขัดจังหวะ", en: "Delivery interrupted" },
  "popup.notSent": { th: "ส่งข้อความไม่สำเร็จ", en: "Message not sent" },
  "popup.checkConnection": { th: "กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่", en: "Please check your connection and try again." },
  "popup.backToForm": { th: "กลับไปที่ฟอร์ม", en: "Back to form" },

  // ── Footer ──
  "footer.desc": { th: "ประตูเก็บค่าโดยสาร MRT, ระบบ AFC, อุปกรณ์สถานี และการสนับสนุนโครงการ", en: "MRT fare gates, AFC integration, station devices, and project support." },
  "footer.company": {
    th: "บริษัท สยาม อินฟินิตี้ โซลูชั่น จำกัด",
    en: "Siam Infinity Solution Co., Ltd.",
  },
  "footer.address": {
    th: "111/2 ซอยรามคำแหง 94 สะพานสูง กรุงเทพฯ 10240",
    en: "111/2 Ramkhamhaeng 94 Alley, Saphan Sung, Bangkok 10240",
  },
  "footer.tel": { th: "โทร: +66 083-066-2462, 02-001-0518", en: "Tel: +66 083-066-2462, 02-001-0518" },
  "footer.copyright": { th: "© 2026 SIS Siam Infinity Solution สงวนลิขสิทธิ์", en: "© 2026 SIS Siam Infinity Solution. All rights reserved." },

  // ── Mega Menu ──
  "mega.categories": { th: "หมวดหมู่", en: "Categories" },
  "mega.viewAll": { th: "ดูทั้งหมด", en: "View all" },

  // ── Filter Tabs (Projects) ──
  "filter.all": { th: "ทุกโครงการ", en: "All Projects" },
  "filter.fareGate": { th: "ประตูเก็บค่าโดยสาร", en: "Fare Gate" },
  "filter.stationDevice": { th: "อุปกรณ์สถานี", en: "Station Device" },
  "filter.integration": { th: "การเชื่อมต่อระบบ", en: "Integration" },
  "filter.afcSystem": { th: "ระบบ AFC", en: "AFC System" },

  // ── Products Page ──
  "products.allCategories": { th: "สินค้าทุกหมวดหมู่", en: "All Product Categories" },
  "products.allCategoriesDesc": { th: "สำรวจผลิตภัณฑ์คอมพิวเตอร์ฝังตัว, Edge AI และ Digital Signage ของเรา", en: "Explore our comprehensive range of embedded computing, edge AI, and digital signage solutions." },
  "products.productGroups": { th: "กลุ่มสินค้า", en: "Product Groups" },
  "products.viewAllArrow": { th: "ดูทั้งหมด →", en: "View All →" },
  "products.exploreAll": { th: "สำรวจสินค้าทั้งหมดในหมวด", en: "Explore all products in the" },
  "products.category": { th: "หมวดหมู่", en: "category" },
  "products.inquiry": { th: "สอบถาม", en: "Inquiry" },
  "products.datasheet": { th: "ดาวน์โหลด", en: "Datasheet" },
  "products.features": { th: "คุณสมบัติ", en: "Features" },
  "products.specs": { th: "ข้อมูลจำเพาะ", en: "Specifications" },
  "products.ordering": { th: "ข้อมูลการสั่งซื้อ", en: "Ordering Information" },
  "products.keyFeatures": { th: "คุณสมบัติหลัก", en: "Key Features" },
  "products.keyFeaturesDesc": { th: "ชุดคุณสมบัติขั้นสูงที่ปรับให้เหมาะสมสำหรับสภาพแวดล้อม Edge ที่มีความต้องการสูง", en: "Advanced feature set optimized for demanding edge environments." },
  "products.techSpecs": { th: "ข้อมูลจำเพาะทางเทคนิค", en: "Technical Specifications" },
  "products.formFactor": { th: "ฟอร์มแฟกเตอร์", en: "Form Factor" },
  "products.processor": { th: "โปรเซสเซอร์", en: "Processor" },
  "products.processorValue": { th: "หลากหลาย (ดูข้อมูลจำเพาะ)", en: "Various (See Datasheet)" },
  "products.memory": { th: "หน่วยความจำ", en: "Memory" },
  "products.networking": { th: "เครือข่าย", en: "Networking" },
  "products.networkingValue": { th: "พอร์ต Gigabit LAN หลายพอร์ต", en: "Multiple Gigabit LAN ports" },
  "products.operatingTemp": { th: "อุณหภูมิใช้งาน", en: "Operating Temp" },
  "products.operatingTempValue": { th: "-40°C ถึง 85°C (รุ่นขยาย)", en: "-40°C to 85°C (Extended models)" },
  "products.orderingTitle": { th: "ข้อมูลการสั่งซื้อ", en: "Ordering Information" },
  "products.orderingDesc": { th: "ติดต่อทีมขายของเราเพื่อสอบถามราคาและความพร้อมจำหน่าย สามารถกำหนดค่าตามต้องการได้", en: "Contact our sales team for pricing and availability. Custom configurations are available upon request." },
  "products.notFound": { th: "ไม่พบสินค้า", en: "Product not found." },
  "products.home": { th: "หน้าหลัก", en: "Home" },

  // ── Not Found ──
  "notFound.title": { th: "ไม่พบหน้าที่คุณต้องการ", en: "Page not found" },
  "notFound.desc": { th: "ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่แล้ว กรุณากลับไปยังหน้าหลัก", en: "This link may have moved or no longer exists. Please return to the home page." },
  "notFound.action": { th: "กลับหน้าหลัก", en: "Back to home" },

  // ── BNA Product Features ──
  "bna.feature1": { th: "ชิ้นส่วนทดแทนที่ตรงกับวัตถุประสงค์สำหรับอุปกรณ์ BNA", en: "Purpose-matched replacement part for BNA equipment." },
  "bna.feature2": { th: "คัดสรรเพื่อการทำงานที่เชื่อถือได้ในกลไกประตูที่ใช้งานอยู่", en: "Selected for reliable operation in active gate mechanisms." },
  "bna.feature3": { th: "เหมาะสำหรับการบำรุงรักษาตามกำหนดและการเปลี่ยนชิ้นส่วน", en: "Suitable for scheduled maintenance and component replacement." },
  "bna.feature4": { th: "ติดต่อ SIS เพื่อยืนยันความเข้ากันได้ก่อนสั่งซื้อ", en: "Contact SIS to confirm compatibility before ordering." },

  // ── Standard Product Features ──
  "product.feature1": { th: "รองรับแอปพลิเคชันคอมพิวเตอร์อุตสาหกรรมขั้นสูง", en: "Supports advanced industrial computing applications." },
  "product.feature2": { th: "ออกแบบเพื่อความน่าเชื่อถือสูงและการทำงานต่อเนื่อง 24/7", en: "Designed for high reliability and 24/7 continuous operation." },
  "product.feature3": { th: "ช่วงอุณหภูมิการทำงานแบบขยาย", en: "Extended operating temperature range." },
  "product.feature4": { th: "ตัวเลือกการเชื่อมต่อและขยายหลายแบบ", en: "Multiple connectivity and expansion options." },
};

const LangContext = createContext({
  lang: "th",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("sis-lang") || "th";
    } catch {
      return "th";
    }
  });

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("sis-lang", newLang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, replacements) => {
      if (!key) return "";
      const entry = translations[key];
      if (!entry) return key;
      let text = entry[lang] !== undefined && entry[lang] !== null ? entry[lang] : (entry.en || key);
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, v);
        });
      }
      return text;
    },
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      type="button"
      className="lang-toggle"
      data-lang={lang}
      onClick={() => setLang(lang === "th" ? "en" : "th")}
      aria-label={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      <span className={`lang-option${lang === "th" ? " is-active" : ""}`}>TH</span>
      <span className={`lang-option${lang === "en" ? " is-active" : ""}`}>EN</span>
      <span className="lang-active-line" aria-hidden="true" />
    </button>
  );
}
