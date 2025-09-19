import React, { useState, useEffect } from "react";
import {
  GraduationCapIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  UserCircle,
  MapPin,
  Upload,
  BookOpenIcon,
  SmileIcon,
  AwardIcon,
} from "lucide-react";
import ProfileSection from "components/ProfileSection";

const ApplicantProfilePage = (user: any) => {
  const profile = user.profile || {}; // Add fallback to empty object

  return (
    <div className="w-full min-h-screen bg-teal-50">

      <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-12 relative">
      
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center overflow-hidden">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-16 h-16 text-teal-300" />
              )}
            </div>
            
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <ProfileSection
          title={"Bio"}
          icon={<UserCircle className="w-6 h-6" />}
          section={"bio"}
          placeholder={profile?.bio}
          bio={profile?.bio}
          onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Education"}
          icon={<GraduationCapIcon className="w-6 h-6" />}
          section={"education"}
          placeholder={"Add education..."}
          selectedItems={profile?.education}
         onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Extracurriculars"}
          icon={<BookOpenIcon className="w-6 h-6" />}
          section={"extracurriculars"}
          placeholder={"Add extracurricular activity..."}
          selectedItems={profile?.extracurriculars}
         onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Clubs"}
          icon={<UsersIcon className="w-6 h-6" />}
          section={"clubs"}
          placeholder={"Add club..."}
          selectedItems={profile.clubs}
          onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Hobbies"}
          icon={<SmileIcon className="w-6 h-6" />}
          section={"hobbies"}
          placeholder={"Add hobby..."}
          selectedItems={profile.hobbies}
          onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Work Experience"}
          icon={<BriefcaseIcon className="w-6 h-6" />}
          section={"work"}
          placeholder={"Add work experience..."}
          selectedItems={profile.work}
          onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Awards"}
          icon={<AwardIcon className="w-6 h-6" />}
          section={"awards"}
          placeholder={"Add award..."}
          selectedItems={profile.awards}
          onChange={()=>{}}
          onSave={()=>{}}
        />
        <ProfileSection
          title={"Volunteer"}
          icon={<HeartIcon className="w-6 h-6" />}
          section={"volunteer"}
          placeholder={"Add volunteer experience..."}
          selectedItems={profile.volunteer}
          onChange={()=>{}}
          onSave={()=>{}}
        />
      </div>
    </div>
  );
};

export default ApplicantProfilePage;
