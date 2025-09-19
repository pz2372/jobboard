import React, { useState } from "react";
import {
  CheckIcon,
  XIcon,
  CrownIcon,
  StarIcon,
  TrendingUpIcon,
  BuildingIcon,
  UsersIcon,
  ZapIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance"; // Adjust the import based on your project structure
import { RootState } from "../../redux/store";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  color: string;
  buttonColor: string;
  annualSaveAmount: number;
}

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  ); 

  const employer = useSelector((state: RootState) => state.employerAuth.employer);

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      price: billingCycle === "monthly" ? 79 : 70,
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Perfect for small businesses getting started",
      icon: StarIcon,
      color: "border-gray-200 hover:border-gray-300",
      buttonColor: "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
      features: [
        "Only 1 job post per month",
        "Basic applicant tracking",
        "Email notifications",
        "Standard job visibility",
        "Basic analytics",
      ],
      limitations: [
        "Limited to 20 applicants per job",
        "Direct support 24/7",
      ],
      annualSaveAmount: 108,
    },
    {
      id: "impact",
      name: "Impact",
      price: billingCycle === "monthly" ? 149 : 135,
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Great for growing companies with regular hiring needs",
      icon: TrendingUpIcon,
      popular: true,
      color: "border-teal-300 hover:border-teal-400 ring-2 ring-teal-200",
      buttonColor: "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
      features: [
        "2 job posts per month",
        "Advanced applicant tracking",
        "Priority job placement",
        "Detailed analytics dashboard",
        "Custom application forms",
        "Access AI candidate suggestions",
        "Direct support 24/7",
      ],
      limitations: ["Limited to 200 applicants per job"],
      annualSaveAmount: 168,
    },
    {
      id: "accelerate",
      name: "Accelerate",
      price: billingCycle === "monthly" ? 219 : 200,
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Ideal for fast-growing companies with extensive hiring",
      icon: ZapIcon,
      color: "border-gray-200 hover:border-gray-300",
      buttonColor: "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
      features: [
        "3 job posts per month",
        "Premium applicant tracking",
        "Featured job listings",
        "Advanced analytics & reporting",
        "Custom branding",
        "Bulk actions & automation",
        "Priority support",
        "Access AI candidate suggestions",
        "Team collaboration tools",
      ],
      annualSaveAmount: 228,
    },
    {
      id: "corporate",
      name: "Corporate",
      price: billingCycle === "monthly" ? 399 : 359,
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Enterprise solution for large organizations",
      icon: BuildingIcon,
      color: "border-gray-200 hover:border-gray-300",
      buttonColor: "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
      features: [
        "8 job posts per month",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security features",
        "Multi-location management",
        "White-label solutions",
        "Custom reporting",
        "24/7 phone support",
        "Onboarding assistance",
        "SLA guarantees",
      ],
      annualSaveAmount: 480
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (plan: Plan) => {
    try {
      const response = await axiosInstance.post(
        "employer-subscriptions/",
        {
          employerId: employer?.id, // Use actual employer ID
          planType: plan.id,
          billingCycle: billingCycle,
          stripePriceId: plan.id, // Replace with actual Stripe Price ID
        }
      );

      const session = response.data;

      if (session.checkoutUrl) {
        window.location.href = session.checkoutUrl; // Redirect to Stripe Checkout
      } else {
        console.error("Failed to create checkout session:", session);
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the perfect plan to accelerate your hiring process
          </p>

          {/* Billing Toggle */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center">
              <span
                className={`mr-3 ${
                  billingCycle === "monthly"
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "annual" : "monthly"
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === "annual" ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "annual"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`ml-3 ${
                  billingCycle === "annual"
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                Annual
              </span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.color
                } ${selectedPlan === plan.id ? "transform scale-105" : ""} ${
                  plan.popular ? "transform scale-105" : ""
                } flex flex-col h-full`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                      <CrownIcon className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-1">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      plan.id === "basic"
                        ? "bg-gray-100"
                        : plan.id === "impact"
                        ? "bg-teal-100"
                        : plan.id === "accelerate"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        plan.id === "basic"
                          ? "text-gray-600"
                          : plan.id === "impact"
                          ? "text-teal-600"
                          : plan.id === "accelerate"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">/month{billingCycle === "annual" && <span>*</span>}</span>
                    </div>
                    {billingCycle === "annual" && (
                      <div className="inline-flex text-green-600 mt-2">
                        <p className="text-md font-medium mr-1">Save</p>
                        <p className="text-md font-bold">
                          ${plan.annualSaveAmount}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 text-sm">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${plan.buttonColor} hover:transform hover:scale-105`}
                  >
                    Get Started
                  </button>
                </div>
                {billingCycle === "annual" && (<div className="mx-auto mt-4 text-gray-500 text-sm"><span>* Billed annually</span></div>)}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom solution or have questions?
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg transition-all duration-300">
            <HeadphonesIcon className="w-5 h-5" />
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
