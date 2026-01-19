
import React from 'react';
import { BaZiPillar } from '../types';

interface PillarCardProps {
  label: string;
  pillar: BaZiPillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ label, pillar }) => {
  return (
    <div className="flex flex-col items-center bg-red-50 border-2 border-red-800 rounded-lg p-4 shadow-md w-24">
      <span className="text-xs text-red-900 font-bold mb-2">{label}</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-red-800">{pillar.stem}</span>
        <span className="text-3xl font-bold text-red-800">{pillar.branch}</span>
      </div>
    </div>
  );
};

export default PillarCard;
