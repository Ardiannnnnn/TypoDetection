interface FlagIconProps {
  country: string;
  className?: string;
}

export default function FlagIcon({ country, className = "w-5 h-5" }: FlagIconProps) {
  const flags = {
    US: (
      <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="us">
            <path fillOpacity=".7" d="M0 0h640v480H0z"/>
          </clipPath>
        </defs>
        <g fillRule="evenodd" clipPath="url(#us)">
          <g strokeWidth="1pt">
            <path fill="#bd3d44" d="M0 0h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z"/>
            <path fill="#fff" d="M0 37h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z"/>
          </g>
          <path fill="#192f5d" d="M0 0h364v259H0z"/>
          <g fill="#fff">
            <g id="stars">
              <g id="star">
                <path d="M27 11l5 16h16l-13 10 5 16-13-10-13 10 5-16-13-10h16z"/>
              </g>
              {/* Add more stars here if needed */}
            </g>
          </g>
        </g>
      </svg>
    ),
    ID: (
      <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e70011" d="M0 0h640v240H0z"/>
        <path fill="#fff" d="M0 240h640v240H0z"/>
      </svg>
    )
  };

  return flags[country as keyof typeof flags] || (
    <div className={`${className} bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600`}>
      {country}
    </div>
  );
}