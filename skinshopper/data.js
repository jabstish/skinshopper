// SkinShopper product catalog (extracted from current site screenshots)
// Made global on window for cross-file access.

window.BRANDS = [
  { id: "hugo-boss",     name: "Hugo Boss",       wordmark: "HUGO BOSS",     category: "parfum" },
  { id: "calvin-klein",  name: "Calvin Klein",    wordmark: "Calvin Klein",  category: "parfum" },
  { id: "la-roche-posay",name: "La Roche-Posay",  wordmark: "LA ROCHE-POSAY",category: "skincare", accent: "#0099d8" },
  { id: "vichy",         name: "Vichy",           wordmark: "VICHY",         category: "skincare" },
  { id: "skinceuticals", name: "SkinCeuticals",   wordmark: "SkinCeuticals", category: "skincare" },
  { id: "lancaster",     name: "Lancaster",       wordmark: "LANCASTER",     category: "skincare", accent: "#ee6c1d" },
  { id: "cerave",        name: "CeraVe",          wordmark: "CeraVe",        category: "skincare" },
  { id: "clarins",       name: "Clarins",         wordmark: "CLARINS",       category: "skincare" },
];

// shape: bottle | spray | jar | tube | dropper | pouch | flacon
window.PRODUCTS = [
  // === PARFUM ===
  { id: "p01", brand: "hugo-boss", name: "BOSS The Scent For Her Eau de Parfum", size: "50ml", price: 49.00, oldPrice: null, category: "parfum", sub: "Damesparfum", shape: "flacon", tint: "#7a1840", stock: 12, rating: 4.6, reviews: 184, bestseller: true, scent: ["bloemig", "oriëntaals"] },
  { id: "p02", brand: "hugo-boss", name: "Boss Orange Man Eau de Toilette", size: "100ml", price: 23.94, oldPrice: 31.44, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#e9d8b8", stock: 8, rating: 4.4, reviews: 92, scent: ["fris", "houtig"] },
  { id: "p03", brand: "hugo-boss", name: "Hugo Intense Eau de Parfum Spray", size: "75ml", price: 34.00, oldPrice: null, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#c4242a", stock: 4, rating: 4.3, reviews: 56, scent: ["aromatisch", "kruidig"] },
  { id: "p04", brand: "hugo-boss", name: "Boss Bottled Eau de Parfum", size: "200ml", price: 117.99, oldPrice: 128.99, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#1a1a1a", stock: 6, rating: 4.7, reviews: 312, bestseller: true, scent: ["houtig", "kruidig"] },
  { id: "p05", brand: "hugo-boss", name: "BOSS Bottled Parfum", size: "50ml", price: 44.00, oldPrice: 54.99, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#1a1a1a", stock: 15, rating: 4.7, reviews: 89, scent: ["houtig", "kruidig"] },
  { id: "p06", brand: "hugo-boss", name: "Boss Bottled Night Eau de Toilette", size: "200ml", price: 49.95, oldPrice: 54.00, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#0a1942", stock: 7, rating: 4.5, reviews: 124, scent: ["houtig", "oriëntaals"] },
  { id: "p07", brand: "hugo-boss", name: "Boss Bottled Deospray", size: "150ml", price: 14.50, oldPrice: 15.82, category: "parfum", sub: "Herendeodorant", shape: "spray", tint: "#9a9a9a", stock: 24, rating: 4.5, reviews: 41 },
  { id: "p08", brand: "hugo-boss", name: "Boss In Motion Eau de Toilette Spray", size: "100ml", price: 27.00, oldPrice: null, category: "parfum", sub: "Unisex", shape: "flacon", tint: "#dd7c2e", stock: 9, rating: 4.4, reviews: 67, scent: ["fris", "citrus"] },
  { id: "p09", brand: "hugo-boss", name: "Boss Bottled Infinite Eau de Parfum", size: "50ml", price: 34.98, oldPrice: 51.25, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#11233f", stock: 11, rating: 4.6, reviews: 78, scent: ["aromatisch"] },
  { id: "p10", brand: "hugo-boss", name: "BOSS The Scent Parfum", size: "100ml", price: 77.00, oldPrice: null, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#5b2118", stock: 5, rating: 4.8, reviews: 203, bestseller: true, scent: ["oriëntaals", "kruidig"] },
  { id: "p11", brand: "hugo-boss", name: "Boss Bottled Unlimited Eau de Toilette", size: "100ml", price: 44.97, oldPrice: 51.99, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#f0e8d8", stock: 3, rating: 4.5, reviews: 64, scent: ["fris", "kruidig"] },
  { id: "p12", brand: "hugo-boss", name: "Boss Bottled Eau de Parfum", size: "50ml", price: 42.99, oldPrice: 44.99, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#c9b896", stock: 14, rating: 4.7, reviews: 256, scent: ["houtig"] },
  { id: "p13", brand: "hugo-boss", name: "Boss Bottled Aftershave Lotion", size: "100ml", price: 36.62, oldPrice: 38.99, category: "parfum", sub: "Herenaftershave", shape: "flacon", tint: "#e3d3a8", stock: 8, rating: 4.5, reviews: 47 },
  { id: "p14", brand: "hugo-boss", name: "Boss Bottled Eau de Toilette", size: "30ml", price: 26.85, oldPrice: 28.49, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#dcc89a", stock: 18, rating: 4.6, reviews: 134, scent: ["houtig"] },
  { id: "p15", brand: "calvin-klein", name: "Euphoria Eau de Parfum", size: "50ml", price: 31.00, oldPrice: 34.26, category: "parfum", sub: "Damesparfum", shape: "flacon", tint: "#2d1218", stock: 9, rating: 4.6, reviews: 287, bestseller: true, scent: ["oriëntaals", "fruitig"] },
  { id: "p16", brand: "calvin-klein", name: "Eternity For Women Eau de Parfum", size: "100ml", price: 33.99, oldPrice: 46.99, category: "parfum", sub: "Damesparfum", shape: "flacon", tint: "#f4ecda", stock: 11, rating: 4.7, reviews: 392, scent: ["bloemig"] },
  { id: "p17", brand: "calvin-klein", name: "Eternity Romantische Bloemige Damesparfum", size: "50ml", price: 24.98, oldPrice: 37.48, category: "parfum", sub: "Damesparfum", shape: "flacon", tint: "#eee4cf", stock: 6, rating: 4.5, reviews: 168, scent: ["bloemig"] },
  { id: "p18", brand: "calvin-klein", name: "DEFY Eau de Parfum Spray", size: "50ml", price: 24.00, oldPrice: 45.00, category: "parfum", sub: "Herenparfum", shape: "flacon", tint: "#10243e", stock: 2, rating: 4.5, reviews: 142, scent: ["houtig", "fris"] },
  { id: "p19", brand: "calvin-klein", name: "CK Everyone Eau de Toilette", size: "200ml", price: 36.00, oldPrice: 40.99, category: "parfum", sub: "Unisex", shape: "flacon", tint: "#f5f3ee", stock: 13, rating: 4.4, reviews: 91, scent: ["fris", "citrus"] },
  { id: "p20", brand: "calvin-klein", name: "CK Euphoria Eau de Parfum", size: "100ml", price: 35.00, oldPrice: 44.99, category: "parfum", sub: "Damesparfum", shape: "flacon", tint: "#6b1232", stock: 4, rating: 4.6, reviews: 215, scent: ["oriëntaals", "fruitig"] },

  // === LA ROCHE-POSAY (skincare) ===
  { id: "s01", brand: "la-roche-posay", name: "Retinol B3 Serum voor een egale teint", size: "30ml", price: 37.72, oldPrice: 45.45, category: "skincare", sub: "Serum", shape: "dropper", tint: "#a8324a", stock: 7, rating: 4.7, reviews: 248, bestseller: true, concern: ["anti-aging", "pigmentvlekken"] },
  { id: "s02", brand: "la-roche-posay", name: "Redermic Retinol Dagcrème", size: "30ml", price: 34.08, oldPrice: 36.95, category: "skincare", sub: "Dagcrème", shape: "tube", tint: "#ffffff", stock: 12, rating: 4.6, reviews: 156, concern: ["anti-aging"] },
  { id: "s03", brand: "la-roche-posay", name: "Pure Vitamine C12 Serum Anti-Rimpel Anti-Oneffenheden", size: "30ml", price: 40.65, oldPrice: 43.95, category: "skincare", sub: "Serum", shape: "dropper", tint: "#f4a637", stock: 9, rating: 4.7, reviews: 312, bestseller: true, concern: ["anti-aging", "doffe huid"] },
  { id: "s04", brand: "la-roche-posay", name: "Pure Vitamine C Anti-Aging Oogcrème", size: "15ml", price: 33.00, oldPrice: null, category: "skincare", sub: "Oogcrème", shape: "tube", tint: "#ffffff", stock: 14, rating: 4.5, reviews: 87, concern: ["anti-aging", "wallen"] },
  { id: "s05", brand: "la-roche-posay", name: "Pure Vitamine C Licht Anti-Aging Dagcrème", size: "40ml", price: 39.00, oldPrice: null, category: "skincare", sub: "Dagcrème", shape: "tube", tint: "#ffffff", stock: 8, rating: 4.6, reviews: 134, concern: ["anti-aging"] },
  { id: "s06", brand: "la-roche-posay", name: "Hyalu B5 Suractivated Crème SPF 30", size: "40ml", price: 39.95, oldPrice: null, category: "skincare", sub: "Dagcrème SPF", shape: "jar", tint: "#1d8ed4", stock: 16, rating: 4.8, reviews: 421, bestseller: true, concern: ["hydratatie", "anti-aging"] },
  { id: "s07", brand: "la-roche-posay", name: "Effaclar Ultra Geconcentreerd Serum", size: "30ml", price: 32.47, oldPrice: 38.09, category: "skincare", sub: "Serum", shape: "dropper", tint: "#7fc7a8", stock: 3, rating: 4.7, reviews: 198, concern: ["acne", "onzuiverheden"] },
  { id: "s08", brand: "la-roche-posay", name: "Effaclar Reinigende Schuimende Gel Navulling", size: "400ml", price: 26.99, oldPrice: null, category: "skincare", sub: "Reiniger", shape: "pouch", tint: "#1d8ed4", stock: 22, rating: 4.6, reviews: 145, concern: ["acne", "onzuiverheden"] },
  { id: "s09", brand: "la-roche-posay", name: "Effaclar micro-exfoliërende adstringerende lotion", size: "200ml", price: 18.01, oldPrice: 22.40, category: "skincare", sub: "Lotion", shape: "flacon", tint: "#2196d3", stock: 11, rating: 4.5, reviews: 87, concern: ["acne", "onzuiverheden"] },
  { id: "s10", brand: "la-roche-posay", name: "Effaclar Mat dagcrème voor een vette huid", size: "40ml", price: 23.79, oldPrice: null, category: "skincare", sub: "Dagcrème", shape: "tube", tint: "#ffffff", stock: 17, rating: 4.5, reviews: 102, concern: ["acne", "vette huid"] },
  { id: "s11", brand: "la-roche-posay", name: "Effaclar H Iso-biome Hydraterende Reinigingscrème", size: "390ml", price: 27.35, oldPrice: null, category: "skincare", sub: "Reiniger", shape: "flacon", tint: "#dceaf3", stock: 9, rating: 4.6, reviews: 73, concern: ["acne", "droge huid"] },
  { id: "s12", brand: "la-roche-posay", name: "Effaclar H Iso-biome Hydraterende Crème", size: "40ml", price: 26.67, oldPrice: null, category: "skincare", sub: "Crème", shape: "tube", tint: "#dceaf3", stock: 13, rating: 4.6, reviews: 88, concern: ["acne", "droge huid"] },
  { id: "s13", brand: "la-roche-posay", name: "Effaclar Duo+M Crème — Helpt Puistjes Verminderen", size: "40ml", price: 17.99, oldPrice: 19.99, category: "skincare", sub: "Crème", shape: "tube", tint: "#dceaf3", stock: 5, rating: 4.7, reviews: 267, bestseller: true, concern: ["acne", "onzuiverheden"] },
  { id: "s14", brand: "la-roche-posay", name: "Effaclar Duo+ SPF30 voor onzuivere huid", size: "40ml", price: 18.99, oldPrice: 19.99, category: "skincare", sub: "Dagcrème SPF", shape: "tube", tint: "#1c8bcf", stock: 18, rating: 4.7, reviews: 312, concern: ["acne", "onzuiverheden"] },
  { id: "s15", brand: "la-roche-posay", name: "Cicaplast Balsem B5 SPF50 — Ondersteunt herstel", size: "40ml", price: 17.49, oldPrice: null, category: "skincare", sub: "Balsem", shape: "tube", tint: "#1c8bcf", stock: 14, rating: 4.8, reviews: 489, bestseller: true, concern: ["herstel", "gevoelige huid"] },
  { id: "s16", brand: "la-roche-posay", name: "Anthelios UVMUNE 400 Oil Control SPF50+ Gel-Crème", size: "50ml", price: 19.95, oldPrice: null, category: "skincare", sub: "Zonbescherming", shape: "tube", tint: "#ef7d27", stock: 21, rating: 4.7, reviews: 198, concern: ["zonbescherming", "vette huid"] },
  { id: "s17", brand: "la-roche-posay", name: "Anthelios Age Correct SPF 50 — Anti-foto-veroudering", size: "50ml", price: 22.95, oldPrice: null, category: "skincare", sub: "Zonbescherming", shape: "tube", tint: "#dceaf3", stock: 9, rating: 4.6, reviews: 76, concern: ["zonbescherming", "anti-aging"] },
  { id: "s18", brand: "la-roche-posay", name: "Anthelios UVMUNE 400 Onzichtbare Zonnebrand Fluide SPF50+", size: "50ml", price: 19.99, oldPrice: null, category: "skincare", sub: "Zonbescherming", shape: "tube", tint: "#ef7d27", stock: 7, rating: 4.7, reviews: 254, bestseller: true, concern: ["zonbescherming"] },

  // === VICHY ===
  { id: "v01", brand: "vichy", name: "Pureté Thermale Tonic voor gevoelige huid", size: "200ml", price: 19.99, oldPrice: null, category: "skincare", sub: "Tonic", shape: "flacon", tint: "#a8dde0", stock: 12, rating: 4.5, reviews: 87, concern: ["gevoelige huid", "hydratatie"] },
  { id: "v02", brand: "vichy", name: "Pureté Thermale Cleansing Foam Radiance Revealer", size: "150ml", price: 16.95, oldPrice: null, category: "skincare", sub: "Reiniger", shape: "tube", tint: "#a8dde0", stock: 9, rating: 4.4, reviews: 64, concern: ["doffe huid"] },
  { id: "v03", brand: "vichy", name: "Neovadiol Verstevigende, Liftende Dagcrème", size: "50ml", price: 36.92, oldPrice: 41.99, category: "skincare", sub: "Dagcrème", shape: "jar", tint: "#e8c247", stock: 6, rating: 4.7, reviews: 198, bestseller: true, concern: ["anti-aging", "verstevigend"] },
  { id: "v04", brand: "vichy", name: "Neovadiol Longevity Dagcrème — Voor gevoelige rijpere huid", size: "50ml", price: 60.13, oldPrice: 65.00, category: "skincare", sub: "Dagcrème", shape: "jar", tint: "#e8c247", stock: 4, rating: 4.7, reviews: 142, concern: ["anti-aging"] },
  { id: "v05", brand: "vichy", name: "Neovadiol Longevity Cream", size: "50ml", price: 86.90, oldPrice: null, category: "skincare", sub: "Crème", shape: "jar", tint: "#e8c247", stock: 3, rating: 4.8, reviews: 89, concern: ["anti-aging"] },
  { id: "v06", brand: "vichy", name: "Neovadiol Corrigerende Oogverzorging", size: "15ml", price: 28.87, oldPrice: 35.99, category: "skincare", sub: "Oogcrème", shape: "tube", tint: "#e8c247", stock: 8, rating: 4.6, reviews: 124, concern: ["anti-aging", "wallen"] },
  { id: "v07", brand: "vichy", name: "Minéral 89 72H Moisture Boosting Cream", size: "50ml", price: 23.90, oldPrice: null, category: "skincare", sub: "Hydraterende Crème", shape: "jar", tint: "#2dc1d9", stock: 14, rating: 4.8, reviews: 376, bestseller: true, concern: ["hydratatie"] },
  { id: "v08", brand: "vichy", name: "Liftactiv H.A. Anti-rimpel Dagcrème — droge huid", size: "50ml", price: 36.45, oldPrice: null, category: "skincare", sub: "Dagcrème", shape: "jar", tint: "#ffffff", stock: 7, rating: 4.6, reviews: 187, concern: ["anti-aging", "droge huid"] },
  { id: "v09", brand: "vichy", name: "Liftactiv Collagen Specialist 16 Glow Boosting Gel", size: "50ml", price: 35.95, oldPrice: null, category: "skincare", sub: "Gel", shape: "tube", tint: "#e54a2c", stock: 5, rating: 4.7, reviews: 98, concern: ["anti-aging", "doffe huid"] },
  { id: "v10", brand: "vichy", name: "Dercos Energie Aminexil Shampoo — sterker en vitaler haar", size: "400ml", price: 19.80, oldPrice: null, category: "haar", sub: "Shampoo", shape: "flacon", tint: "#3a4d5e", stock: 11, rating: 4.5, reviews: 76, concern: ["haaruitval"] },
  { id: "v11", brand: "vichy", name: "Dercos Collagen 17 Filler Conditioner", size: "200ml", price: 19.90, oldPrice: null, category: "haar", sub: "Conditioner", shape: "tube", tint: "#dc3c2a", stock: 9, rating: 4.5, reviews: 54, concern: ["haarverzorging"] },

  // === SKINCEUTICALS ===
  { id: "sc01", brand: "skinceuticals", name: "P-Tiox Serum", size: "30ml", price: 139.00, oldPrice: null, category: "skincare", sub: "Serum", shape: "dropper", tint: "#bababa", stock: 5, rating: 4.8, reviews: 87, concern: ["anti-aging"] },
  { id: "sc02", brand: "skinceuticals", name: "Cell Cycle Catalyst", size: "30ml", price: 89.00, oldPrice: 98.94, category: "skincare", sub: "Serum", shape: "dropper", tint: "#3a2a16", stock: 7, rating: 4.7, reviews: 64, concern: ["anti-aging", "doffe huid"] },
  { id: "sc03", brand: "skinceuticals", name: "Silymarin CF Serum", size: "30ml", price: 149.00, oldPrice: null, category: "skincare", sub: "Serum", shape: "dropper", tint: "#bfe1f0", stock: 4, rating: 4.7, reviews: 142, concern: ["acne", "anti-aging"] },
  { id: "sc04", brand: "skinceuticals", name: "Serum Phloretin CF", size: "30ml", price: 139.00, oldPrice: 142.70, category: "skincare", sub: "Serum", shape: "dropper", tint: "#d4a02e", stock: 6, rating: 4.8, reviews: 198, bestseller: true, concern: ["anti-aging", "pigmentvlekken"] },
  { id: "sc05", brand: "skinceuticals", name: "Resveratrol B E Antioxidant Night Serum", size: "30ml", price: 178.00, oldPrice: null, category: "skincare", sub: "Nachtserum", shape: "dropper", tint: "#1d1d1d", stock: 3, rating: 4.8, reviews: 76, concern: ["anti-aging"] },
  { id: "sc06", brand: "skinceuticals", name: "Replenishing Cleanser Cream", size: "150ml", price: 39.99, oldPrice: null, category: "skincare", sub: "Reiniger", shape: "tube", tint: "#ffffff", stock: 14, rating: 4.6, reviews: 89, concern: ["droge huid"] },
  { id: "sc07", brand: "skinceuticals", name: "Phyto Corrective Hydrating Serum", size: "30ml", price: 75.00, oldPrice: null, category: "skincare", sub: "Serum", shape: "dropper", tint: "#84c186", stock: 8, rating: 4.7, reviews: 124, concern: ["hydratatie", "rode huid"] },
  { id: "sc08", brand: "skinceuticals", name: "Nachtserum Resveratrol", size: "30ml", price: 139.00, oldPrice: null, category: "skincare", sub: "Nachtserum", shape: "dropper", tint: "#1d1d1d", stock: 6, rating: 4.8, reviews: 67, concern: ["anti-aging"] },
  { id: "sc09", brand: "skinceuticals", name: "Hydrating B5 Serum", size: "30ml", price: 70.00, oldPrice: 75.86, category: "skincare", sub: "Serum", shape: "dropper", tint: "#bfe1f0", stock: 9, rating: 4.7, reviews: 234, concern: ["hydratatie"] },
  { id: "sc10", brand: "skinceuticals", name: "HA Intensifier Multi-Glycan", size: "30ml", price: 99.00, oldPrice: 124.95, category: "skincare", sub: "Serum", shape: "dropper", tint: "#4f2b6b", stock: 5, rating: 4.7, reviews: 156, concern: ["hydratatie", "anti-aging"] },
  { id: "sc11", brand: "skinceuticals", name: "Discoloration Defense Serum", size: "30ml", price: 108.00, oldPrice: null, category: "skincare", sub: "Serum", shape: "dropper", tint: "#bfe1f0", stock: 7, rating: 4.7, reviews: 89, concern: ["pigmentvlekken"] },
  { id: "sc12", brand: "skinceuticals", name: "Correct P-Tiox Serum", size: "30ml", price: 159.00, oldPrice: null, category: "skincare", sub: "Serum", shape: "dropper", tint: "#1d1d1d", stock: 4, rating: 4.8, reviews: 54, concern: ["anti-aging"] },
  { id: "sc13", brand: "skinceuticals", name: "A.G.E. Advanced Eye", size: "15ml", price: 99.00, oldPrice: null, category: "skincare", sub: "Oogcrème", shape: "jar", tint: "#1d1d1d", stock: 6, rating: 4.7, reviews: 78, concern: ["anti-aging", "wallen"] },

  // === LANCASTER ===
  { id: "l01", brand: "lancaster", name: "Sun Beauty Face Cream SPF30", size: "50ml", price: 25.75, oldPrice: null, category: "skincare", sub: "Zonbescherming", shape: "tube", tint: "#ee6c1d", stock: 12, rating: 4.6, reviews: 87, concern: ["zonbescherming"] },
  { id: "l02", brand: "lancaster", name: "Sun Beauty Dry Body Oil SPF50", size: "150ml", price: 39.99, oldPrice: null, category: "skincare", sub: "Lichaamsolie SPF", shape: "spray", tint: "#bd4d11", stock: 9, rating: 4.7, reviews: 142, bestseller: true, concern: ["zonbescherming"] },
  { id: "l03", brand: "lancaster", name: "Sun Beauty Body Milk SPF30", size: "175ml", price: 27.99, oldPrice: null, category: "skincare", sub: "Lichaamsmelk SPF", shape: "flacon", tint: "#ee6c1d", stock: 14, rating: 4.6, reviews: 76, concern: ["zonbescherming"] },
  { id: "l04", brand: "lancaster", name: "Golden Tan Maximizer After Sun Lotion", size: "125ml", price: 23.99, oldPrice: null, category: "skincare", sub: "Aftersun", shape: "tube", tint: "#d97e3a", stock: 8, rating: 4.5, reviews: 64, concern: ["aftersun"] },
  { id: "l05", brand: "lancaster", name: "Tan Maximizer Soothing Moisturizer", size: "125ml", price: 30.00, oldPrice: 38.49, category: "skincare", sub: "Crème", shape: "tube", tint: "#d97e3a", stock: 5, rating: 4.6, reviews: 89, concern: ["aftersun"] },
];

// Skin concerns shown on home + PLP
window.SKIN_CONCERNS = [
  { id: "anti-aging",        label: "Anti-aging",      icon: "✦" },
  { id: "acne",              label: "Acne / Onzuiver", icon: "◐" },
  { id: "hydratatie",        label: "Hydratatie",      icon: "◇" },
  { id: "pigmentvlekken",    label: "Pigmentvlekken",  icon: "◑" },
  { id: "gevoelige huid",    label: "Gevoelige huid",  icon: "○" },
  { id: "doffe huid",        label: "Doffe huid",      icon: "◎" },
  { id: "zonbescherming",    label: "Zonbescherming",  icon: "☀" },
  { id: "droge huid",        label: "Droge huid",      icon: "◯" },
];

window.SCENT_FAMILIES = [
  { id: "fris",       label: "Fris" },
  { id: "houtig",     label: "Houtig" },
  { id: "oriëntaals", label: "Oriëntaals" },
  { id: "bloemig",    label: "Bloemig" },
  { id: "kruidig",    label: "Kruidig" },
  { id: "citrus",     label: "Citrus" },
  { id: "fruitig",    label: "Fruitig" },
  { id: "aromatisch", label: "Aromatisch" },
];

window.CATEGORIES = [
  { id: "parfum",        label: "Parfum",        sub: "20 producten" },
  { id: "skincare",      label: "Huidverzorging",sub: "44 producten" },
  { id: "zonbescherming",label: "Zonbescherming",sub: "8 producten" },
  { id: "haar",          label: "Haar",          sub: "2 producten" },
  { id: "sale",          label: "Sale",          sub: "Tot −35%" },
];

// Helpers
window.findProduct = (id) => window.PRODUCTS.find(p => p.id === id);
window.findBrand = (id) => window.BRANDS.find(b => b.id === id);
window.formatPrice = (n) => "€" + n.toFixed(2).replace(".", ",");
