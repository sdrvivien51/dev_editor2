import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon, MapPinIcon, CalendarIcon } from 'lucide-react';

function ProfileInfo({ user }) {
  const { name, tagline, age, location, description, avatar, skills, certifications, languages } = user;

  return (
    <div className="relative px-4 pt-16 pb-4">
      {/* Avatar */}
      <div className="absolute -top-16 left-4">
        <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
          {avatar && (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{tagline}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        )}

        {/* Accordions */}
        <Accordion.Root type="multiple" className="space-y-2">
          {skills?.length > 0 && (
            <Accordion.Item value="skills" className="border rounded-lg">
              <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-left">
                <span className="font-medium">Compétences</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 transform accordion-chevron" />
              </Accordion.Trigger>
              <Accordion.Content className="px-4 py-2 text-sm">
                <ul className="space-y-1">
                  {skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-xs text-gray-500">({skill.level})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          )}

          {certifications?.length > 0 && (
            <Accordion.Item value="certifications" className="border rounded-lg">
              <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-left">
                <span className="font-medium">Certifications</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 transform accordion-chevron" />
              </Accordion.Trigger>
              <Accordion.Content className="px-4 py-2 text-sm">
                <ul className="space-y-1">
                  {certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          )}

          {languages?.length > 0 && (
            <Accordion.Item value="languages" className="border rounded-lg">
              <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-2 text-left">
                <span className="font-medium">Langues</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 transform accordion-chevron" />
              </Accordion.Trigger>
              <Accordion.Content className="px-4 py-2 text-sm">
                <ul className="space-y-1">
                  {languages.map((lang, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{lang.name}</span>
                      <span className="text-xs text-gray-500">{lang.level}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          )}
        </Accordion.Root>
      </div>
    </div>
  );
}

export default ProfileInfo;
