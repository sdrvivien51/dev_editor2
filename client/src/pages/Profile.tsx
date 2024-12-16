import React from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import type { ProfileUser } from '../types/profile';

function Profile() {
  // Mock data - à remplacer par les vraies données de l'utilisateur
  const user: ProfileUser = {
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
    <div className="container max-w-[1000px] mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <ProfileBanner />
        
        {/* Nouveau container vertical pour les informations principales */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {user.name?.[0]}
                </div>
              )}
            </div>
            
            {/* Informations principales */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{user.tagline}</p>
              </div>

              {user.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {user.description}
                </p>
              )}

              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.age && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{user.age} ans</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec sidebar et tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
          {/* Sidebar - Informations techniques */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ProfileInfo user={user} />
            </div>
          </div>
          
          {/* Contenu principal - Portfolio & Posts */}
          <div className="lg:col-span-3">
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
