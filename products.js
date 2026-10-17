/* =====================================================================
   RA19 DIGITAL ASSETS — STORE DATA
   This is the single source of truth for the whole website.
   Both index.html and product.html read from here.

   ── HOW TO ADD A PRODUCT ─────────────────────────────────────────────
   1. Copy any product object below and paste it into `products`.
   2. Fill in the fields. Every field is optional EXCEPT:
        slug      – unique id, used in the URL (product.html?slug=YOUR-SLUG)
        name      – product title
        category  – must match a category id in `categories` below
        price     – display price, e.g. "$49"
   3. To sell it, set `status: "live"` and paste your Creem checkout link
      into `checkout` (Dashboard → Products → Share → prod_xxxxx).
   4. Set `status: "coming"` to hide the buy button while you build it.
   5. Set `featured: true` to pin it to the homepage "Featured" row.
   ─────────────────────────────────────────────────────────────────────
   ===================================================================== */

const STORE = {
  brand: {
    name: "RA19 Digital Assets",
    tagline: "Ready-to-use templates, creative tools & digital solutions",
    headline: ["Your premium vault for", "high-performance digital assets."],
    intro:
      "Stop starting from scratch. Get professionally engineered templates and toolkits — built to streamline your workflow and accelerate growth.",
    supportEmail: "support@example.com"
  },

  /* ---- CATEGORIES ----------------------------------------------------
     Add a new object here to create a new product section on the
     homepage. `id` is what products reference in their `category` field.
     ------------------------------------------------------------------- */
  categories: [
    {
      id: "aviation",
      name: "Aviation Annual Audit Packages",
      short: "Aviation",
      tagline:
        "ICAO / IOSA / MRO & AOC compliance and audit kits — complete, editable, regulator-mapped.",
      icon: "✈️",
      colors: ["#22d3ee", "#7c3aed"]
    }
  ],

  /* ---- PRODUCTS ------------------------------------------------------ */
  products: [
    {
      slug: "complete-audit-package",
      category: "aviation",
      name: "Aviation Annual Audit Package — Complete",
      subtitle: "ICAO + IOSA + MRO/AOC in one toolkit",
      price: "$399",
      oldPrice: "$597+",
      badge: "BEST VALUE",
      featured: true,
      status: "live",
      image: "store-assets/product-complete.png",
      summary:
        "Three complete audit frameworks. One toolkit. Zero starting from scratch. If you work in aviation quality, safety or compliance, you already know what the annual audit cycle demands — this is the shortcut.",
      bullets: [
        "ICAO / USOAP CMA State CAA audit templates, mapped to the 8 Critical Elements",
        "IATA IOSA operator & MRO annual audit templates",
        "EASA Part-145, FAA Part-145 & CAAP MRO/AOC audit systems",
        "Everything fully editable in Word & Excel"
      ],
      includes: [
        "Complete ICAO / USOAP CMA audit framework",
        "Complete IATA IOSA audit framework",
        "Complete MRO & AOC (EASA / FAA / CAAP) framework",
        "Audit checklists, planning & scheduling templates",
        "Finding / non-conformance tracking sheets",
        "Audit report & closing-loop templates",
        "Editable source files (Word + Excel)"
      ],
      specs: {
        Formats: "Microsoft Word (.docx) + Excel (.xlsx)",
        Coverage: "ICAO / USOAP, IATA IOSA, EASA, FAA, CAAP",
        License: "Commercial, unlimited internal use",
        Delivery: "Instant download after payment",
        Updates: "Lifetime"
      },
      regulators: ["ICAO", "USOAP CMA", "IOSA", "EASA", "FAA", "CAAP"],
      checkout: "https://creem.io/payment/prod_REPLACE_COMPLETE"
    },

    {
      slug: "mro-aoc-audit-package",
      category: "aviation",
      name: "Aviation Annual Audit Package — MRO & AOC",
      subtitle: "EASA / FAA / CAAP",
      price: "$199",
      oldPrice: "",
      badge: "",
      featured: false,
      status: "live",
      image: "store-assets/product-mro-aoc.png",
      summary:
        "Three regulator-specific audit systems in one toolkit. MRO and Air Operator Certificate annual audits under EASA Part-145, FAA Part-145 and CAAP requirements.",
      bullets: [
        "EASA / FAA / CAAP coverage",
        "MRO + AOC annual audits",
        "Editable Word & Excel templates"
      ],
      includes: [
        "EASA Part-145 MRO annual audit system",
        "FAA Part-145 MRO annual audit system",
        "CAAP MRO & AOC annual audit system",
        "Audit checklists & planning templates",
        "Finding / NC tracking sheets",
        "Editable source files (Word + Excel)"
      ],
      specs: {
        Formats: "Microsoft Word (.docx) + Excel (.xlsx)",
        Coverage: "EASA Part-145, FAA Part-145, CAAP",
        License: "Commercial, unlimited internal use",
        Delivery: "Instant download after payment",
        Updates: "Lifetime"
      },
      regulators: ["EASA", "FAA", "CAAP"],
      checkout: "https://creem.io/payment/prod_REPLACE_MRO_AOC"
    },

    {
      slug: "iosa-audit-package",
      category: "aviation",
      name: "Aviation Annual Audit Package — IOSA",
      subtitle: "IATA IOSA framework",
      price: "$149",
      oldPrice: "",
      badge: "",
      featured: false,
      status: "live",
      image: "store-assets/product-iosa.png",
      summary:
        "Operator & MRO annual audit templates aligned to the IATA IOSA framework. Prepare for and maintain IOSA registration with a complete, editable annual audit system.",
      bullets: [
        "Aligned to IATA IOSA standards",
        "Operator & MRO editions",
        "Finding & NC tracking built in"
      ],
      includes: [
        "IOSA operator annual audit templates",
        "IOSA MRO annual audit templates",
        "Audit checklists & scheduling sheets",
        "Finding / NC tracking sheets",
        "Editable source files (Word + Excel)"
      ],
      specs: {
        Formats: "Microsoft Word (.docx) + Excel (.xlsx)",
        Coverage: "IATA IOSA",
        License: "Commercial, unlimited internal use",
        Delivery: "Instant download after payment",
        Updates: "Lifetime"
      },
      regulators: ["IOSA"],
      checkout: "https://creem.io/payment/prod_REPLACE_IOSA"
    },

    {
      slug: "icao-usoap-audit-package",
      category: "aviation",
      name: "Aviation Annual Audit Package — ICAO / USOAP CMA",
      subtitle: "8 Critical Elements mapped",
      price: "$149",
      oldPrice: "",
      badge: "",
      featured: false,
      status: "live",
      image: "store-assets/product-icao-usoap.png",
      summary:
        "State CAA annual audit templates mapped to the 8 Critical Elements. Prepare your civil aviation authority for ICAO USOAP CMA with a complete, editable framework.",
      bullets: [
        "Mapped to the 8 Critical Elements",
        "State CAA audit scope",
        "Full report template set"
      ],
      includes: [
        "State CAA annual audit framework",
        "8 Critical Elements mapping sheets",
        "Audit checklists & planning templates",
        "Full report template set",
        "Editable source files (Word + Excel)"
      ],
      specs: {
        Formats: "Microsoft Word (.docx) + Excel (.xlsx)",
        Coverage: "ICAO USOAP CMA",
        License: "Commercial, unlimited internal use",
        Delivery: "Instant download after payment",
        Updates: "Lifetime"
      },
      regulators: ["ICAO", "USOAP CMA"],
      checkout: "https://creem.io/payment/prod_REPLACE_ICAO_USOAP"
    }
  ],

  /* ---- FAQ (edit freely; add more objects to add more questions) ----- */
  faq: [
    {
      q: "What's inside each audit package?",
      a: "A complete, editable annual audit framework: audit checklists, planning and scheduling templates, finding/NC trackers, report templates and closing-loop procedures — all mapped to the relevant regulator requirements."
    },
    {
      q: "Which formats do I get?",
      a: "Microsoft Word and Excel files. Everything is fully editable — rebrand it, translate it, extend it to your own organization. No specialized software required."
    },
    {
      q: "How do I receive my files after paying?",
      a: "Checkout is handled by Creem. As soon as payment confirms you're redirected to your download page, and a receipt with your links lands in your inbox. Delivery is instant."
    },
    {
      q: "Which payment methods can I use?",
      a: "Visa, Mastercard, Amex, PayPal, Apple Pay and Google Pay, plus local methods depending on your country. Prices display in your local currency at checkout where available."
    },
    {
      q: "Do you offer refunds?",
      a: "Digital goods are delivered instantly, so refunds are handled case by case. If a package genuinely doesn't match its description, contact me within 14 days and I'll make it right."
    },
    {
      q: "Can I use these templates inside my organization?",
      a: "Yes — a purchase includes a commercial license for use within your organization (unlimited internal users). You may not resell, redistribute or publicly share the files themselves."
    }
  ]
};
