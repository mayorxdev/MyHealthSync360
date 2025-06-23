import Link from "next/link";
import React from "react";

const Footer = () => {
  const navigation = {
    main: [
      { name: "About us", href: "/about" },
      { name: "Catalog", href: "/catalog" },
      { name: "Blog", href: "/blog" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Subscription Policy", href: "/subscription-policy" },
      { name: "Medical Disclaimer", href: "/medical-disclaimer" },
    ],
    social: [
      {
        name: "Facebook",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Instagram",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.019.428a5.453 5.453 0 00-1.97 1.286A5.443 5.443 0 00.76 3.683c-.224.5-.346 1.074-.38 2.02C.345 6.651.332 7.058.332 10.68v2.64c0 3.621.013 4.029.048 4.976.034.946.156 1.52.38 2.02a5.443 5.443 0 001.286 1.97 5.453 5.453 0 001.97 1.286c.5.224 1.074.346 2.02.38.947.035 1.354.048 4.976.048h2.64c3.621 0 4.029-.013 4.976-.048.946-.034 1.52-.156 2.02-.38a5.453 5.453 0 001.97-1.286 5.443 5.443 0 001.286-1.97c.224-.5.346-1.074.38-2.02.035-.947.048-1.354.048-4.976v-2.64c0-3.621-.013-4.029-.048-4.976-.034-.946-.156-1.52-.38-2.02a5.443 5.443 0 00-1.286-1.97A5.453 5.453 0 0018.297.76c-.5-.224-1.074-.346-2.02-.38C15.33.013 14.923 0 11.301 0h1.415z"
              clipRule="evenodd"
            />
            <path d="M12 7.864a4.135 4.135 0 100 8.27 4.135 4.135 0 000-8.27zm0 6.823a2.688 2.688 0 110-5.376 2.688 2.688 0 010 5.376zm5.23-6.991a.966.966 0 11-1.932 0 .966.966 0 011.932 0z" />
          </svg>
        ),
      },
      {
        name: "Twitter",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
    ],
  };

  const quickLinks = [
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Support", href: "/support" },
  ];

  const companyInfo = [
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "Affiliates", href: "/affiliates" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Info - Enhanced */}
            <div className="lg:col-span-2 space-y-8">
              <div className="group">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      MyHealthSync360
                    </h3>
                    <p className="text-emerald-400 font-semibold text-sm">
                      Personalized Wellness
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                  Transforming lives through personalized nutrition and premium
                  supplements. Your health journey starts here.
                </p>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-3">
                  Stay Updated
                </h4>
                <p className="text-gray-300 mb-4 text-sm">
                  Get the latest health tips and exclusive offers.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block group"
                    >
                      <span className="group-hover:text-emerald-400 transition-colors duration-300">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block group"
                    >
                      <span className="group-hover:text-emerald-400 transition-colors duration-300">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 relative">
                Company
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {companyInfo.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block group"
                    >
                      <span className="group-hover:text-emerald-400 transition-colors duration-300">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Trust Badges Section */}
        <div className="border-t border-white/10 py-12">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-white mb-4">
              Trusted by Thousands
            </h4>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our commitment to quality and safety is backed by industry
              certifications and rigorous testing.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="group flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-white font-semibold">GMP Certified</span>
                <p className="text-gray-400 text-xs">
                  Good Manufacturing Practice
                </p>
              </div>
            </div>

            <div className="group flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-white font-semibold">
                  3rd Party Tested
                </span>
                <p className="text-gray-400 text-xs">
                  Independent Lab Verified
                </p>
              </div>
            </div>

            <div className="group flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-semibold">
                  Nutritionist Approved
                </span>
                <p className="text-gray-400 text-xs">Expert Formulated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Social Links */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex justify-center space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group w-12 h-12 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon
                    className="h-6 w-6 text-gray-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-2">
                Questions? We&apos;re here to help
              </p>
              <a
                href="mailto:support@myhealthsync360.com"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300"
              >
                support@myhealthsync360.com
              </a>
            </div>
          </div>
        </div>

        {/* Legal Footer - Enhanced */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <p className="text-gray-400 text-sm text-center lg:text-right">
              &copy; 2024 MyHealthSync360. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
