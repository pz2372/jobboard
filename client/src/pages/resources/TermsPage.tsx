import React, { useState } from "react";
import { pages } from "../../components/TermsPages"
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
        <div className="flex justify-center w-full">
  <div className="flex flex-wrap justify-center gap-4 mb-8 py-2 px-4 bg-teal-50/50 rounded-2xl">
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
