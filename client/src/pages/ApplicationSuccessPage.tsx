import React from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";

const ApplicationSuccessPage = () => {
  return (
    <main className="min-h-screen bg-gray-50/90 p-4 md:p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-700">
            Your application has been received and is being processed
          </p>
        </div>

        <div className="mb-8 rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-700">Reference Number</p>
          <p className="text-lg font-medium text-gray-900">APP-2023-89275</p>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Personal Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-700">Full Name</p>
              <p className="font-medium text-gray-900">John Michael Smith</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Student ID</p>
              <p className="font-medium text-gray-900">STU123456789</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Program</p>
              <p className="font-medium text-gray-900">Computer Science</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Expected Graduation</p>
              <p className="font-medium text-gray-900">May 2025</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Application Status
          </h2>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="font-medium text-green-600">Under Review</p>
            <p className="text-sm text-gray-700">
              Your application is currently being reviewed by our admissions
              team
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Next Steps</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Check your email for confirmation details</li>
            <li>Monitor your application status on the dashboard</li>
            <li>Prepare required documents for the next phase</li>
          </ul>
        </section>

        <button className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
    </main>
  );
};

export default ApplicationSuccessPage;
