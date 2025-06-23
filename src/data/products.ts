export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge: string | null;
  description: string;
  detailedDescription: string;
  benefits: string[];
  keyIngredients: {
    name: string;
    amount: string;
    description: string;
  }[];
  servingInfo: {
    servingSize: string;
    servingsPerContainer: number;
    directions: string;
  };
  nutritionFacts: {
    name: string;
    amount: string;
    dailyValue?: string;
  }[];
  features: string[];
  warnings: string[];
  certifications: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  weight: string;
  dimensions: string;
  shelfLife: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Multivitamin Complex",
    category: "vitamins",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 1247,
    image: "/product1.png",
    images: ["/product1.png", "/products.png", "/product2.png"],
    badge: "Best Seller",
    description:
      "Complete daily nutrition with 25+ essential vitamins and minerals",
    detailedDescription:
      "Our Premium Multivitamin Complex is scientifically formulated to provide comprehensive nutritional support for modern lifestyles. Each capsule contains over 25 essential vitamins, minerals, and antioxidants in their most bioavailable forms. This advanced formula includes methylated B-vitamins for better absorption, chelated minerals for enhanced bioavailability, and powerful antioxidants to support cellular health. Perfect for adults looking to fill nutritional gaps and maintain optimal health.",
    benefits: [
      "Immune Support",
      "Energy Boost",
      "Heart Health",
      "Brain Function",
      "Bone Strength",
    ],
    keyIngredients: [
      {
        name: "Vitamin D3 (Cholecalciferol)",
        amount: "2000 IU",
        description:
          "Supports bone health, immune function, and mood regulation",
      },
      {
        name: "Methylcobalamin (B12)",
        amount: "500 mcg",
        description:
          "Active form of B12 for energy production and neurological health",
      },
      {
        name: "Chelated Magnesium",
        amount: "200 mg",
        description:
          "Essential for muscle function, energy production, and relaxation",
      },
      {
        name: "Vitamin C (Ascorbic Acid)",
        amount: "500 mg",
        description:
          "Powerful antioxidant supporting immune health and collagen synthesis",
      },
    ],
    servingInfo: {
      servingSize: "2 capsules",
      servingsPerContainer: 30,
      directions:
        "Take 2 capsules daily with food, preferably in the morning. Do not exceed recommended dose.",
    },
    nutritionFacts: [
      {
        name: "Vitamin A (as Beta-Carotene)",
        amount: "5000 IU",
        dailyValue: "100%",
      },
      {
        name: "Vitamin C (as Ascorbic Acid)",
        amount: "500 mg",
        dailyValue: "556%",
      },
      {
        name: "Vitamin D3 (as Cholecalciferol)",
        amount: "2000 IU",
        dailyValue: "500%",
      },
      {
        name: "Vitamin E (as d-Alpha Tocopherol)",
        amount: "400 IU",
        dailyValue: "1333%",
      },
      { name: "Thiamine (Vitamin B1)", amount: "25 mg", dailyValue: "1667%" },
      { name: "Riboflavin (Vitamin B2)", amount: "25 mg", dailyValue: "1471%" },
      { name: "Niacin (as Niacinamide)", amount: "50 mg", dailyValue: "250%" },
      {
        name: "Vitamin B6 (as Pyridoxal-5-Phosphate)",
        amount: "25 mg",
        dailyValue: "1250%",
      },
      { name: "Folate (as 5-MTHF)", amount: "800 mcg", dailyValue: "200%" },
      {
        name: "Vitamin B12 (as Methylcobalamin)",
        amount: "500 mcg",
        dailyValue: "8333%",
      },
      { name: "Biotin", amount: "300 mcg", dailyValue: "100%" },
      { name: "Pantothenic Acid", amount: "50 mg", dailyValue: "500%" },
    ],
    features: [
      "25+ Essential Nutrients",
      "Methylated B-Vitamins",
      "Chelated Minerals",
      "Third-Party Tested",
      "Non-GMO",
      "Gluten-Free",
      "Vegetarian Capsules",
    ],
    warnings: [
      "Consult your healthcare provider before use if pregnant, nursing, or taking medications",
      "Keep out of reach of children",
      "Do not exceed recommended dose",
      "Discontinue use if adverse reactions occur",
    ],
    certifications: [
      "NSF Certified",
      "GMP Certified",
      "Third-Party Tested",
      "Non-GMO Project Verified",
    ],
    inStock: true,
    stockCount: 150,
    sku: "MV-001-60",
    weight: "4.2 oz",
    dimensions: '2.5" x 2.5" x 4.5"',
    shelfLife: "24 months from manufacture date",
    tags: [
      "multivitamin",
      "daily-nutrition",
      "energy",
      "immune-support",
      "bestseller",
    ],
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil",
    category: "supplements",
    price: 34.99,
    originalPrice: undefined,
    rating: 4.9,
    reviews: 892,
    image: "/product2.png",
    images: ["/product2.png", "/product1.png", "/products.png"],
    badge: "New",
    description:
      "Pure, high-potency omega-3 fatty acids for brain and heart health",
    detailedDescription:
      "Our premium Omega-3 Fish Oil is sourced from wild-caught, sustainable fish and molecularly distilled to ensure purity and potency. Each softgel delivers 1000mg of concentrated omega-3 fatty acids, including 600mg EPA and 400mg DHA. These essential fatty acids support cardiovascular health, brain function, joint mobility, and healthy inflammation response. Our fish oil is tested for mercury, PCBs, and other contaminants to ensure the highest quality and safety standards.",
    benefits: [
      "Brain Function",
      "Heart Health",
      "Joint Support",
      "Eye Health",
      "Mood Balance",
    ],
    keyIngredients: [
      {
        name: "EPA (Eicosapentaenoic Acid)",
        amount: "600 mg",
        description: "Supports heart health and healthy inflammatory response",
      },
      {
        name: "DHA (Docosahexaenoic Acid)",
        amount: "400 mg",
        description: "Essential for brain function, memory, and eye health",
      },
      {
        name: "Other Omega-3 Fatty Acids",
        amount: "100 mg",
        description: "Additional omega-3s for comprehensive support",
      },
    ],
    servingInfo: {
      servingSize: "1 softgel",
      servingsPerContainer: 90,
      directions:
        "Take 1-2 softgels daily with meals. For best results, take consistently.",
    },
    nutritionFacts: [
      { name: "Calories", amount: "10" },
      { name: "Total Fat", amount: "1 g", dailyValue: "1%" },
      { name: "Fish Oil Concentrate", amount: "1000 mg" },
      { name: "EPA (Eicosapentaenoic Acid)", amount: "600 mg" },
      { name: "DHA (Docosahexaenoic Acid)", amount: "400 mg" },
      { name: "Other Omega-3 Fatty Acids", amount: "100 mg" },
    ],
    features: [
      "1000mg Omega-3 per serving",
      "600mg EPA + 400mg DHA",
      "Molecularly Distilled",
      "Mercury Tested",
      "Sustainable Sourcing",
      "Enteric Coated",
      "No Fishy Aftertaste",
    ],
    warnings: [
      "Consult physician if taking blood-thinning medications",
      "Keep refrigerated after opening",
      "May cause mild digestive upset in sensitive individuals",
      "Not suitable for those with fish allergies",
    ],
    certifications: [
      "IFOS Certified",
      "Friend of the Sea",
      "GMP Certified",
      "Third-Party Tested",
    ],
    inStock: true,
    stockCount: 89,
    sku: "O3-002-90",
    weight: "6.1 oz",
    dimensions: '2.8" x 2.8" x 5.2"',
    shelfLife: "24 months from manufacture date",
    tags: ["omega-3", "fish-oil", "heart-health", "brain-support", "new"],
  },
  {
    id: 3,
    name: "Calcium + Vitamin D3",
    category: "minerals",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 634,
    image: "/product3.png",
    images: ["/product3.png", "/product4.png", "/product1.png"],
    badge: "Sale",
    description:
      "Essential for strong bones and teeth with enhanced absorption",
    detailedDescription:
      "Our Calcium + Vitamin D3 formula provides the perfect combination of calcium carbonate and vitamin D3 for optimal bone health. Each tablet delivers 600mg of elemental calcium along with 800 IU of vitamin D3 to enhance calcium absorption. This synergistic combination supports bone density, teeth strength, muscle function, and nerve transmission. Ideal for adults of all ages, especially those at risk for osteoporosis or with limited sun exposure.",
    benefits: [
      "Bone Health",
      "Teeth Strength",
      "Muscle Function",
      "Nerve Support",
      "Osteoporosis Prevention",
    ],
    keyIngredients: [
      {
        name: "Calcium (as Calcium Carbonate)",
        amount: "600 mg",
        description:
          "Essential mineral for bone structure and muscle contraction",
      },
      {
        name: "Vitamin D3 (Cholecalciferol)",
        amount: "800 IU",
        description: "Enhances calcium absorption and supports immune function",
      },
      {
        name: "Magnesium (as Magnesium Oxide)",
        amount: "300 mg",
        description: "Works synergistically with calcium for bone health",
      },
    ],
    servingInfo: {
      servingSize: "2 tablets",
      servingsPerContainer: 45,
      directions:
        "Take 2 tablets daily with meals for best absorption. Separate from iron supplements by 2 hours.",
    },
    nutritionFacts: [
      {
        name: "Calcium (as Calcium Carbonate)",
        amount: "600 mg",
        dailyValue: "60%",
      },
      {
        name: "Vitamin D3 (as Cholecalciferol)",
        amount: "800 IU",
        dailyValue: "200%",
      },
      {
        name: "Magnesium (as Magnesium Oxide)",
        amount: "300 mg",
        dailyValue: "75%",
      },
    ],
    features: [
      "600mg Calcium per serving",
      "800 IU Vitamin D3",
      "Enhanced with Magnesium",
      "Easy-to-Swallow Tablets",
      "USP Grade Ingredients",
      "Third-Party Tested",
      "Gluten-Free",
    ],
    warnings: [
      "Do not exceed 2500mg total daily calcium intake",
      "May cause constipation in some individuals",
      "Consult physician if taking medications",
      "Take with food to reduce stomach upset",
    ],
    certifications: ["USP Verified", "GMP Certified", "Third-Party Tested"],
    inStock: true,
    stockCount: 203,
    sku: "CD-003-90",
    weight: "7.8 oz",
    dimensions: '3.1" x 3.1" x 5.8"',
    shelfLife: "36 months from manufacture date",
    tags: ["calcium", "vitamin-d3", "bone-health", "sale", "minerals"],
  },
  {
    id: 4,
    name: "Vitamin B12 Energy",
    category: "vitamins",
    price: 24.99,
    originalPrice: undefined,
    rating: 4.6,
    reviews: 423,
    image: "/product4.png",
    images: ["/product4.png", "/product5.png", "/product2.png"],
    badge: null,
    description:
      "High-potency B12 for natural energy and nervous system support",
    detailedDescription:
      "Our Vitamin B12 Energy formula features methylcobalamin, the most bioactive form of vitamin B12. Each sublingual tablet provides 5000 mcg of B12 for maximum absorption and effectiveness. This essential vitamin supports energy metabolism, red blood cell formation, nervous system function, and DNA synthesis. Perfect for vegetarians, vegans, older adults, and anyone experiencing fatigue or low energy levels.",
    benefits: [
      "Energy Boost",
      "Brain Health",
      "Metabolism",
      "Nerve Function",
      "Mood Support",
    ],
    keyIngredients: [
      {
        name: "Vitamin B12 (as Methylcobalamin)",
        amount: "5000 mcg",
        description:
          "Active form of B12 for superior absorption and utilization",
      },
      {
        name: "Folate (as 5-MTHF)",
        amount: "400 mcg",
        description: "Works synergistically with B12 for optimal function",
      },
    ],
    servingInfo: {
      servingSize: "1 sublingual tablet",
      servingsPerContainer: 60,
      directions:
        "Place 1 tablet under tongue and allow to dissolve completely. Take daily or as directed by healthcare provider.",
    },
    nutritionFacts: [
      {
        name: "Vitamin B12 (as Methylcobalamin)",
        amount: "5000 mcg",
        dailyValue: "83333%",
      },
      { name: "Folate (as 5-MTHF)", amount: "400 mcg", dailyValue: "100%" },
    ],
    features: [
      "5000 mcg Methylcobalamin",
      "Sublingual for Fast Absorption",
      "Enhanced with Folate",
      "Natural Cherry Flavor",
      "Vegan Friendly",
      "Sugar-Free",
      "Gluten-Free",
    ],
    warnings: [
      "Consult physician if taking medications",
      "High doses may cause mild side effects",
      "Not recommended for children under 12",
      "Store in cool, dry place",
    ],
    certifications: [
      "Vegan Society Certified",
      "GMP Certified",
      "Third-Party Tested",
    ],
    inStock: true,
    stockCount: 78,
    sku: "B12-004-60",
    weight: "2.1 oz",
    dimensions: '2.0" x 2.0" x 3.5"',
    shelfLife: "24 months from manufacture date",
    tags: ["vitamin-b12", "energy", "sublingual", "vegan", "methylcobalamin"],
  },
  {
    id: 5,
    name: "Magnesium Glycinate",
    category: "minerals",
    price: 32.99,
    originalPrice: undefined,
    rating: 4.8,
    reviews: 756,
    image: "/product5.png",
    images: ["/product5.png", "/product3.png", "/product1.png"],
    badge: "Top Rated",
    description: "Gentle, highly absorbable magnesium for relaxation and sleep",
    detailedDescription:
      "Our Magnesium Glycinate provides 400mg of elemental magnesium in the highly bioavailable glycinate form. This chelated form of magnesium is gentle on the stomach and easily absorbed by the body. Magnesium is involved in over 300 enzymatic reactions and supports muscle relaxation, nervous system function, heart health, and quality sleep. This formula is ideal for those seeking natural stress relief and better sleep quality.",
    benefits: [
      "Sleep Quality",
      "Muscle Relaxation",
      "Stress Relief",
      "Heart Health",
      "Bone Support",
    ],
    keyIngredients: [
      {
        name: "Magnesium (as Magnesium Glycinate)",
        amount: "400 mg",
        description:
          "Chelated form for superior absorption and minimal digestive upset",
      },
      {
        name: "Glycine",
        amount: "1600 mg",
        description:
          "Amino acid that enhances magnesium absorption and promotes relaxation",
      },
    ],
    servingInfo: {
      servingSize: "2 capsules",
      servingsPerContainer: 60,
      directions:
        "Take 2 capsules 30-60 minutes before bedtime with water. May also be taken during the day for stress support.",
    },
    nutritionFacts: [
      {
        name: "Magnesium (as Magnesium Glycinate)",
        amount: "400 mg",
        dailyValue: "100%",
      },
      { name: "Glycine", amount: "1600 mg" },
    ],
    features: [
      "400mg Elemental Magnesium",
      "Chelated Glycinate Form",
      "Gentle on Stomach",
      "Enhanced Absorption",
      "Sleep Support Formula",
      "Non-GMO",
      "Vegetarian Capsules",
    ],
    warnings: [
      "May cause drowsiness - do not drive after taking",
      "Start with 1 capsule to assess tolerance",
      "Consult physician if taking medications",
      "May have mild laxative effect in some individuals",
    ],
    certifications: [
      "Non-GMO Project Verified",
      "GMP Certified",
      "Third-Party Tested",
    ],
    inStock: false,
    stockCount: 0,
    sku: "MG-005-120",
    weight: "4.8 oz",
    dimensions: '2.6" x 2.6" x 4.8"',
    shelfLife: "24 months from manufacture date",
    tags: [
      "magnesium",
      "glycinate",
      "sleep",
      "relaxation",
      "top-rated",
      "out-of-stock",
    ],
  },
  {
    id: 6,
    name: "Probiotics Advanced",
    category: "supplements",
    price: 44.99,
    originalPrice: 54.99,
    rating: 4.7,
    reviews: 1089,
    image: "/products.png",
    images: ["/products.png", "/product1.png", "/product2.png"],
    badge: "Sale",
    description: "50 billion CFU multi-strain probiotic for digestive health",
    detailedDescription:
      "Our Probiotics Advanced formula contains 50 billion CFU from 12 clinically studied probiotic strains. This comprehensive blend supports digestive health, immune function, and overall gut balance. Each delayed-release capsule is designed to survive stomach acid and deliver live probiotics directly to the intestines where they're needed most. This formula includes prebiotic fiber to nourish beneficial bacteria and enhance their effectiveness.",
    benefits: [
      "Digestive Health",
      "Immune Support",
      "Gut Balance",
      "Nutrient Absorption",
      "Mood Support",
    ],
    keyIngredients: [
      {
        name: "Lactobacillus acidophilus",
        amount: "15 billion CFU",
        description: "Supports digestive health and nutrient absorption",
      },
      {
        name: "Bifidobacterium lactis",
        amount: "12 billion CFU",
        description: "Promotes immune function and gut barrier health",
      },
      {
        name: "Lactobacillus plantarum",
        amount: "8 billion CFU",
        description: "Supports digestive comfort and reduces bloating",
      },
      {
        name: "Prebiotic Fiber Blend",
        amount: "100 mg",
        description: "Nourishes beneficial bacteria for enhanced effectiveness",
      },
    ],
    servingInfo: {
      servingSize: "1 capsule",
      servingsPerContainer: 30,
      directions:
        "Take 1 capsule daily with or without food. For best results, take at the same time each day. Refrigerate after opening.",
    },
    nutritionFacts: [
      { name: "Probiotic Blend (12 strains)", amount: "50 billion CFU" },
      { name: "Prebiotic Fiber Blend", amount: "100 mg" },
    ],
    features: [
      "50 Billion CFU per capsule",
      "12 Clinically Studied Strains",
      "Delayed-Release Capsules",
      "Includes Prebiotic Fiber",
      "Shelf-Stable Formula",
      "Third-Party Tested",
      "Dairy-Free",
    ],
    warnings: [
      "Refrigerate after opening for maximum potency",
      "May cause mild digestive changes initially",
      "Consult physician if immunocompromised",
      "Keep away from heat and moisture",
    ],
    certifications: [
      "GMP Certified",
      "Third-Party Tested",
      "Dairy-Free Certified",
    ],
    inStock: true,
    stockCount: 67,
    sku: "PB-006-30",
    weight: "2.9 oz",
    dimensions: '2.2" x 2.2" x 4.0"',
    shelfLife: "18 months from manufacture date",
    tags: [
      "probiotics",
      "digestive-health",
      "immune-support",
      "sale",
      "50-billion-cfu",
    ],
  },
];

export const categories = [
  { id: "all", name: "All Products", count: products.length },
  {
    id: "vitamins",
    name: "Vitamins",
    count: products.filter((p) => p.category === "vitamins").length,
  },
  {
    id: "minerals",
    name: "Minerals",
    count: products.filter((p) => p.category === "minerals").length,
  },
  {
    id: "supplements",
    name: "Supplements",
    count: products.filter((p) => p.category === "supplements").length,
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getRelatedProducts = (
  currentProduct: Product,
  limit: number = 4
): Product[] => {
  return products
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        (product.category === currentProduct.category ||
          product.tags.some((tag) => currentProduct.tags.includes(tag)))
    )
    .slice(0, limit);
};
