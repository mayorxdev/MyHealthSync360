import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";

const About = () => {
  // Enhanced milestones with optimized icons and colors
  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description:
        "Started with a vision to make personalized nutrition accessible to everyone.",
      icon: "🚀",
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-500/20 to-teal-500/20",
      accentColor: "emerald",
    },
    {
      year: "2020",
      title: "AI Platform Launch",
      description:
        "Launched our proprietary AI-powered health assessment platform.",
      icon: "🤖",
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-500/20 to-cyan-500/20",
      accentColor: "teal",
    },
    {
      year: "2021",
      title: "10K Customers",
      description:
        "Reached our first 10,000 satisfied customers and expanded our product line.",
      icon: "🎯",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-500/20 to-blue-500/20",
      accentColor: "cyan",
    },
    {
      year: "2022",
      title: "Research Partnership",
      description:
        "Partnered with leading universities for advanced nutrition research.",
      icon: "🔬",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-500/20 to-indigo-500/20",
      accentColor: "blue",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Expanded internationally and reached 50,000+ customers worldwide.",
      icon: "🌍",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-500/20 to-purple-500/20",
      accentColor: "indigo",
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description:
        "Opened our state-of-the-art research and development facility.",
      icon: "🏢",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      accentColor: "purple",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: "👥" },
    { number: "2M+", label: "Supplements Delivered", icon: "📦" },
    { number: "95%", label: "Customer Satisfaction", icon: "⭐" },
    { number: "24/7", label: "Expert Support", icon: "💬" },
  ];

  const values = [
    {
      icon: "🔬",
      title: "Science-Driven",
      description:
        "Every recommendation is backed by the latest nutritional science and clinical research.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: "🎯",
      title: "Personalized Approach",
      description:
        "We believe health is personal. Our AI-powered platform creates unique supplement plans for each individual.",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: "🏆",
      title: "Premium Quality",
      description:
        "We source only the highest quality ingredients from trusted suppliers worldwide.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: "🤝",
      title: "Transparency",
      description:
        "Complete transparency in our ingredients, sourcing, and manufacturing processes.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description:
        "Committed to sustainable practices and environmentally responsible packaging.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "Continuously innovating to provide the most effective and convenient health solutions.",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      image: "SC",
      bio: "Harvard-trained physician with 15+ years in personalized medicine and nutrition science.",
      expertise: [
        "Personalized Medicine",
        "Nutrition Science",
        "Clinical Research",
      ],
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "Michael Rodriguez",
      role: "CEO & Co-Founder",
      image: "MR",
      bio: "Former tech executive passionate about democratizing personalized healthcare.",
      expertise: [
        "Healthcare Technology",
        "Business Strategy",
        "Product Innovation",
      ],
      color: "from-teal-500 to-cyan-600",
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Research",
      image: "EW",
      bio: "PhD in Biochemistry with expertise in supplement formulation and nutrient absorption.",
      expertise: [
        "Biochemistry",
        "Supplement Formulation",
        "Research & Development",
      ],
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "David Kim",
      role: "Chief Technology Officer",
      image: "DK",
      bio: "AI and machine learning expert focused on personalized health recommendations.",
      expertise: ["Artificial Intelligence", "Machine Learning", "Health Tech"],
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-100/80 backdrop-blur-sm rounded-full text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200/50 shadow-lg">
              <span className="animate-pulse mr-2">✨</span>
              About MyHealthSync360
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transforming Health Through
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Personalized Nutrition
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              We&apos;re on a mission to revolutionize how people approach their
              health by making personalized nutrition accessible,
              science-backed, and incredibly effective.
            </p>
            <Link href="/quiz">
              <Button
                size="lg"
                className="text-lg px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 rounded-2xl font-bold"
              >
                Start Your Journey
                <span className="ml-3 text-xl">🚀</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                To democratize personalized nutrition by combining cutting-edge
                science, artificial intelligence, and premium-quality
                supplements to help everyone achieve their optimal health
                potential.
              </p>
              <div className="space-y-4">
                {[
                  "Make personalized nutrition accessible to everyone",
                  "Bridge the gap between science and practical health solutions",
                  "Empower individuals with data-driven health insights",
                  "Create lasting positive impact on global wellness",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Vision
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  A world where every person has access to personalized,
                  science-backed nutrition that helps them live their
                  healthiest, most vibrant life. We envision a future where
                  optimal health is not a privilege but a right accessible to
                  all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development
              to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of experts combines decades of experience in
              medicine, technology, and nutrition science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-white/20 hover:border-emerald-200 transition-all duration-500 transform hover:scale-105"
              >
                <div className="text-center">
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {member.image}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  <div className="space-y-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Journey Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped our mission to transform personalized
              healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">{milestone.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Experience the difference personalized nutrition can make in your
              life. Start your journey with a free health assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="text-lg px-12 py-4 bg-white text-emerald-600 hover:bg-gray-50 shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl font-bold"
                >
                  Start Your Assessment
                  <span className="ml-3 text-xl">🚀</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-12 py-4 border-2 border-white text-white hover:bg-white hover:text-emerald-600 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl font-bold"
                >
                  Contact Our Team
                  <span className="ml-3 text-xl">💬</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
