// Icon components
import React from 'react';

const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };

export const CalendarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export const DumbbellIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <path d="M6.5 6.5L17.5 17.5M14.5 6.5L17.5 9.5M9.5 14.5L6.5 17.5M4 8V16M20 8V16M2 10V14M22 10V14"/>
  </svg>
);

export const UtensilsIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
);

export const ListIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

export const CheckIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

export const PlusIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const MinusIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const ChevronLeftIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);

export const ChevronRightIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

export const EditIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const TrashIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export const CloseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const TimerIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <circle cx="12" cy="13" r="10"/>
    <polyline points="12,8 12,13 16,15"/>
    <line x1="12" y1="3" x2="12" y2="5"/>
  </svg>
);

export const PlayIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>
);

export const PauseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>
);

export const MoreIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...iconProps}>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="19" cy="12" r="1" fill="currentColor"/>
    <circle cx="5" cy="12" r="1" fill="currentColor"/>
  </svg>
);
