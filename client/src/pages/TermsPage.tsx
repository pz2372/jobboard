import React, { useState } from "react";
import {
  ChevronRight,
  Shield,
  UserCheck,
  FileText,
  Lock,
  AlertCircle,
  CheckCircle2,
  ScrollText,
  Cookie,
  Eye,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import { useParams } from "react-router-dom";

const TermsPage = () => {
  const { item } = useParams();
  const decodedItem = decodeURIComponent(item || "");
  const pageMap: Record<string, keyof typeof pages> = {
    "User Agreement": "agreement",
    "Cookie Policy": "cookies",
    "Privacy Policy": "privacy",
    "Terms & Conditions": "terms",
  };
  const pageKey = pageMap[decodedItem] || "agreement";
  const [activePage, setActivePage] = useState<keyof typeof pages>(pageKey);

  type PageKey = keyof typeof pages;

  const pages = {
    agreement: {
      title: "User Agreement",
      icon: ScrollText,
      sections: [
        {
          title: "Introduction",
          icon: Shield,
          content:
            "Welcome to our platform. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.",
        },
        {
          title: "User Responsibilities",
          icon: UserCheck,
          content:
            "As a user of our platform, you are responsible for maintaining account security, providing accurate information, and following community guidelines.",
        },
        {
          title: "Content Guidelines",
          icon: FileText,
          content:
            "Users must ensure all content posted adheres to our community standards. We reserve the right to remove content that violates these guidelines.",
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      icon: Cookie,
      sections: [
        {
          title: "What Are Cookies",
          icon: Shield,
          content:
            "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.",
        },
        {
          title: "How We Use Cookies",
          icon: FileText,
          content:
            "We use cookies to understand how you interact with our website, remember your preferences, and provide personalized content.",
        },
        {
          title: "Managing Cookies",
          icon: UserCheck,
          content:
            "You can control and manage cookies in your browser settings. Please note that removing cookies may affect your experience on our site.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      icon: Eye,
      sections: [
        {
          title: "Data Collection",
          icon: Shield,
          content:
            "We collect information that you provide directly to us, as well as data about how you use our services.",
        },
        {
          title: "Data Usage",
          icon: FileText,
          content:
            "Your data is used to provide, maintain, and improve our services, as well as to communicate with you about updates and offers.",
        },
        {
          title: "Data Protection",
          icon: Lock,
          content:
            "We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      icon: BookOpen,
      sections: [
        {
          title: "Service Usage",
          icon: Shield,
          content:
            "Our services are provided 'as is' and we make no warranties about their reliability or availability.",
        },
        {
          title: "User Conduct",
          icon: UserCheck,
          content:
            "Users must comply with all applicable laws and regulations while using our services.",
        },
        {
          title: "Termination",
          icon: FileText,
          content:
            "We reserve the right to terminate or suspend access to our services for violations of these terms.",
        },
      ],
    },
  };
  const ActiveIcon = pages[activePage].icon;

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-teal-100 p-3 rounded-full">
            <ActiveIcon className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-teal-600">
          {pages[activePage].title}
        </h1>
        <p className="text-gray-600">
          Please read these terms carefully before using our service
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        <div className="flex gap-4 mb-8 overflow-x-auto py-2 px-4 bg-teal-50/50 rounded-2xl">
          {Object.entries(pages).map(([key, { title, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => setActivePage(key as PageKey)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                activePage === key
                  ? "bg-teal-100 text-teal-700"
                  : "text-teal-600 hover:bg-teal-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {title}
            </button>
          ))}
        </div>
        <div className="space-y-8">
          {pages[activePage].sections.map((section: any, index: number) => {
            const SectionIcon = section.icon;
            return (
              <section key={index}>
                <div className="flex items-center gap-3 mb-4">
                  <SectionIcon className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TermsPage;
