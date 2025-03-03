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
          "By accessing or using My First Shift, you agree to be bound by the following terms and conditions.",
      },
      {
        title: "Eligibility",
        icon: Shield,
        content: "You must be at least 16 years old to use My First Shift.",
      },
      {
        title: "User Responsibilities",
        icon: UserCheck,
        content:
          "As a user of My First Shift, you are responsible for maintaining account security, providing accurate information, and following community guidelines.",
      },
      {
        title: "Content Guidelines",
        icon: FileText,
        content:
          "Users must ensure all content posted adheres to our community standards. We reserve the right to remove content that violates these guidelines.",
      },
      {
        title: "Prohibited Content",
        icon: FileText,
        content:
          "Users must not post false or misleading information, harass others, or engage in illegal activities.",
      },
      {
        title: "Termination",
        icon: FileText,
        content:
          "My First Shift reserves the right to terminate accounts that violate these terms.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    icon: Cookie,
    sections: [
      {
        title: "Introduction",
        icon: Shield,
        content:
          "By using our site, you agree to the use of cookies in accordance with this policy.",
      },
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
          "My First Shift uses cookies to understand how you interact with our website, remember your preferences, and provide personalized content.",
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
        title: "Introduction",
        icon: Shield,
        content:
          "My First Shift collects personal information when you register, post a job, or apply for a job.",
      },
      {
        title: "Data Collection",
        icon: Shield,
        content:
          "My First Shift collects information that you provide directly to us, as well as data about how you use our services.",
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
          "My First Shift implements appropriate security measures to protect your personal information from unauthorized access or disclosure.",
      },
      {
        title: "Your Rights",
        icon: Lock,
        content:
          "You have the right to access, modify, or delete your personal information.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: BookOpen,
    sections: [
      {
        title: "Introduction",
        icon: Shield,
        content: "By using My First Shift, you agree to these terms.",
      },
      {
        title: "Service Usage",
        icon: Shield,
        content:
          "Our services are provided 'as is' and we make no warranties about their reliability or availability.",
      },
      {
        title: "Intellectual Property",
        icon: Shield,
        content:
          "All content on My First Shift is the property of the Job Board or its licensors.",
      },
      {
        title: "Limitation of Liability",
        icon: Shield,
        content:
          "My First Shift is not liable for any damages resulting from the use of the platform.",
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
      {
        title: "Changes to Terms",
        icon: FileText,
        content:
          "We may update these terms from time to time. Continued use of the platform constitutes acceptance of the new terms.",
      },
    ],
  },
};
