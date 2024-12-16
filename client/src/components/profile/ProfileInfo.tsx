import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
import type { ProfileUser } from '../../types/profile';

interface ProfileInfoProps {
  user: ProfileUser;
}

function ProfileInfo({ user }: ProfileInfoProps) {
  const { name, tagline, age, location, description, avatar, skills, certifications, languages } = user;

  return (
    <div className="relative px-6 pt-16 pb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {/* Avatar */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {name?.[0]}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{tagline}</p>
        </div>

        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {age && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{age} ans</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center">{description}</p>
        )}

        {/* Sections avec aperçu */}
        <div className="space-y-6">
          {/* Skills Section */}
          {skills?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Compétences</span>
                <span>{skills.length} au total</span>
              </div>
              
              {/* Preview avec style amélioré */}
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors hover:border-blue-500"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      ({skill.level})
                    </span>
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="px-3 py-1.5 text-sm rounded-full bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-600">
                    +{skills.length - 3}
                  </span>
                )}
              </div>

              {/* Accordion */}
              <Accordion.Root type="single" collapsible>
                <Accordion.Item value="skills" className="border rounded-lg overflow-hidden">
                  <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-sm text-left hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium">Voir toutes les compétences</span>
                    <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 ui-open:rotate-180" />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-4 py-3 text-sm border-t bg-white dark:bg-gray-700/50">
                    <div className="grid grid-cols-2 gap-3">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <span>{skill.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          )}

          {/* Certifications Section */}
          {certifications?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Certifications</span>
                <span>{certifications.length} au total</span>
              </div>

              {/* Preview amélioré */}
              <div className="space-y-2">
                {certifications.slice(0, 2).map((cert, index) => (
                  <div 
                    key={index}
                    className="p-3 text-sm bg-white dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-600"
                  >
                    {cert}
                  </div>
                ))}
                {certifications.length > 2 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 pl-2">
                    +{certifications.length - 2} autres
                  </div>
                )}
              </div>

              {/* Accordion */}
              {certifications.length > 2 && (
                <Accordion.Root type="single" collapsible>
                  <Accordion.Item value="certifications" className="border rounded-lg overflow-hidden">
                    <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-sm text-left hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      <span className="font-medium">Voir toutes les certifications</span>
                      <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 ui-open:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="px-4 py-3 text-sm border-t bg-white dark:bg-gray-700/50">
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                            {cert}
                          </div>
                        ))}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              )}
            </div>
          )}

          {/* Languages Section */}
          {languages?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Langues</span>
                <span>{languages.length} au total</span>
              </div>

              {/* Preview amélioré */}
              <div className="flex flex-wrap gap-2">
                {languages.slice(0, 2).map((lang, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {lang.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                      {lang.level}
                    </span>
                  </div>
                ))}
                {languages.length > 2 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    +{languages.length - 2} autres
                  </span>
                )}
              </div>

              {/* Accordion */}
              {languages.length > 2 && (
                <Accordion.Root type="single" collapsible>
                  <Accordion.Item value="languages" className="border rounded-lg overflow-hidden">
                    <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-sm text-left hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      <span className="font-medium">Voir toutes les langues</span>
                      <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 ui-open:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="px-4 py-3 text-sm border-t bg-white dark:bg-gray-700/50">
                      <div className="space-y-2">
                        {languages.map((lang, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700">
                              {lang.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
