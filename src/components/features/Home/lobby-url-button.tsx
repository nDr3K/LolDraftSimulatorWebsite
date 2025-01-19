import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import React from "react";

interface LobbyUrlButtonProps {
  label: string;
  url: string;
  className: string;
  onClick: () => void;
}
const LobbyUrlButton: React.FC<LobbyUrlButtonProps> = ({ label, url, className, onClick }) => {
  const { toast } = useToast()

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(`${window.location.host}${url}`).then(() => {
      toast({description:'URL copied to clipboard!'})
    }).catch(_ => {
      // console.error('Failed to copy text: ', err);
    })
  }

  return (
    <div className={`w-full ${className} p-3 rounded-md flex items-center justify-between`}>
      <button
        onClick={onClick}
        className="hover:opacity-80 transition-opacity flex items-center justify-between"
      >
        <span className="mr-2">{label}</span>
        <span className="text-sm opacity-75">{url}</span>
      </button>
      <button className="rounded-md hover:opacity-80 transition-opacity">
        <Copy onClick={() => copyUrl(url)}/>
      </button>
    </div>
  );
};

export default LobbyUrlButton;
