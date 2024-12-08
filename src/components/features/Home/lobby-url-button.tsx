import React from "react";

interface LobbyUrlButtonProps {
  label: string;
  url: string;
  className: string;
  onClick: () => void;
}

const LobbyUrlButton: React.FC<LobbyUrlButtonProps> = ({ label, url, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-md hover:opacity-80 transition-opacity flex items-center justify-between ${className}`}
    >
      <span className="mr-2">{label}</span>
      <span className="text-sm opacity-75">{url}</span>
    </button>
  );
};

export default LobbyUrlButton;
