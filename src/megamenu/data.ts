import type { MenuData, NavLink } from "./types";

/**
 * Sample menu data for the demo.
 *
 * Product imagery is sourced from iBASE's public product image CDN and is used
 * here only as placeholder content for the demo's preview panel. Replace
 * `baseUrl` / `img` fields with your own assets before shipping.
 */
const baseUrl = "https://www.ibase.com.tw";
const img = (file: string) =>
  `${baseUrl}/uploads/images/products/Small_255x170px/${file}`;
const link = (path: string) => `${baseUrl}/${path}`;

const productCategories = [
  {
    id: "embedded",
    label: "Embedded Computing",
    blurb:
      "Industrial motherboards, single-board computers, and CPU modules engineered for 24/7 station operation.",
    groups: [
      {
        id: "embedded-motherboard",
        name: "Motherboard",
        tagline: "Mini-ITX · ATX · PICO-ITX",
        products: [
          { model: "MI1005", name: "Mini-ITX Motherboard", desc: "Intel Core Ultra 200H/200U for AFC controllers.", img: img("small_MI1005.png"), url: link("en/product/category/Embedded_Computing/Motherboard/Mini-ITX_Motherboard/MI1005") },
          { model: "MBB1005", name: "ATX Motherboard", desc: "Intel Core Ultra 200S for central AFC servers.", img: img("small_MBB1005.png"), url: link("en/product/category/Embedded_Computing/Motherboard/ATX_Motherboard/MBB1005") },
          { model: "MB998", name: "Micro ATX Motherboard", desc: "Intel Core 200E/200PE for control systems.", img: img("small_MB998.png"), url: link("en/product/category/Embedded_Computing/Motherboard/Micro_ATX_Motherboard/MB998") },
          { model: "PI800", name: "PICO-ITX Motherboard", desc: "Intel Atom x7000RE ultra-compact for fare gates.", img: img("small_PI800.png"), url: link("en/product/category/Embedded_Computing/Motherboard/PICO_ITX_Motherboard/PI800") },
        ],
      },
      {
        id: "embedded-single-board-computer",
        name: "Single Board Computer",
        tagline: "3.5″ · 2.5″ · ARM",
        products: [
          { model: "IB962", name: '3.5″ SBC', desc: "Intel Core Ultra 7/5 for trackside environments.", img: img("small_IB962_.png"), url: link("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB962") },
          { model: "IB96W", name: '3.5″ SBC Wide-Temp', desc: "13th Gen Core wide-temperature for extreme conditions.", img: img("small_IB96W.png"), url: link("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_3_5_Single_Board_Computer/IB96W") },
          { model: "IB200", name: '2.5″ SBC', desc: "AMD Ryzen Embedded R2000 for compact systems.", img: img("small_IB200.png"), url: link("en/product/category/Embedded_Computing/Single_Board_Computer/x86_based_2_5_Single_Board_Computer/IB200") },
          { model: "IBR117", name: '3.5″ ARM SBC', desc: "NXP Cortex-A9 i.MX 6 for low-power edge processing.", img: img("IBR117_255X170px.png"), url: link("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_3_5_Single_Board_Computer/IBR117") },
          { model: "IBR215", name: '2.5″ ARM SBC', desc: "NXP Cortex-A53 i.MX 8M Plus for AI edge inference.", img: img("small_IBR215.png"), url: link("en/product/category/Embedded_Computing/Single_Board_Computer/ARM_based_2_5_Single_Board_Computer/IBR215") },
        ],
      },
      {
        id: "embedded-cpu-module",
        name: "CPU Module",
        tagline: "COM Express · Qseven · ETX",
        products: [
          { model: "ET981", name: "COM Express Type 6", desc: "13th Gen Intel Core P-Series for modular designs.", img: img("small_ET981.png"), url: link("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET981") },
          { model: "ET980", name: "COM Express Type 6", desc: "12th Gen Intel Core P-series for scalable performance.", img: img("small_ET980.png"), url: link("en/product/category/Embedded_Computing/CPU_Module/COM_Express/ET980") },
          { model: "IBQ800", name: "Qseven Module", desc: "Intel Atom x7/x5 for compact embedded upgrades.", img: img("small_IBQ800.jpg"), url: link("en/product/category/Embedded_Computing/CPU_Module/QSeven/IBQ800") },
          { model: "ET839", name: "ETX Module", desc: "Intel Atom E3845 for legacy industrial systems.", img: img("small_ET839.png"), url: link("en/product/category/Embedded_Computing/CPU_Module/ETX/ET839") },
        ],
      },
      {
        id: "embedded-cpu-card-accessories",
        name: "CPU Card & Accessories",
        tagline: "Full-size · Carrier boards",
        products: [
          { model: "IB996", name: "Full-Size CPU Card", desc: "14th/13th/12th Gen Core for central processing.", img: img("small_IB996.png"), url: link("en/product/category/Embedded_Computing/CPU_Card/Full-Size_CPU_Card/IB996") },
          { model: "IP419", name: "COM Express Carrier", desc: "Type 6 carrier board for custom solutions.", img: img("small_IP419.jpg"), url: link("en/product/category/Embedded_Computing/Carrier_board/COM_Express_Type_6/IP419") },
          { model: "IP416", name: "Qseven Carrier", desc: "Carrier board for Qseven module integration.", img: img("small_IP416.jpg"), url: link("en/product/category/Embedded_Computing/Carrier_board/Qseven/IP416") },
          { model: "IP412", name: "ETX Carrier", desc: "ETX carrier board for embedded upgrades.", img: img("small_IP412.jpg"), url: link("en/product/category/Embedded_Computing/Carrier_board/ETX_Carrier_Board/IP412") },
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "Edge AI & System",
    blurb:
      "NVIDIA Jetson and AMD-powered edge platforms for real-time AI inference at the station.",
    groups: [
      {
        id: "ai-ai-computing",
        name: "AI Computing",
        tagline: "Jetson Orin · EPYC",
        products: [
          { model: "EC3020", name: "Edge AI Computer", desc: "NVIDIA Jetson Orin NX/Nano for passenger counting.", img: img("small_EC3020.png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3020") },
          { model: "EC3000", name: "Edge AI Computer", desc: "Jetson Orin for real-time station security AI.", img: img("small_EC3000.png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3000") },
          { model: "EC3100", name: "Edge AI Computer", desc: "Jetson Orin with extended I/O for transport AI.", img: img("small_EC3100(1).png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Computer/EC3100") },
          { model: "ES1002", name: "Edge AI Server", desc: "AMD EPYC 8004 for high-throughput AI inferencing.", img: img("small_ES1002.png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Server/ES1002") },
          { model: "MI1005", name: "AI Edge Board", desc: "Intel Core Ultra as AI edge inference board.", img: img("small_MI1005.png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/AI_Edge_Board/MI1005") },
        ],
      },
      {
        id: "ai-edge-iot",
        name: "Edge & IoT",
        tagline: "Gateways · Ruggedized",
        products: [
          { model: "AGS104T", name: "IoT Edge Gateway", desc: "Ultra-compact Intel Atom for AFC device aggregation.", img: img("small_AGS104T.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104T") },
          { model: "AGS104L", name: "IoT Edge Gateway", desc: "Low-power variant for remote station monitoring.", img: img("small_AGS104L_.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/AGS_Series_IoT_Gateway_Edge_Computing_System/AGS104L") },
          { model: "ACS413", name: "Compact Embedded", desc: "13th Gen Core for real-time station supervision.", img: img("small_ACS413.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ACS_Series_Advanced_Compact_Embedded_System/ACS413") },
          { model: "ARS200", name: "Ruggedized System", desc: "IP65 waterproof for trackside environments.", img: img("small_ARS200.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Edge_Computing_Wide_Temperature_System/ARS_Series_Advanced_Ruggedized_System/ARS200") },
        ],
      },
      {
        id: "ai-embedded-system",
        name: "Embedded System",
        tagline: "Expandable · Fanless",
        products: [
          { model: "AES100", name: "Expandable System", desc: "14th/13th Gen Core i9 for central concentrators.", img: img("small_AES100.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AES_Series_Advanced_Expandable_System/AES100") },
          { model: "AMI242", name: "Expandable Fanless", desc: "Compact fanless for station device control.", img: img("small_AMI242.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMI_Series_Expandable_Fanless_System/AMI242") },
          { model: "AMS322", name: "Compact Expandable", desc: "11th Gen Core for medium-scale deployments.", img: img("small_AMS322.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/AMS_Series_Compact_Expandable_Fanless_System/AMS322") },
          { model: "CMB108", name: "Expandable Industrial PC", desc: "65W TDP for heavy processing tasks.", img: img("small_CMB108.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Expandable_Embedded_System/CMB_Series_Expandable_System/CMB108") },
          { model: "AMS210", name: "Auto Control System", desc: "9th/8th Gen Core for automated fare gates.", img: img("small_AMS210.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Automatic_Control_System/Automatic_Control_System/AMS210") },
        ],
      },
      {
        id: "ai-compact-mini-system",
        name: "Compact & Mini System",
        tagline: "Palm-sized · PICO-ITX",
        products: [
          { model: "ASB100-PI800", name: "Palm-Sized System", desc: "Intel Atom x7433RE for space-limited kiosks.", img: img("small_ASB100-PI800.png"), url: link("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/ASB_Series/ASB100-PI800") },
          { model: "CP100", name: "Palm-Sized System", desc: "AMD Ryzen R2000 for compact edge computing.", img: img("small_CP100.png"), url: link("en/product/category/Edge_AI_Intelligent_System/PICO_ITX_System/CP_Series_Edge_Computer_with_IBASE_2_5_PICO_ITX_Board/CP100") },
          { model: "ASB210-962H", name: "Compact System", desc: "Intel Core Ultra 100H for station computing.", img: img("small_ASB210-962H.png"), url: link("en/product/category/Edge_AI_Intelligent_System/SBC_System/ASB_Series_Fanless_System_with_IBASE_3_5_SBC/ASB210-962H") },
          { model: "CSB200-818", name: "Fanless System", desc: "Intel Atom E3940 for low-power station devices.", img: img("small_CSB200-818.jpg"), url: link("en/product/category/Edge_AI_Intelligent_System/SBC_System/CSB_Series_Slim_System_with_IBASE_3_5_SBC/CSB200-818") },
          { model: "CMI300-1001", name: "Slim Mini-ITX System", desc: "Slim system with IBASE Mini-ITX motherboard.", img: img("small_CMI300-1001.png"), url: link("en/product/category/Edge_AI_Intelligent_System/Mini_ITX_System/CMI_Series_System_with_IBASE_Mini_ITX/CMI300-1001") },
        ],
      },
    ],
  },
  {
    id: "panel",
    label: "Panel PC & Monitor",
    blurb:
      "Operator HMI panels, touch monitors, and sunlight-readable displays for stations and platforms.",
    groups: [
      {
        id: "panel-panel-pc",
        name: "Panel PC",
        tagline: "Modular · Compact · Outdoor",
        products: [
          { model: "IXPC Series", name: "Modular Panel PC", desc: "Industrial modular panel for operator workstations.", img: img("small_product_IXPC_Series.png"), url: link("en/product/category/Panel_PC_Touch_Monitor/Industrial_Modular_Panel_PC/IXPC") },
          { model: "IPPC Series", name: "Compact Panel PC", desc: "Compact panel PC for station service desks.", img: img("small_IPPC-W07.png"), url: link("en/product/category/Panel_PC_Touch_Monitor/Industrial_Panel_PC/IPPC_Series_Compact_Panel_PC") },
          { model: "IDOOH Series", name: "Sunlight Readable", desc: "Outdoor panel PC for platform info kiosks.", url: link("en/product/category/Panel_PC_Touch_Monitor/Outdoor_Panel_PC/IDOOH_Series_Sunlight_Readable_Panel_PC") },
        ],
      },
      {
        id: "panel-touch-odm",
        name: "Touch & ODM",
        tagline: "Touch monitors · Custom",
        products: [
          { model: "IPPL Series", name: "Touch Monitor", desc: "Rugged touch monitor for passenger-facing displays.", img: img("small_IPPL-W270.png"), url: link("en/product/category/Panel_PC_Touch_Monitor/Industrial_Touch_Monitor/IPPL_Series") },
          { model: "Smart Retail PC", name: "ODM Panel PC", desc: "Smart retail panel for ticketing kiosks.", url: link("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Smart_Retail_Panel_PC") },
          { model: "Compact Panel PC", name: "ODM Panel PC", desc: "Compact ODM panel for embedded integration.", url: link("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Compact_Panel_PC") },
          { model: "Stainless Steel PC", name: "ODM Panel PC", desc: "Stainless steel for sanitary environments.", url: link("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Stainless_Steel_Panel_PC") },
          { model: "Medical Panel PC", name: "ODM Panel PC", desc: "Medical-grade panel for clinical applications.", url: link("en/product/category/Panel_PC_Touch_Monitor/ODM_Panel_PC/Medical_Panel_PC") },
        ],
      },
    ],
  },
  {
    id: "signage",
    label: "Signage & Network",
    blurb:
      "Digital-signage players, video-wall controllers, and rackmount network appliances.",
    groups: [
      {
        id: "signage-signage-player",
        name: "Signage Player",
        tagline: "Entry · Performance · Outdoor",
        products: [
          { model: "SI-212-N", name: "Entry Signage Player", desc: "Fanless 2× HDMI for PIDS on MRT platforms.", img: img("small_SI-212-N.png"), url: link("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/2_Display_Outputs_Signage_Player/SI-212-N") },
          { model: "SI-121-N", name: "Entry Signage Player", desc: "Intel Core N-Series single HDMI for displays.", img: img("small_SI-121-N.png"), url: link("en/product/category/Digital_Signage_Player/Entry_Level_Signage_Player/1_Display_Outputs/SI-121-N") },
          { model: "SI-664-N", name: "Perf Signage Player", desc: "Intel Core Ultra 4× HDMI for multi-display PIS.", img: img("small_SI-664-N.png"), url: link("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/4_Display_Outputs/SI_664_N") },
          { model: "SI-663-N", name: "Perf Signage Player", desc: "13th/12th Gen Core 3-output for medium signage.", img: img("small_SI-663-N.png"), url: link("en/product/category/Digital_Signage_Player/Mid_Range_Signage_Player/3_Display_Outputs/SI-663-N") },
          { model: "SE-603-N", name: "Fanless Signage Player", desc: "11th Gen Core for passenger information.", img: img("small_SE-603-N.png"), url: link("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Outdoor_Signage_Player/SE-603-N") },
          { model: "SW-602-N", name: "Waterproof Signage", desc: "IP-rated outdoor for platform displays.", img: img("small_SW-602-N.png"), url: link("en/product/category/Digital_Signage_Player/Outdoor_Waterproof_Signage_Player/Waterproof_Signage_Player/SW-602-N") },
          { model: "ISR215", name: "ARM Signage", desc: "NXP i.MX 8M Plus energy-efficient signage.", img: img("small_ISR215.png"), url: link("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/NXP_i_MX8M_based_Signage_Player/ISR215") },
          { model: "ISR500", name: "ARM Signage", desc: "MediaTek Genio 700 for high-performance ARM signage.", img: img("small_ISR500.png"), url: link("en/product/category/Digital_Signage_Player/ARM_based_Signage_Player/MediaTek_Genio-based_Signage_Player/ISR500") },
        ],
      },
      {
        id: "signage-video-wall",
        name: "Video Wall",
        tagline: "Multi-display controllers",
        products: [
          { model: "SP-63ER", name: "Video Wall Player", desc: "8th Gen Core 16× HDMI for large video walls.", img: img("small_SP-63E_ER.png"), url: link("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/16_Display_Outputs/SP-63ER") },
          { model: "SI-636", name: "Video Wall Player", desc: "13th/12th Gen Core 6× HDMI for multi-display.", img: img("small_SI-636.png"), url: link("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/6_Display_Outputs/SI-636") },
          { model: "SI-624", name: "Video Wall Player", desc: "NVIDIA MXM 4× DP for high-res walls.", img: img("small_SI-624.png"), url: link("en/product/category/Digital_Signage_Player/Extreme_Performance_Signage_Player/4_Display_Outputs/SI-624") },
        ],
      },
      {
        id: "signage-network-appliance",
        name: "Network Appliance",
        tagline: "1U · 2U rackmount",
        products: [
          { model: "INA7605", name: "2U Network Appliance", desc: "Dual Xeon 64 GbE for central networking.", img: img("small_INA7605_Preliminary.png"), url: link("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_2U_Network_Appliance/INA7605") },
          { model: "INA7302", name: "1U Perf Appliance", desc: "AMD Ryzen 14 GbE for station aggregation.", img: img("small_INA7302.png"), url: link("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Performance_1U_Network_Appliance/INA7302") },
          { model: "INA3605", name: "1U Enterprise", desc: "Xeon E-2300 16 GbE for network core.", img: img("small_INA3605_EOL.png"), url: link("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Enterprise_1U_Network_Appliance/INA3605") },
          { model: "INA3608", name: "1U Security Server", desc: "14th/13th/12th Core 16GbE+10G for security.", img: img("small_INA3606.png"), url: link("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Mainstream_1U_Network_Appliance/INA3608") },
          { model: "INA2205", name: "1U Entry", desc: "Intel Atom 8 GbE for compact edge.", img: img("small_INA2205_Preliminary.png"), url: link("en/product/category/Network_Appliance/Rackmount_Network_Appliance/Entry_1U_Network_Appliance/INA2205") },
        ],
      },
    ],
  },
  {
    id: "transport",
    label: "Transportation",
    blurb:
      "EN 50155 railway computers and E-Mark in-vehicle systems for onboard AFC and PIS.",
    groups: [
      {
        id: "transport-railway-system",
        name: "Railway System",
        tagline: "EN 50155 · E-Mark",
        products: [
          { model: "MPT-R Series", name: "Railway Computer", desc: "EN 50155 certified for onboard AFC communication.", url: link("en/product/category/Intelligent_Transportation/Railway_Computer_System/MPT_R_Series_EN50155_Certified_Railway_Computer") },
          { model: "MPT-V Series", name: "In-Vehicle Computer", desc: "E-Mark certified for depot operations.", url: link("en/product/category/Intelligent_Transportation/In_Vehicle_Computer_System/MPT_V_Series_E_mark_Certified_In_Vehicle_Computer") },
          { model: "MPT-3100V-AI", name: "AI Transport System", desc: "ITxPT edge AI for intelligent transport.", img: img("small_MPT-3100V.png"), url: link("en/product/category/Edge_AI_Intelligent_System/AI_Computing_Platform/Edge_AI_Transportation_System/MPT-3100V-AI") },
        ],
      },
      {
        id: "transport-railway-hmi",
        name: "Railway HMI",
        tagline: "Cab panels · PIS displays",
        products: [
          { model: "MPPC Series", name: "Railway Panel PC", desc: "Railway touch panel for cab interfaces.", url: link("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/MPPC_Series_EN50155_Transportation_Panel_PC") },
          { model: "BYTEM Series", name: "Railway Panel PC", desc: "Compact railway panel for onboard info.", url: link("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/BYTEM_Series_Railway_Panel_PC") },
          { model: "MRD Series", name: "Bar-Type PIS Display", desc: "Ultra-wide bar display for platform PIS.", url: link("en/product/category/Intelligent_Transportation/Transportation_Panel_PC/MRD_Series_Bar_Type_PIS_Panel_PC") },
        ],
      },
    ],
  },
  {
    id: "risc",
    label: "RISC Platform",
    blurb:
      "ARM-based SMARC modules, RISC single-board computers, and edge systems for low-power deployments.",
    groups: [
      {
        id: "risc-module-carrier",
        name: "Module & Carrier",
        tagline: "SMARC 2.1",
        products: [
          { model: "SMARC Module", name: "NXP SMARC Module", desc: "ARM SMARC 2.1 module for low-power systems.", img: img("small_RM-N95.png"), url: link("en/product/category/RISC_Platform/SMARC_Module/NXP_i_MX8M_based_SMARC_Module") },
          { model: "SMARC Carrier 2.1", name: "SMARC Carrier", desc: "Carrier board for SMARC 2.1 module.", img: img("small_product_RP_103_1_0.png"), url: link("en/product/category/RISC_Platform/Carrier_Board_for_SMARC_Module/SMARC_2_1_Carrier_Board") },
        ],
      },
      {
        id: "risc-risc-sbc",
        name: "RISC SBC",
        tagline: "3.5″ · 2.5″ · Ultra-compact",
        products: [
          { model: '3.5″ RISC SBC', name: "ARM SBC", desc: '3.5″ ARM SBC for embedded control.', img: img("small_IBR500.png"), url: link("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/3_5_Disk_Size_SBC") },
          { model: '2.5″ RISC SBC', name: "ARM SBC", desc: '2.5″ ARM SBC for compact deployments.', img: img("small_IBR300.png"), url: link("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/2_5_Disk_Size_SBC") },
          { model: "Ultra-compact SBC", name: "ARM SBC", desc: "Ultra-compact ARM for deeply embedded systems.", img: img("small_IBR-SMB.png"), url: link("en/product/category/RISC_Platform/RISC_based_Single_Board_Computer/Ultra_Compact_Single_Board_Computer") },
        ],
      },
      {
        id: "risc-arm-system",
        name: "ARM System",
        tagline: "Edge · HMI",
        products: [
          { model: "Edge Computer", name: "RISC Edge System", desc: "ARM edge computer for IoT connectivity.", img: img("small_ISR500.png"), url: link("en/product/category/RISC_Platform/RISC_based_Edge_Computing_System/Edge_Computer") },
          { model: "IPR Series", name: "ARM HMI", desc: "ARM-based HMI for operator interfaces.", img: img("small_IPR-P04F-N.jpg"), url: link("en/product/category/RISC_Platform/ARM_based_HMI/IPR_Series_Industrial_HMI") },
        ],
      },
    ],
  },
];

/** Top-level navigation used by the demo. */
export const menuLinks: NavLink[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "company", label: "Company", href: "#company" },
  {
    id: "products",
    label: "Products",
    href: "#products",
    meta: {
      title: "Products",
      subtitle: "Industrial computing built for transit infrastructure",
    },
    categories: productCategories,
  },
  { id: "applications", label: "Applications", href: "#applications" },
  { id: "support", label: "Support", href: "#support" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/** The full menu payload consumed by <Navbar/>. */
export const menuData: MenuData = { links: menuLinks };
