import { StarIcon, UsersIcon } from "lucide-react";

const Community = () => {
    return(
      <section className="mt-16 mb-16 relative overflow-hidden rounded-2xl shadow-xl">
        <div className="bg-gradient-to-br from-[#e8f5f3] via-[#eaf0f5] to-[#fff5f2] p-8 lg:p-12 relative overflow-hidden">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#3D9A8C] text-white">
                  <StarIcon className="h-5 w-5" />
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">
                  Local Restaurant Shifts
                </h4>
              </div>
              <p className="text-gray-600">
                Find flexible part-time shifts at nearby restaurants that fit your schedule and pay well.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FF7E5F] text-white">
                  <UsersIcon className="h-5 w-5" />
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">
                  Content Creation Gigs
                </h4>
              </div>
              <p className="text-gray-600">
                Partner with local restaurants to create social media content, reviews, and promotional materials.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-[#3D9A8C] to-[#FF7E5F] text-white">
                  <StarIcon className="h-5 w-5" />
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">
                  Build Your Portfolio
                </h4>
              </div>
              <p className="text-gray-600">
                Gain real restaurant industry experience while building your content portfolio and professional network.
              </p>
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-[#e8f5f3] to-[#d4ebe7] p-6 rounded-lg relative overflow-hidden">
              <blockquote className="relative z-10">
                <p className="text-gray-700 italic">
                  "I picked up weekend shifts at three local cafes through this platform - perfect for my college schedule!"
                </p>
                <footer className="mt-2 text-sm font-medium text-[#3D9A8C]">
                  — Emma, College Student
                </footer>
              </blockquote>
            </div>
            <div className="bg-gradient-to-r from-[#fff5f2] to-[#ffece7] p-6 rounded-lg relative overflow-hidden">
              <blockquote className="relative z-10">
                <p className="text-gray-700 italic">
                  "Creating content for local restaurants helped me build my portfolio and earn extra income!"
                </p>
                <footer className="mt-2 text-sm font-medium text-[#FF7E5F]">
                  — Jake, Content Creator
                </footer>
              </blockquote>
            </div>
          </div>
          <div className="mt-10 text-center">
            <button className="px-6 py-3 rounded-full text-white bg-[#3D9A8C] hover:bg-[#348c7e] font-medium flex items-center mx-auto hover:scale-105">
              Find Local Opportunities
            </button>
          </div>
        </div>
      </section>
    )
}

export default Community;