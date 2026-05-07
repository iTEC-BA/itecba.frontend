import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';

export const ProfileHeader = ({ user, profileData }: any) => (
  <div className="relative w-full flex flex-col items-center py-10 px-6 bg-gradient-to-b from-itec-sidebar/50 to-transparent rounded-[3rem] overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(183,18,52,0.1),transparent_70%)] pointer-events-none"></div>
    
    <div className="relative group">
      <div className="w-32 h-32 rounded-full border-4 border-itec-bg shadow-2xl overflow-hidden bg-itec-sidebar flex items-center justify-center">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Icons type="user" className="w-16 h-16 text-gray-700" />
        )}
      </div>
      <button className="absolute bottom-1 right-1 bg-itec-red p-2.5 rounded-full border-4 border-itec-bg text-white hover:scale-110 transition-transform">
        <Icons type="edit" className="w-4 h-4" />
      </button>
    </div>

    <div className="text-center mt-6">
      <h1 className="text-3xl font-extrabold text-white tracking-tight">{user?.displayName || "Estudiante i-TEC"}</h1>
      <p className="text-itec-red font-medium mt-1 flex items-center justify-center gap-2">
        <Icons type="school" className="w-4 h-4" /> {profileData?.career || "Universidad Tecnológica Nacional"}
      </p>
    </div>
  </div>
);
