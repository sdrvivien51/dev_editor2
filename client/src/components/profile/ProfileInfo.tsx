import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ProfileUser } from '../../types/profile';

interface ProfileInfoProps {
  user: ProfileUser;
}

function ProfileInfo({ user }: ProfileInfoProps) {
  const { skills, certifications, languages } = user;

  const renderExpandableList = (items: any[], title: string, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!items?.length) return null;

    const visibleItems = items.slice(0, 3);
    const hiddenItems = items.slice(3);

    return (
      <div className="mb-6 last:mb-0">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
        <div className="space-y-2">
          {/* Premiers 3 éléments toujours visibles */}
          {visibleItems.map((item, index) => renderItem(item, index))}
          
          {/* Accordion pour les éléments supplémentaires */}
          {hiddenItems.length > 0 && (
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="more" className="border-none">
                <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                  <div className="space-y-2 pt-2">
                    {hiddenItems.map((item, index) => renderItem(item, visibleItems.length + index))}
                  </div>
                </Accordion.Content>
                <Accordion.Header className="mt-2">
                  <Accordion.Trigger className="flex w-full items-center justify-center">
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
              </Accordion.Item>
            </Accordion.Root>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stack technique */}
      {renderExpandableList(
        skills,
        "Stack technique",
        (skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <span className="text-sm text-gray-900 dark:text-gray-100">{skill.name}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {skill.level}
            </span>
          </div>
        )
      )}

      {/* Certifications */}
      {renderExpandableList(
        certifications,
        "Certifications",
        (cert, index) => (
          <div
            key={index}
            className="p-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <span className="text-gray-900 dark:text-gray-100">{cert}</span>
          </div>
        )
      )}

      {/* Langues */}
      {renderExpandableList(
        languages,
        "Langues",
        (lang, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <span className="text-sm text-gray-900 dark:text-gray-100">{lang.name}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {lang.level}
            </span>
          </div>
        )
      )}
    </div>
  );
}

export default ProfileInfo;
