import React from 'react';
import { InstagramCard } from '../molecules/InstagramCard';
import { MOCK_NEWS } from '../../types/dashboardData';

export const NewsWidget: React.FC = () => {
  return (
    <section className="mt-8 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Novedades <span className="text-itec-red-skye">ITEC</span>
        </h2>
        <a href="https://instagram.com/itecba" target="_blank" rel="noreferrer" className="text-itec-red-skye hover:underline text-sm font-medium">
          Ver Instagram
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_NEWS.slice(0, 4).map((news) => (
          <InstagramCard 
            key={news.id} 
            imageUrl={news.imageUrl} 
            caption={news.caption} 
            date={news.date} 
            link={news.link} 
          />
        ))}
      </div>
    </section>
  );
};