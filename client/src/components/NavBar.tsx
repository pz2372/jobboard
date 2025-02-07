import React from 'react'

import { BriefcaseIcon, UserCircle } from 'lucide-react'

const NavBar = () => {
return (        <nav className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg rounded-full max-w-2xl mx-auto px-6 backdrop-blur-sm bg-opacity-95 border border-teal-500/20 z-40 my-4 mt-12">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-14">
        <div className="bg-white/10 p-2 rounded-xl">
          <span className="text-white font-bold text-xl tracking-wide px-4">
            Logo
          </span>
        </div>
        <div className="flex items-center justify-center gap-8 flex-1 ml-8">
          <a className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110">
            <div className="relative">
              <BriefcaseIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
            <span className="group-hover:tracking-wider transition-all duration-300">
              Jobs
            </span>
          </a>
          <div className="w-px h-6 bg-white/20 rounded-full"></div>
          <a className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110">
            <div className="relative">
              <UserCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
            <span className="group-hover:tracking-wider transition-all duration-300">
              Profile
            </span>
          </a>
        </div>
        <div className="w-[100px]"></div>
      </div>
    </div>
  </nav>)
}

export default NavBar