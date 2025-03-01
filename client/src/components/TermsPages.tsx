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

export const pages = {
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