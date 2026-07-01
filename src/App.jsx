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

const productCatItems = [
  { id: "embedded", label: "Embedded Computing" },
  { id: "ai", label: "Edge AI & System" },
  { id: "panel", label: "Panel PC & Monitor" },
  { id: "signage", label: "Signage & Network" },
  { id: "transport", label: "Transportation" },
  { id: "risc", label: "RISC Platform" },
];

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

const ibase = "https://www.ibase.com.tw";
const img = (file) => `${ibase}/uploads/images/products/Small_255x170px/${file}`;
const url = (path) => `${ibase}/${path}`;

const productCategories = [
  {
    id: "embedded",
    label: "Embedded Computing",
    groups: [
      {
        name: "Motherboard",
        products: [
          { model: "MI1005", name: "Mini-ITX Motherboard", desc: "Intel Core Ultra 200H/200U for AFC controllers.", img: img("small_MI1005.png"), url: url("en/product/category/Embedded_Computing/Motherboard/Mini-ITX_Motherboard/MI1005") },
          { model: "MBB1005", name: "ATX Motherboard", desc: "Intel Core Ultra 200S for central AFC servers.", img: img("small_MBB1005.png"), url: url("en/product/category/Embedded_Computing/Motherboard/ATX_Motherboard/MBB1005") },
          { model: "MB998", name: "Micro ATX Motherboard", desc: "Intel Core 200E/200PE for control systems.", img: img("small_MB998.png"), url: url("en/product/category/Embedded_Computing/Motherboard/Micro_ATX_Motherboard/MB998") },
          { model: "PI800", name: "PICO-ITX Motherboard", desc: "Intel Atom x7000RE ultra-compact for fare gates.", img: img("small_PI800.png"), url: url("en/product/category/Embedded_Computing/Motherboard/PICO_ITX_Motherboard/PI800") },
        ],
      },
      {
        name: "Single Board Computer",
        products: [
          { model: "IB962", name: '3.5" SBC', desc: "Intel Core Ultra 7/5 for trackside environments.", img: img("small_IB962_.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB962") },
          { model: "IB96W", name: '3.5" SBC Wide-Temp', desc: "13th Gen Core wide-temperature for extreme conditions.", img: img("small_IB96W.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB96W") },
          { model: "IB200", name: '2.5" SBC', desc: "AMD Ryzen Embedded R2000 for compact systems.", img: img("small_IB200.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_2_5_Single_Board_Computer/IB200") },
          { model: "IBR117", name: '3.5" ARM SBC', desc: "NXP Cortex-A9 i.MX 6 for low-power edge processing.", img: img("IBR117_255X170px.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_3_5_Single_Board_Computer/IBR117") },
          { model: "IBR215", name: '2.5" ARM SBC', desc: "NXP Cortex-A53 i.MX 8M Plus for AI edge inference.", img: img("small_IBR215.png"), url: url("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_2_5_Single_Board_Computer/IBR215") },
        ],
      },
      {
        name: "CPU Module",
        products: [
          { model: "ET981", name: "COM Express Type 6", desc: "13th Gen Intel Core P-Series for modular designs.", img: img("small_ET981.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET981") },
          { model: "ET980", name: "COM Express Type 6", desc: "12th Gen Intel Core P-series for scalable performance.", img: img("small_ET980.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET980") },
          { model: "IBQ800", name: "Qseven Module", desc: "Intel Atom x7/x5 for compact embedded upgrades.", img: img("small_IBQ800.jpg"), url: url("en/product/category/Embedded_Computing/CPU_Module/QSeven/IBQ800") },
          { model: "ET839", name: "ETX Module", desc: "Intel Atom E3845 for legacy industrial systems.", img: img("small_ET839.png"), url: url("en/product/category/Embedded_Computing/CPU_Module/ETX/ET839") },
        ],
      },
      {
        name: "CPU Card & Accessories",
        products: [
          { model: "IB996", name: "Full-Size CPU Card", desc: "14th/13th/12th Gen Core for central processing.", img: img("small_IB996.png"), url: url("en/product/category/Embedded_Computing/CPU_Card/Full-Size_CPU_Card/IB996") },
          { model: "IP419", name: "COM Express Carrier", desc: "Type 6 carrier board for custom solutions.", img: img("small_IP419.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/COM_Express_Type_6/IP419") },
          { model: "IP416", name: "Qseven Carrier", desc: "Carrier board for Qseven module integration.", img: img("small_IP416.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/Qseven/IP416") },
          { model: "IP412", name: "ETX Carrier", desc: "ETX carrier board for embedded upgrades.", img: img("small_IP412.jpg"), url: url("en/product/category/Embedded_Computing/Carrier_board/ETX_Carrier_Board/IP412") },
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
          { model: "EC3020", name: "Edge AI Computer", desc: "NVIDIA Jetson Orin NX/Nano for passenger counting.", img: img("small_EC3020.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3020") },
          { model: "EC3000", name: "Edge AI Computer", desc: "Jetson Orin for real-time station security AI.", img: img("small_EC3000.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3000") },
          { model: "EC3100", name: "Edge AI Computer", desc: "Jetson Orin with extended I/O for transport AI.", img: img("small_EC3100(1).png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3100") },
          { model: "ES1002", name: "Edge AI Server", desc: "AMD EPYC 8004 for high-throughput AI inferencing.", img: img("small_ES1002.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Server/ES1002") },
          { model: "MI1005", name: "AI Edge Board", desc: "Intel Core Ultra as AI edge inference board.", img: img("small_MI1005.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/AI_Edge_Board/MI1005") },
        ],
      },
      {
        name: "Edge & IoT",
        products: [
          { model: "AGS104T", name: "IoT Edge Gateway", desc: "Ultra-compact Intel Atom for AFC device aggregation.", img: img("small_AGS104T.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104T") },
          { model: "AGS104L", name: "IoT Edge Gateway", desc: "Low-power variant for remote station monitoring.", img: img("small_AGS104L_.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104L") },
          { model: "ACS413", name: "Compact Embedded", desc: "13th Gen Core for real-time station supervision.", img: img("small_ACS413.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ACS_Series_Advanced_Compact_Embedded_System/ACS413") },
          { model: "ARS200", name: "Ruggedized System", desc: "IP65 waterproof for trackside environments.", img: img("small_ARS200.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ARS_Series_Advanced_Ruggedized_System/ARS200") },
        ],
      },
      {
        name: "Embedded System",
        products: [
          { model: "AES100", name: "Expandable System", desc: "14th/13th Gen Core i9 for central concentrators.", img: img("small_AES100.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AES_Series_Advanced_Expandable_System/AES100") },
          { model: "AMI242", name: "Expandable Fanless", desc: "Compact fanless for station device control.", img: img("small_AMI242.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMI_Series_Expandable_Fanless_System/AMI242") },
          { model: "AMS322", name: "Compact Expandable", desc: "11th Gen Core for medium-scale deployments.", img: img("small_AMS322.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMS_Series_Compact_Expandable_Fanless_System/AMS322") },
          { model: "CMB108", name: "Expandable Industrial PC", desc: "65W TDP for heavy processing tasks.", img: img("small_CMB108.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/CMB_Series_Expandable_System/CMB108") },
          { model: "AMS210", name: "Auto Control System", desc: "9th/8th Gen Core for automated fare gates.", img: img("small_AMS210.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Automatic_Control_System/Automatic_Control_System/AMS210") },
        ],
      },
      {
        name: "Compact & Mini System",
        products: [
          { model: "ASB100-PI800", name: "Palm-Sized System", desc: "Intel Atom x7433RE for space-limited kiosks.", img: img("small_ASB100-PI800.png"), url: url("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/ASB_Series/ASB100-PI800") },
          { model: "CP100", name: "Palm-Sized System", desc: "AMD Ryzen R2000 for compact edge computing.", img: img("small_CP100.png"), url: url("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/CP_Series_Edge_Computer_with_IBASE_2_5_PICO_ITX_Board/CP100") },
          { model: "ASB210-962H", name: "Compact System", desc: "Intel Core Ultra 100H for station computing.", img: img("small_ASB210-962H.png"), url: url("en/product/category/Edge_AI_Intelligent_System/SBC_System/ASB_Series_Fanless_System_with_IBASE_3_5_SBC/ASB210-962H") },
          { model: "CSB200-818", name: "Fanless System", desc: "Intel Atom E3940 for low-power station devices.", img: img("small_CSB200-818.jpg"), url: url("en/product/category/Edge_AI_Intelligent_System/SBC_System/CSB_Series_Slim_System_with_IBASE_3_5_SBC/CSB200-818") },
          { model: "CMI300-1001", name: "Slim Mini-ITX System", desc: "Slim system with IBASE Mini-ITX motherboard.", img: img("small_CMI300-1001.png"), url: url("en/product/category/Edge_AI_Intelligent_System/Mini_ITX_System/CMI_Series_System_with_IBASE_Mini_ITX/CMI300-1001") },
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
          { model: "IXPC Series", name: "Modular Panel PC", desc: "Industrial modular panel for operator workstations.", img: img("small_product_IXPC_Series.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Modular_Panel_PC/IXPC") },
          { model: "IPPC Series", name: "Compact Panel PC", desc: "Compact panel PC for station service desks.", img: img("small_IPPC-W07.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Panel_PC/IPPC_Series_Compact_Panel_PC") },
          { model: "IDOOH Series", name: "Sunlight Readable", desc: "Outdoor panel PC for platform info kiosks.", url: url("en/product/category/Panel_PC_Touch_Monitor/Outdoor_Panel_PC/IDOOH_Series_Sunlight_Readable_Panel_PC") },
        ],
      },
      {
        name: "Touch & ODM",
        products: [
          { model: "IPPL Series", name: "Touch Monitor", desc: "Rugged touch monitor for passenger-facing displays.", img: img("small_IPPL-W270.png"), url: url("en/product/category/Panel_PC_Touch_Monitor/Industrial_Touch_Monitor/IPPL_Series") },
          { model: "Smart Retail PC", name: "ODM Panel PC", desc: "Smart retail panel for ticketing kiosks.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Smart_Retail_Panel_PC") },
          { model: "Compact Panel PC", name: "ODM Panel PC", desc: "Compact ODM panel for embedded integration.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Compact_Panel_PC") },
          { model: "Stainless Steel PC", name: "ODM Panel PC", desc: "Stainless steel for sanitary environments.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Stainless_Steel_Panel_PC") },
          { model: "Medical Panel PC", name: "ODM Panel PC", desc: "Medical-grade panel for clinical applications.", url: url("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Medical_Panel_PC") },
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
          { model: "SI-212-N", name: "Entry Signage Player", desc: "Fanless 2x HDMI for PIDS on MRT platforms.", img: img("small_SI-212-N.png"), url: url("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/2_Display_Outputs_Signage_Player/SI-212-N") },
          { model: "SI-121-N", name: "Entry Signage Player", desc: "Intel Core N-Series single HDMI for displays.", img: img("small_SI-121-N.png"), url: url("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/1_Display_Outputs/SI-121-N") },
          { model: "SI-664-N", name: "Perf Signage Player", desc: "Intel Core Ultra 4x HDMI for multi-display PIS.", img: img("small_SI-664-N.png"), url: url("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/4_Display_Outputs/SI_664_N") },
          { model: "SI-663-N", name: "Perf Signage Player", desc: "13th/12th Gen Core 3-output for medium signage.", img: img("small_SI-663-N.png"), url: url("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/3_Display_Outputs/SI-663-N") },
          { model: "SE-603-N", name: "Fanless Signage Player", desc: "11th Gen Core for passenger information.", img: img("small_SE-603-N.png"), url: url("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Outdoor_Signage_Player/SE-603-N") },
          { model: "SW-602-N", name: "Waterproof Signage", desc: "IP-rated outdoor for platform displays.", img: img("small_SW-602-N.png"), url: url("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Waterproof_Signage_Player/SW-602-N") },
          { model: "ISR215", name: "ARM Signage", desc: "NXP i.MX 8M Plus energy-efficient signage.", img: img("small_ISR215.png"), url: url("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/NXP_i_MX8M_based_Signage_Player/ISR215") },
          { model: "ISR500", name: "ARM Signage", desc: "MediaTek Genio 700 for high-performance ARM signage.", img: img("small_ISR500.png"), url: url("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/MediaTek_Genio-based_Signage_Player/ISR500") },
        ],
      },
      {
        name: "Video Wall",
        products: [
          { model: "SP-63ER", name: "Video Wall Player", desc: "8th Gen Core 16x HDMI for large video walls.", img: img("small_SP-63E_ER.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/16_Display_Outputs/SP-63ER") },
          { model: "SI-636", name: "Video Wall Player", desc: "13th/12th Gen Core 6x HDMI for multi-display.", img: img("small_SI-636.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/6_Display_Outputs/SI-636") },
          { model: "SI-624", name: "Video Wall Player", desc: "NVIDIA MXM 4x DP for high-res walls.", img: img("small_SI-624.png"), url: url("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/4_Display_Outputs/SI-624") },
        ],
      },
      {
        name: "Network Appliance",
        products: [
          { model: "INA7605", name: "2U Network Appliance", desc: "Dual Xeon 64 GbE for central networking.", img: img("small_INA7605_Preliminary.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_2U_Network_Appliance/INA7605") },
          { model: "INA7302", name: "1U Perf Appliance", desc: "AMD Ryzen 14 GbE for station aggregation.", img: img("small_INA7302.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_1U_Network_Appliance/INA7302") },
          { model: "INA3605", name: "1U Enterprise", desc: "Xeon E-2300 16 GbE for network core.", img: img("small_INA3605_EOL.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Enterprise_1U_Network_Appliance/INA3605") },
          { model: "INA3608", name: "1U Security Server", desc: "14th/13th/12th Core 16GbE+10G for security.", img: img("small_INA3606.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Mainstream_1U_Network_Appliance/INA3608") },
          { model: "INA2205", name: "1U Entry", desc: "Intel Atom 8 GbE for compact edge.", img: img("small_INA2205_Preliminary.png"), url: url("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Entry_1U_Network_Appliance/INA2205") },
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
          { model: "MPT-R Series", name: "Railway Computer", desc: "EN 50155 certified for onboard AFC communication.", url: url("en/product/category/Intelligent_Transportation/Railway_Computer_System/MPT_R_Series_EN50155_Certified_Railway_Computer") },
          { model: "MPT-V Series", name: "In-Vehicle Computer", desc: "E-Mark certified for depot operations.", url: url("en/product/category/Intelligent_Transportation/In_Vehicle_Computer_System/MPT_V_Series_E_mark_Certified_In_Vehicle_Computer") },
          { model: "MPT-3100V-AI", name: "AI Transport System", desc: "ITxPT edge AI for intelligent transport.", img: img("small_MPT-3100V.png"), url: url("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Transportation_System/MPT-3100V-AI") },
        ],
      },
      {
        name: "Railway HMI",
        products: [
          { model: "MPPC Series", name: "Railway Panel PC", desc: "Railway touch panel for cab interfaces.", url: url("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/MPPC_Series_EN50155_Transportation_Panel_PC") },
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
          { model: "SMARC Module", name: "NXP SMARC Module", desc: "ARM SMARC 2.1 module for low-power systems.", img: img("small_RM-N95.png"), url: url("en/product/category/RISC_Platform/SMARC_Module/NXP_i_MX8M_based_SMARC_Module") },
          { model: "SMARC Carrier 2.1", name: "SMARC Carrier", desc: "Carrier board for SMARC 2.1 module.", img: img("small_product_RP_103_1_0.png"), url: url("en/product/category/RISC_Platform/Carrier_Board_for_SMARC_Module/SMARC_2_1_Carrier_Board") },
        ],
      },
      {
        name: "RISC SBC",
        products: [
          { model: '3.5" RISC SBC', name: "ARM SBC", desc: '3.5" ARM SBC for embedded control.', img: img("small_IBR500.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/3_5_Disk_Size_SBC") },
          { model: '2.5" RISC SBC', name: "ARM SBC", desc: '2.5" ARM SBC for compact deployments.', img: img("small_IBR300.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/2_5_Disk_Size_SBC") },
          { model: "Ultra-Compact SBC", name: "ARM SBC", desc: "Ultra-compact ARM for deeply embedded systems.", img: img("small_IBR-SMB.png"), url: url("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/Ultra_Compact_Single_Board_Computer") },
        ],
      },
      {
        name: "ARM System",
        products: [
          { model: "Edge Computer", name: "RISC Edge System", desc: "ARM edge computer for IoT connectivity.", img: img("small_ISR500.png"), url: url("en/product/category/RISC_Platform/RISC_based_Edge_Computing_System/Edge_Computer") },
          { model: "IPR Series", name: "ARM HMI", desc: "ARM-based HMI for operator interfaces.", img: img("small_IPR-P04F-N.jpg"), url: url("en/product/category/RISC_Platform/ARM_based_HMI/IPR_Series_Industrial_HMI") },
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
  const [productCat, setProductCat] = useState("embedded");

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

  function handleNavigateProduct(catId) {
    setProductCat(catId);
    navigate("products");
  }

  const currentPage = useMemo(() => {
    return {
      home: <HomePage navigate={navigate} />,
      about: <AboutPage />,
      services: <ServicesPage />,
      projects: <ProjectsPage />,
      products: <ProductsPage productCat={productCat} />,
      contact: <ContactPage formStatus={formStatus} onSubmit={handleContactSubmit} />,
    }[route];
  }, [route, formStatus, productCat]);

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
      <Header route={route} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} navHidden={navHidden} showNav={showNav} onNavigateProduct={handleNavigateProduct} />
      <main className="page-shell">{currentPage}</main>
      <Footer navigate={navigate} />
    </>
  );
}

function Header({ route, menuOpen, setMenuOpen, navigate, navHidden, showNav, onNavigateProduct }) {
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
        {navItems.map((item) =>
          item.id === "products" ? (
            <div key={item.id} className="nav-dropdown">
              <button
                type="button"
                className={route === item.id ? "nav-link is-active" : "nav-link"}
                onClick={() => navigate(item.id)}
              >
                {item.label}
              </button>
              <div className="nav-dropdown-menu">
                {productCatItems.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="nav-dropdown-item"
                    onClick={() => onNavigateProduct(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              key={item.id}
              type="button"
              className={route === item.id ? "nav-link is-active" : "nav-link"}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </button>
          )
        )}
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

function ProductsPage({ productCat }) {
  const [activeCat, setActiveCat] = useState(productCat || "embedded");
  const [failedImgs, setFailedImgs] = useState({});

  const handleImgError = (model) => {
    setFailedImgs((prev) => ({ ...prev, [model]: true }));
  };

  const active = productCategories.find((c) => c.id === activeCat) || productCategories[0];

  // Sync with external productCat prop (e.g. from nav dropdown)
  useEffect(() => {
    if (productCat && productCat !== activeCat) {
      setActiveCat(productCat);
    }
  }, [productCat]);

  // Reset image error state on category switch so images retry loading
  useEffect(() => {
    setFailedImgs({});
  }, [activeCat]);

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
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="product-card-inner">
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
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-model">{product.model}</h3>
                      <p className="product-desc">{product.desc}</p>
                      <span className="product-readmore">
                        Read More
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
                          <path d="M5 12h13" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </a>
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
          <p>Tel: +66 089 924 3843, 02-001-0518</p>
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
          Tel: +66 089 924 3843, 02-001-0518
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
