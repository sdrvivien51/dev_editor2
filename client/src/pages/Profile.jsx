import React from 'react';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';

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
      { name: "TypeScript", level: "Advanced" }
    ],
    certifications: [
      "AWS Certified Developer",
      "Google Cloud Professional"
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "C1" },
      { name: "Espagnol", level: "B2" }
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <ProfileBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-6">
          {/* Left column */}
          <div className="lg:col-span-1">
            <ProfileInfo user={user} />
          </div>
          
          {/* Right column */}
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
