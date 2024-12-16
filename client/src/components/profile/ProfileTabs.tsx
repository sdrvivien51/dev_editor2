import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import type { Project, Experience, Post } from '../../types/profile';

interface ProfileTabsProps {
  projects?: Project[];
  experiences?: Experience[];
  posts?: Post[];
}

function ProfileTabs({ projects = [], experiences = [], posts = [] }: ProfileTabsProps) {
  return (
    <Tabs.Root defaultValue="portfolio" className="w-full">
      <Tabs.List className="flex border-b">
        <Tabs.Trigger
          value="portfolio"
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
        >
          Portfolio & Expériences
        </Tabs.Trigger>
        <Tabs.Trigger
          value="posts"
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
        >
          Publications
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="portfolio" className="py-6 space-y-8">
        {/* Projects Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Projets</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {project.description}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Experiences Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Expériences</h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Tabs.Content>

      <Tabs.Content value="posts" className="py-6">
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
          ))}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default ProfileTabs;
