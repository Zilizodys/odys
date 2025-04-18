'use client';

import { useState, useRef, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { FiMapPin, FiDollarSign, FiTrash2 } from 'react-icons/fi';
import ImageWithFallback from '@/components/ImageWithFallback';

interface SwipeableActivityProps {
  activity: Activity;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export default function SwipeableActivity({ activity, onDelete, onClick }: SwipeableActivityProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - startX;
    
    // Limiter le swipe vers la droite et limiter la distance maximale vers la gauche
    if (diff > 0) {
      setCurrentX(0);
    } else {
      setCurrentX(Math.max(diff, -200));
    }
  };

  const handleTouchEnd = () => {
    if (!startX) return;

    // Si on a swipé suffisamment loin vers la gauche, supprimer l'activité
    if (currentX < -100) {
      onDelete(activity.id);
    } else {
      // Sinon, revenir à la position initiale
      setCurrentX(0);
    }

    setStartX(null);
    setIsDragging(false);
  };

  // Réinitialiser la position si l'activité change
  useEffect(() => {
    setCurrentX(0);
    setStartX(null);
    setIsDragging(false);
  }, [activity.id]);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Fond rouge avec icône de suppression */}
      <div className="absolute inset-y-0 right-0 bg-red-500 w-[100px] flex items-center justify-center">
        <FiTrash2 className="w-6 h-6 text-white" />
      </div>

      {/* Carte de l'activité */}
      <div
        ref={cardRef}
        className={`bg-white rounded-xl overflow-hidden shadow-sm transition-transform ${isDragging ? '' : 'duration-200 ease-out'}`}
        style={{ transform: `translateX(${currentX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={currentX === 0 ? onClick : undefined}
      >
        <div className="flex">
          <div className="w-1/3 relative h-32">
            <ImageWithFallback
              src={activity.imageUrl || `https://placehold.co/600x400/e4e4e7/1f2937?text=${encodeURIComponent(activity.title)}`}
              alt={activity.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="w-2/3 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500">
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm truncate max-w-[150px]">{activity.address}</span>
              </div>
              <div className="flex items-center gap-1 text-indigo-600">
                <FiDollarSign className="w-4 h-4" />
                <span className="font-medium">{activity.price === 0 ? 'Gratuit' : `${activity.price}€`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 