import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

const benefits = [
  {
    title: "Immunity Boost",
    description:
      "Strengthen your immune system with targeted vitamins and minerals designed to keep you healthy year-round.",
    icon: "🛡️",
    color: "from-emerald-400 to-teal-500",
    bgPattern: "bg-gradient-to-br from-emerald-50 to-teal-50",
  },
  {
    title: "Energy Enhancement",
    description:
      "Boost your natural energy levels with carefully selected B-vitamins and energy-supporting nutrients.",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
    bgPattern: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
  {
    title: "Better Sleep",
    description:
      "Improve your sleep quality with natural ingredients that promote relaxation and restful nights.",
    icon: "😴",
    color: "from-purple-400 to-indigo-500",
    bgPattern: "bg-gradient-to-br from-purple-50 to-indigo-50",
  },
  {
    title: "Heart Health",
    description:
      "Support cardiovascular wellness with heart-healthy omega-3s, CoQ10, and other vital nutrients.",
    icon: "❤️",
    color: "from-red-400 to-pink-500",
    bgPattern: "bg-gradient-to-br from-red-50 to-pink-50",
  },
  {
    title: "Mental Clarity",
    description:
      "Enhance cognitive function and focus with brain-boosting nutrients and nootropics.",
    icon: "🧠",
    color: "from-blue-400 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    title: "Digestive Health",
    description:
      "Support gut health with probiotics, prebiotics, and digestive enzymes for optimal nutrient absorption.",
    icon: "🌱",
    color: "from-green-400 to-emerald-500",
    bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    image: "/api/placeholder/64/64",
    quote:
      "MyHealthSync360 changed my life! I have more energy and feel healthier than ever. The personalized approach really works.",
    location: "Los Angeles, CA",
    rating: 5,
    result: "Increased energy by 40%",
    avatar: "SJ",
    role: "Marketing Executive",
  },
  {
    name: "Michael Chen",
    image: "/api/placeholder/64/64",
    quote:
      "Finally, supplements that are actually tailored to MY needs. The quiz was thorough and the results speak for themselves.",
    location: "New York, NY",
    rating: 5,
    result: "Better sleep quality",
    avatar: "MC",
    role: "Software Engineer",
  },
  {
    name: "Emily Rodriguez",
    image: "/api/placeholder/64/64",
    quote:
      "I love how convenient it is. My personalized pack arrives monthly and I never have to worry about running out.",
    location: "Austin, TX",
    rating: 5,
    result: "Improved immunity",
    avatar: "ER",
    role: "Fitness Trainer",
  },
];

const steps = [
  {
    step: "01",
    title: "Take the Health Quiz",
    description:
      "Answer questions about your lifestyle, health goals, and dietary preferences in just 5 minutes.",
    icon: "📋",
    color: "from-emerald-500 to-teal-600",
    details:
      "5-minute assessment • 50+ personalized questions • Instant results",
  },
  {
    step: "02",
    title: "Get Your Personalized Pack",
    description:
      "Our nutritionists create a custom supplement pack based on your unique health profile.",
    icon: "🧬",
    color: "from-blue-500 to-purple-600",
    details:
      "Expert nutritionist review • Custom formulation • Quality assured",
  },
  {
    step: "03",
    title: "Receive Monthly Deliveries",
    description:
      "Your personalized supplements arrive at your door every month, perfectly portioned for daily use.",
    icon: "📦",
    color: "from-purple-500 to-pink-600",
    details: "Free shipping • Flexible scheduling • Cancel anytime",
  },
];

const stats = [
  {
    number: "50,000+",
    label: "Happy Customers",
    description: "Trust us with their health",
    icon: "👥",
    color: "from-emerald-500 to-teal-600",
  },
  {
    number: "95%",
    label: "Satisfaction Rate",
    description: "Customer approval rating",
    icon: "⭐",
    color: "from-yellow-500 to-orange-600",
  },
  {
    number: "2M+",
    label: "Supplements Delivered",
    description: "Personalized monthly packs",
    icon: "📦",
    color: "from-blue-500 to-purple-600",
  },
  {
    number: "24/7",
    label: "Expert Support",
    description: "Nutritionist guidance",
    icon: "🩺",
    color: "from-purple-500 to-pink-600",
  },
];

const whyChooseUs = [
  {
    title: "Science-Backed Formulations",
    description:
      "Every supplement is backed by clinical research and developed with leading nutritionists.",
    icon: "🔬",
    color: "from-emerald-500 to-teal-600",
    features: ["Clinical research", "Lab tested", "FDA approved facility"],
  },
  {
    title: "Premium Quality Ingredients",
    description:
      "We source only the highest quality, bioavailable ingredients from trusted suppliers.",
    icon: "🌟",
    color: "from-yellow-500 to-orange-600",
    features: ["Bioavailable forms", "Third-party tested", "No fillers"],
  },
  {
    title: "Personalized for You",
    description:
      "No two people are alike. Your supplement pack is tailored to your unique health profile.",
    icon: "🎯",
    color: "from-blue-500 to-purple-600",
    features: [
      "Custom formulation",
      "Health goals focused",
      "Lifestyle adapted",
    ],
  },
  {
    title: "Convenient Delivery",
    description:
      "Never run out again. Your personalized packs arrive automatically every month.",
    icon: "🚚",
    color: "from-purple-500 to-pink-600",
    features: ["Auto-delivery", "Flexible scheduling", "Free shipping"],
  },
];

const features = [
  {
    title: "AI-Powered Recommendations",
    description:
      "Our advanced algorithm analyzes your health data to create the perfect supplement combination.",
    icon: "🤖",
    image: "/product1.png",
  },
  {
    title: "Real-Time Health Tracking",
    description:
      "Monitor your progress with our companion app that tracks your wellness journey.",
    icon: "📱",
    image: "/product2.png",
  },
  {
    title: "Expert Nutritionist Support",
    description:
      "Get personalized advice from certified nutritionists available 24/7 via chat or video call.",
    icon: "👩‍⚕️",
    image: "/product3.png",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section - Modern Glassmorphism Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="space-y-6">
                {/* Modern Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-emerald-700 text-sm font-semibold border border-emerald-200/50 shadow-lg">
                  <span className="animate-pulse mr-2">🌟</span>
                  Trusted by 50,000+ customers worldwide
                </div>

                {/* Hero Title with Gradient Text */}
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gray-900">Your Health Journey,</span>
                  <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Personalized
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Stop guessing what your body needs. Get personalized vitamin
                  and supplement packs tailored to your unique health goals,
                  lifestyle, and dietary preferences.
                  <span className="font-semibold text-emerald-600">
                    Take our science-backed quiz and discover optimal wellness.
                  </span>
                </p>
              </div>

              {/* Modern CTA Button */}
              <div className="flex justify-start">
                <Link href="/quiz">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Your Free Health Assessment
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { icon: "🏭", text: "GMP Certified Facility" },
                  { icon: "🔬", text: "3rd Party Lab Tested" },
                  { icon: "👩‍⚕️", text: "Nutritionist Formulated" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Hero Image with Modern Effects */}
            <div className="relative z-10">
              <div className="relative">
                {/* Floating Cards Effect */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl transform rotate-12 animate-bounce"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-xl transform -rotate-12 animate-bounce delay-1000"></div>

                {/* Main Image with Glassmorphism Frame */}
                <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/30">
                  <Image
                    src="/products.png"
                    alt="MyHealthSync360 Personalized Supplement Packs"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />

                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
                    <div className="text-emerald-600 font-bold text-lg">
                      95%
                    </div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
                    <div className="text-teal-600 font-bold text-lg">50K+</div>
                    <div className="text-xs text-gray-600">Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Stats Section with Modern Cards */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-emerald-200 transform hover:scale-105 transition-all duration-300">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Benefits Grid with Advanced Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Targeted Support for Every Aspect of Your Health
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our personalized supplements are designed to support the areas of
              health that matter most to you, from energy and immunity to sleep
              and mental clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div
                  className={`absolute inset-0 ${benefit.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                ></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-transparent transform hover:scale-105 transition-all duration-500">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Hover Effect Indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-emerald-600 text-sm">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Advanced Technology Meets Personalized Care
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Experience the future of personalized nutrition with our
              cutting-edge technology and expert human touch.
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Learn More
                    <span className="ml-2">→</span>
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl blur-3xl"></div>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={500}
                      height={400}
                      className="relative w-full h-auto rounded-2xl shadow-2xl"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              health with MyHealthSync360&apos;s personalized approach to
              wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-emerald-600">
                      {testimonial.role}
                    </p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-3">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="text-sm text-emerald-600 font-semibold">
                  Result: {testimonial.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise Section - Modern Enhanced */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0.8s" }}
          ></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10-10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-400 text-sm font-semibold mb-8 border border-emerald-500/20 shadow-lg">
              <span className="animate-pulse mr-2">💎</span>
              Our Promise to You
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Health Journey,
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Our Commitment
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We&apos;re dedicated to providing you with the highest quality
              personalized nutrition experience. Here&apos;s what you can expect
              from MyHealthSync360.
            </p>
          </div>

          {/* Promise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔬",
                title: "Science-Backed Formulas",
                description:
                  "Every supplement is formulated based on the latest nutritional science and research.",
                features: [
                  "Clinically studied ingredients",
                  "Expert-reviewed formulations",
                  "Evidence-based recommendations",
                ],
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: "🎯",
                title: "Personalized for You",
                description:
                  "Your unique health profile determines every recommendation we make.",
                features: [
                  "AI-powered analysis",
                  "Individual health assessment",
                  "Custom supplement combinations",
                ],
                color: "from-teal-500 to-cyan-600",
              },
              {
                icon: "🏆",
                title: "Premium Quality",
                description:
                  "We source only the highest quality ingredients from trusted suppliers.",
                features: [
                  "Third-party tested",
                  "GMP certified facilities",
                  "No artificial fillers",
                ],
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: "🚀",
                title: "Fast & Reliable",
                description:
                  "Quick shipping and consistent delivery so you never miss a dose.",
                features: [
                  "Free shipping nationwide",
                  "2-3 day delivery",
                  "Automatic refills available",
                ],
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: "💬",
                title: "Expert Support",
                description:
                  "Our team of nutritionists and health experts are here to help.",
                features: [
                  "24/7 customer support",
                  "Nutritionist consultations",
                  "Health progress tracking",
                ],
                color: "from-indigo-500 to-purple-600",
              },
              {
                icon: "🛡️",
                title: "Risk-Free Guarantee",
                description:
                  "Try us risk-free with our 30-day money-back guarantee.",
                features: [
                  "30-day money back",
                  "No questions asked",
                  "Cancel anytime",
                ],
                color: "from-purple-500 to-pink-600",
              },
            ].map((promise, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
              >
                <div className="text-center mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${promise.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">{promise.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                    {promise.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {promise.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {promise.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect Indicator */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-emerald-400 text-sm font-bold">✓</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands who have already transformed their health with
                our personalized approach.
              </p>
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="text-lg px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 rounded-2xl font-bold"
                >
                  Start Your Health Assessment
                  <span className="ml-3 text-xl">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Modern Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose MyHealthSync360?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We&apos;re not just another supplement company. We&apos;re your
              personalized health partner, committed to delivering results
              through science, quality, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-transparent transform hover:scale-105 transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="space-y-2">
                    {item.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced Modern Design */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
      >
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-teal-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "80px 80px",
              }}
            ></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-100/80 backdrop-blur-sm rounded-full text-emerald-700 text-sm font-semibold mb-6 border border-emerald-200/50 shadow-lg">
              <span className="animate-pulse mr-2">⚡</span>
              Simple 3-Step Process
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How It Works
              <span className="block text-4xl lg:text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Simple as 1, 2, 3
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get started with personalized nutrition in three simple steps.
              <span className="font-semibold text-emerald-600">
                No guesswork, no generic solutions
              </span>{" "}
              - just supplements designed specifically for you.
            </p>
          </div>

          {/* Enhanced Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Enhanced Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 transform translate-x-6 z-0 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse opacity-60"></div>
                  </div>
                )}

                {/* Enhanced Step Card */}
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-white/50 hover:border-emerald-200 transform hover:scale-105 transition-all duration-500 group">
                  {/* Step Icon Container */}
                  <div className="relative mb-8 flex justify-center">
                    <div className="relative">
                      {/* Animated Ring */}
                      <div className="absolute inset-0 w-24 h-24 border-4 border-emerald-200 rounded-2xl animate-pulse opacity-50"></div>

                      {/* Main Icon */}
                      <div
                        className={`relative w-24 h-24 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                      >
                        {step.icon}

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center text-lg font-bold border-4 border-emerald-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>

                    {/* Enhanced Feature List */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 group-hover:border-emerald-200 transition-colors duration-300">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                          What You Get
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {step.details}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-emerald-600 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/50 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands who have already transformed their health with
                  personalized nutrition. Your custom supplement plan is just a
                  few clicks away.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/quiz">
                    <Button
                      size="lg"
                      className="text-lg px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
                    >
                      Start Your Personalized Journey Today
                      <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Free assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600">✓</span>
                    <span>No commitment required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Results in 5 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials with Modern Cards */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Join thousands of satisfied customers who have transformed their
              health with MyHealthSync360&apos;s personalized approach to
              wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-white/20 hover:border-emerald-200 transform hover:scale-105 transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-600 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <div className="text-emerald-700 font-semibold text-sm">
                    📈 Result: {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
