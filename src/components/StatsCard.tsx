import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export default function StatsCard({ title, value, icon: Icon, color, onClick }: StatsCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8">
        <div className={`absolute inset-0 ${color} opacity-10 rounded-full`} />
      </div>
      <div className="relative">
        <Icon className={`h-8 w-8 ${color} text-white rounded-lg p-1`} />
        <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}