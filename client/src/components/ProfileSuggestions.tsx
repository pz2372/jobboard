type SuggestionSection =
  | "education"
  | "extracurriculars"
  | "clubs"
  | "hobbies"
  | "work"
  | "awards"
  | "volunteer"
  | "bio";

  const profileSuggestions: { [key in SuggestionSection]: string[] } = {
  education: [
    "Bachelor's Degree",
    "Master's Degree",
    "High School Diploma",
    "Certification",
  ],
  extracurriculars: [
    "Student Government",
    "Drama Club",
    "Debate Team",
    "Sports Team",
  ],
  clubs: ["Chess Club", "Robotics Club", "Art Club", "Science Club"],
  hobbies: ["Football", "Reading", "Playing Guitar", "Cooking", "Basketball"],
  work: [
    "Internship",
    "Part-time Job",
    "Summer Position",
    "Research Assistant",
  ],
  awards: [
    "Dean's List",
    "Academic Excellence",
    "Leadership Award",
    "Sports Achievement",
  ],
  volunteer: [
    "Community Service",
    "Food Bank",
    "Animal Shelter",
    "Environmental Projects",
  ],
  bio: [],
};

export default profileSuggestions