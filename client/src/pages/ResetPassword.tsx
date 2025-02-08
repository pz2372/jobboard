import React from 'react'
import {
    MailIcon,
    ArrowLeftIcon
  } from "lucide-react";

const ResetPassword = () => {
    return (<main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your email address and we'll send you instructions to reset
              your password
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
            <form className="space-y-6">
              <div className="relative">
                <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                />
              </div>

              <button className="w-full bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105">
                Send Reset Instructions
              </button>
            </form>

            <div className="mt-8 text-center">
              <a className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-all duration-300 hover:gap-3">
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Sign In
              </a>
            </div>
          </div>
        </div>
      </main>)
}

export default ResetPassword