// GradeYearButton.tsx — Botón de año usando clases del design system
import React from 'react';
import { Button } from '@components/ui/Button';

interface Props {
  label: string;
  isActive: boolean;
  hasVideo: boolean;
  onClick: () => void;
}

export const GradeYearButton: React.FC<Props> = ({ label, isActive, hasVideo, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'primary' : 'secondary'}
    hierarchy={isActive ? 'solid' : 'outline'}
    text={hasVideo ? `▶ ${label}` : label}
    className="text-xs"
  />
);
