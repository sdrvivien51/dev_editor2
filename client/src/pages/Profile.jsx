import React from 'react';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import type { ProfileUser, Project, Experience, Post } from '../types/profile';

function Profile() {
  // Mock data - à remplacer par les vraies données de l'utilisateur
  const user = {
    name: "John Doe",
    tagline: "Full Stack Developer",
    age: 28,
    location: "Paris, France",
    description: "Passionate about web development and new technologies.",
    avatar: null,
    skills: [
      { name: "React", level: "Advanced" },
      { name: "Node.js", level: "Intermediate" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Python", level: "Intermediate" },
      { name: "Docker", level: "Beginner" }
    ],
    certifications: [
      "AWS Certified Developer",
      "Google Cloud Professional",
      "MongoDB Professional Developer",
      "React Native Specialist"
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "C1" },
      { name: "Espagnol", level: "B2" },
      { name: "Allemand", level: "A2" }
    ]
  };

  const projects = [
    {
      name: "E-commerce Platform",
      description: "A full-stack e-commerce platform built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB"]
    }
  ];

  const experiences = [
    {
      title: "Senior Developer",
      company: "Tech Corp",
      startDate: "2020",
      endDate: "Present",
      description: "Leading the frontend team and implementing new features."
    }
  ];

  const posts = [
    {
      title: "Understanding React Hooks",
      excerpt: "A deep dive into React's useState and useEffect hooks",
      date: "2024-01-15",
      readTime: 5
    }
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <ProfileBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
          {/* Colonne de gauche */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <ProfileInfo user={user} />
            </div>
          </div>
          
          {/* Colonne de droite */}
          <div className="lg:col-span-2">
            <ProfileTabs 
              projects={projects}
              experiences={experiences}
              posts={posts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
