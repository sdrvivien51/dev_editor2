import React from 'react';
import ProfileBanner from '../components/profile/ProfileBanner.tsx';
import ProfileInfo from '../components/profile/ProfileInfo.tsx';
import ProfileTabs from '../components/profile/ProfileTabs.tsx';
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
    <div className="container max-w-[900px] mx-auto px-6 sm:px-8 py-10 sm:py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <ProfileBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          {/* Colonne de gauche - Informations utilisateur */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ProfileInfo user={user} />
            </div>
          </div>
          
          {/* Colonne de droite - Contenu */}
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
