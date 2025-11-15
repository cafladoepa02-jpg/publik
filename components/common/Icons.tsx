
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const HomeIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
  </svg>
);

export const BookIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <path d="M3 6l0 13" />
    <path d="M12 6l0 13" />
    <path d="M21 6l0 13" />
  </svg>
);

export const MusicIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M9 17v-13h10v13" />
    <path d="M9 8h10" />
  </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z" />
    <path d="M8.5 13.5a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z" />
    <path d="M12 3l-1.5 6l-6 1.5l6 1.5l1.5 6l1.5 -6l6 -1.5l-6 -1.5z" />
  </svg>
);

export const WandIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 21l15 -15l-3 -3l-15 15l3 3" />
    <path d="M15 6l3 3" />
    <path d="M9 12l3 3" />
  </svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
);

export const PauseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5h4v14h-4z" /><path d="M14 5h4v14h-4z" /></svg>
);

export const PrevIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 5v14l-8 -7z" /><path d="M10 5v14l-8 -7z" /></svg>
);

export const NextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5v14l8 -7z" /><path d="M14 5v14l8 -7z" /></svg>
);

export const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
);
