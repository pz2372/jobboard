import {
    BuildingIcon,
    CalendarIcon,
    ClockIcon,
    GlobeIcon,
    GraduationCapIcon,
    LinkedinIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
  } from "lucide-react";

export const applicationFieldMap = {
    fullName: {
      name: "Full Name",
      enabled: true,
      required: true,
      icon: UserIcon,
    },
    email: {
      name: "Email",
      enabled: true,
      required: true,
      icon: MailIcon,
    },
    phone: {
      name: "Phone Number",
      enabled: true,
      required: false,
      icon: PhoneIcon,
    },
    address: {
      name: "Street Address",
      enabled: true,
      required: false,
      icon: MapPinIcon,
    },
    city: {
      name: "City",
      enabled: true,
      required: false,
      icon: MapPinIcon,
    },
    state: {
      name: "State",
      enabled: true,
      required: false,
      icon: MapPinIcon,
    },
    zipCode: {
      name: "ZIP Code",
      enabled: true,
      required: false,
      icon: MapPinIcon,
    },
    currentCompany: {
      name: "Current Employment",
      enabled: true,
      required: false,
      icon: BuildingIcon,
    },
    yearsExperience: {
      name: "Years of Experience",
      enabled: true,
      required: false,
      icon: ClockIcon,
    },
    educationLevel: {
      name: "Education Level",
      enabled: true,
      required: false,
      icon: GraduationCapIcon,
    },
    pronouns: {
      name: "Preferred Pronouns",
      enabled: true,
      required: false,
      icon: UserIcon,
    },
    startDate: {
      name: "Availability Start Date",
      enabled: true,
      required: false,
      icon: CalendarIcon,
    },
  };