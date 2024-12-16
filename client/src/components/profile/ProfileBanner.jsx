import React from 'react';

function ProfileBanner({ bannerUrl }) {
  return (
    <div className="relative w-full h-[200px] bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
      )}
    </div>
  );
}

export default ProfileBanner;
