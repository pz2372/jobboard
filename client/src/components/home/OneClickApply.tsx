import React from 'react'
import {
  MousePointerClickIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  BriefcaseIcon,
  FileTextIcon,
  StarIcon,
} from 'lucide-react'
const OneClickApplySection = () => {
  return (
    <div className="py-10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
       

        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-[#FF7E5F] opacity-20 rounded-full animate-ping-slow animation-delay-1000"></div>
       
        {/* Decorative lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 Q500,250 1000,200 T2000,200"
            fill="none"
            stroke="#3D9A8C"
            strokeWidth="1"
            strokeDasharray="8,8"
            strokeOpacity="0.2"
          />
          <path
            d="M0,400 Q500,350 1000,400 T2000,400"
            fill="none"
            stroke="#FF7E5F"
            strokeWidth="1"
            strokeDasharray="8,8"
            strokeOpacity="0.2"
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left side - Large text and description */}
          <div className="lg:w-1/2 text-center">
            <div className="relative mb-6">
              <h2 className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none mb-6">
                <div className="flex items-start justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D9A8C] to-[#FF7E5F]">
                    ONE
                  </span>
                  <div className="flex flex-col mx-2 md:mx-4">
                    {Array.from('CLICK').map((letter, index) => (
                      <span
                        key={index}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E5F] to-[#3D9A8C] text-5xl md:text-6xl lg:text-7xl leading-[0.8]"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-900">APPLY</span>
                </div>
              </h2>
            
            </div>
          </div>
        </div>

      </div>
      {/* Custom animations */}
      <style>{`
        @keyframes ping-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
        @keyframes ping-once {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-once {
          animation: ping-once 1s cubic-bezier(0, 0, 0.2, 1);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 3s;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
export default OneClickApplySection
