"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
    priority: "normal",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: number;
      sender: "user" | "support";
      message: string;
      timestamp: Date;
    }>
  >([
    {
      id: 1,
      sender: "support",
      message: "Hi! I'm Sarah from MyHealthSync360. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [onlineSupport, setOnlineSupport] = useState(true);
  const [supportRating, setSupportRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    // Simulate online status check
    const interval = setInterval(() => {
      setOnlineSupport(Math.random() > 0.1); // 90% chance of being online
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    else if (formData.message.length < 10)
      errors.message = "Message must be at least 10 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
        priority: "normal",
        phone: "",
      });
      setFormErrors({});
    }, 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "user" as const,
      message: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");

    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Let me help you with that.",
        "I understand your concern. Can you provide more details?",
        "That's a great question! Here's what I can tell you...",
        "I'd be happy to assist you with that. Let me check our resources.",
        "Thanks for reaching out! I'll connect you with the right specialist.",
      ];

      const supportResponse = {
        id: chatMessages.length + 2,
        sender: "support" as const,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, supportResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const handleRating = (rating: number) => {
    setSupportRating(rating);
    setShowRating(false);
    // You could send this rating to your backend here
  };

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@myhealthsync360.com",
      action: "mailto:support@myhealthsync360.com",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      responseTime: "Within 24 hours",
      availability: "24/7",
    },
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Speak directly with our experts",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
      color: "from-teal-500 to-cyan-600",
      bgColor: "from-teal-50 to-cyan-50",
      responseTime: "Immediate",
      availability: "Mon-Fri 8AM-8PM EST",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: onlineSupport ? "Online now" : "Currently offline",
      action: () => setShowLiveChat(true),
      color: "from-cyan-500 to-blue-600",
      bgColor: "from-cyan-50 to-blue-50",
      responseTime: "Under 2 minutes",
      availability: "24/7",
      isOnline: onlineSupport,
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Health Street, Suite 400",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri: 9AM-6PM PST",
    },
    {
      city: "New York",
      address: "456 Wellness Avenue, Floor 12",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 987-6543",
      hours: "Mon-Fri: 9AM-6PM EST",
    },
    {
      city: "Austin",
      address: "789 Nutrition Boulevard, Building C",
      zipCode: "Austin, TX 78701",
      phone: "+1 (555) 456-7890",
      hours: "Mon-Fri: 9AM-6PM CST",
    },
  ];

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our phone support line.",
    },
    {
      question: "Can I schedule a consultation?",
      answer:
        "Yes! Our nutrition experts are available for personalized consultations. Use the contact form to request a consultation and we'll get back to you with available times.",
    },
    {
      question: "Do you offer international support?",
      answer:
        "Currently, we provide support in English and serve customers in the United States, Canada, and the UK. We're expanding to more regions soon!",
    },
    {
      question: "What information should I include in my message?",
      answer:
        "Please include your order number (if applicable), a detailed description of your question or concern, and the best way to reach you for follow-up.",
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
              <span className="animate-pulse mr-2">💬</span>
              Get in Touch
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              We&apos;re Here to
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Help You Succeed
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Have questions about your health journey? Our expert team is ready
              to provide personalized support and guidance every step of the
              way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Preferred Way to Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer multiple ways to get in touch. Pick the method that works
              best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const isClickable = typeof method.action === "function";
              const Component = isClickable ? "button" : "a";
              const props = isClickable
                ? { onClick: method.action as () => void }
                : { href: method.action as string };

              return (
                <Component
                  key={index}
                  {...props}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 w-full text-left"
                >
                  <div className="text-center">
                    <div className="relative">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <method.icon className="w-10 h-10 text-white" />
                      </div>
                      {method.title === "Live Chat" && (
                        <div className="absolute -top-2 -right-2">
                          <div
                            className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                              method.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          >
                            <div
                              className={`w-full h-full rounded-full animate-pulse ${
                                method.isOnline ? "bg-green-400" : "bg-gray-300"
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-emerald-600">
                        {method.contact}
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {method.responseTime}
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="w-4 h-4 mr-1" />
                          {method.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                </Component>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Send Us a Message
              </h2>

              {submitStatus === "success" && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-emerald-800 font-semibold">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-emerald-600 text-sm">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300 ${
                        formErrors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Your full name"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300 ${
                        formErrors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="normal">Normal - Standard support</option>
                      <option value="high">High - Urgent issue</option>
                      <option value="critical">
                        Critical - Service disruption
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="consultation">Nutrition Consultation</option>
                    <option value="partnership">Partnership</option>
                    <option value="media">Media & Press</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300 ${
                      formErrors.subject
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Brief description of your inquiry"
                  />
                  {formErrors.subject && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500 transition-colors duration-300 resize-none ${
                      formErrors.message
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Please provide as much detail as possible..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {formErrors.message && (
                      <p className="text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {formErrors.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.message.length}/500 characters
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-lg px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 p-10 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="ml-3">📧</span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our Offices
              </h2>
              <div className="space-y-8">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <MapPinIcon className="w-6 h-6 text-emerald-600 mr-3" />
                      {office.city}
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="flex items-start">
                        <span className="font-semibold mr-2">Address:</span>
                        <span>
                          {office.address}
                          <br />
                          {office.zipCode}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        <span className="font-semibold mr-2">Phone:</span>
                        <a
                          href={`tel:${office.phone}`}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {office.phone}
                        </a>
                      </p>
                      <p className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span className="font-semibold mr-2">Hours:</span>
                        <span>{office.hours}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-100/80 backdrop-blur-sm rounded-full text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200/50 shadow-lg">
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Quick Answers to Common Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to the most common questions about contacting our
              support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-start">
                  <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5 flex-shrink-0">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-9">
                  {faq.answer}
                </p>
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
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Our team is standing by to help you on your health journey.
              Don&apos;t hesitate to reach out - we&apos;re here for you!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="text-lg px-12 py-5 bg-white text-emerald-600 hover:bg-gray-50 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold"
                >
                  Start Your Assessment
                  <span className="ml-3 text-xl">🚀</span>
                </Button>
              </Link>

              <a href="mailto:support@myhealthsync360.com">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-12 py-5 border-2 border-white text-white hover:bg-white hover:text-emerald-600 shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold"
                >
                  Email Us Directly
                  <span className="ml-3 text-xl">📧</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it - see what our satisfied
              customers have to say about our support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Health Enthusiast",
                rating: 5,
                comment:
                  "The support team was incredibly helpful in customizing my vitamin plan. They responded within hours and provided detailed explanations.",
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                role: "Fitness Coach",
                rating: 5,
                comment:
                  "Outstanding customer service! They helped me understand which supplements would work best for my clients. Very knowledgeable team.",
                avatar: "MC",
              },
              {
                name: "Emily Rodriguez",
                role: "Wellness Blogger",
                rating: 5,
                comment:
                  "I've never experienced such personalized support from a supplement company. They truly care about your health journey.",
                avatar: "ER",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      {showLiveChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-3xl text-white">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Live Support</h3>
                  <p className="text-sm opacity-90">
                    {onlineSupport ? "Online now" : "Currently offline"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChat(false)}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group"
              >
                <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  ✕
                </span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-emerald-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleChatSubmit}
              className="p-4 border-t border-gray-200"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 focus-visible:outline-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!currentMessage.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  Send
                  <span className="ml-2">➤</span>
                </button>
              </div>
            </form>

            {/* Rating Section */}
            {showRating && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700 mb-3">
                  Rate your support experience:
                </p>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(rating)}
                      className="p-3 rounded-full hover:bg-yellow-50 transition-all duration-300 transform hover:scale-110"
                    >
                      <StarIcon
                        className={`w-6 h-6 transition-all duration-300 ${
                          rating <= supportRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          onClick={() => setShowLiveChat(true)}
          className="w-18 h-18 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
        >
          <ChatBubbleLeftRightIcon className="w-8 h-8" />
          {onlineSupport && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {onlineSupport
            ? "Chat with us - We're online!"
            : "Leave us a message"}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
