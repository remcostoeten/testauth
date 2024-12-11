import React from 'react';

type GoogleIconProps = {
  size?: number | string;
  color?: string;        
  className?: string;    
  onClick?: () => void;  
};

const GoogleIcon: React.FC<GoogleIconProps> = ({
  size = 24,
  color,
  className = '',
  onClick
}) => {
  const defaultColors = {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC05',
    green: '#34A853',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      onClick={onClick}
      fill={color || 'none'}
    >
      <path
        d="M44.5 20H24v8.5h11.8C34.2 33.5 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.9 0 5.5 1 7.6 2.7l6.4-6.4C34 5.3 29.2 3.5 24 3.5 12.3 3.5 3.5 12.3 3.5 24S12.3 44.5 24 44.5c10.5 0 18.9-7.4 20-17.5.1-.5.2-1 .2-1.5 0-.8-.1-1.5-.2-2z"
        fill={defaultColors.blue}
      />
      <path
        d="M6.3 14.1l7.1 5.2C14.9 16.1 19.1 14 24 14c2.9 0 5.5 1 7.6 2.7l6.4-6.4C34 5.3 29.2 3.5 24 3.5 16.1 3.5 9.2 8.1 6.3 14.1z"
        fill={defaultColors.red}
      />
      <path
        d="M24 44.5c5.8 0 10.5-1.9 14.3-5.1l-6.5-5.2c-2 1.5-4.8 2.8-7.8 2.8-5.3 0-9.8-3.4-11.5-8.1l-7 5.4C9.3 40.6 16 44.5 24 44.5z"
        fill={defaultColors.green}
      />
      <path
        d="M44.5 20H24v8.5h11.8c-.7 2-2 3.8-3.8 5.1l6.5 5.2c3.8-3.3 6-8.3 6-13.8 0-.8-.1-1.5-.2-2z"
        fill={defaultColors.yellow}
      />
    </svg>
  );
};

export default GoogleIcon;
