import React from 'react';

interface RollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  icon?: React.ReactNode;
  className?: string;
}

export const RollButton: React.FC<RollButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const baseClass = isPrimary ? 'btn-alignx-roll btn-alignx-roll-primary' : 'btn-alignx-roll';

  return (
    <button
      className={`${baseClass} ${className}`}
      style={style}
      {...props}
    >
      <span className="roll-track">
        <span className="roll-item">{children}</span>
        <span className="roll-item">{children}</span>
      </span>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
    </button>
  );
};
