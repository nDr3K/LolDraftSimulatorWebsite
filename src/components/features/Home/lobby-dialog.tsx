'use client'

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateLobbyResponse } from '@/services/lobby/model/create-lobby-response'
import LobbyUrlButton from './lobby-url-button';

export default function LobbyDialog({ 
  lobby,
  onClose
}: { lobby: CreateLobbyResponse, onClose: () => void }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const handleNavigate = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    
    if (newTab) {
      newTab.onload = () => {
        navigate(url);
      };
    }
  };

  const copyAllUrls = () => {
    const blueTeamLink = `Blue Team: ${lobby.blueTeamUrl}`;
    const redTeamLink = `Red Team: ${lobby.redTeamUrl}`;
    const spectatorsLink = `Spectators: ${lobby.spectatorUrl}`;
    const formattedText = [blueTeamLink, redTeamLink, spectatorsLink].join('\n');
    navigator.clipboard.writeText(formattedText).then(() => {
      alert('All URLs copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsOpen(open)
        onClose()
      }}}>
      <DialogContent className="sm:max-w-[600px]" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Important URLs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <LobbyUrlButton
            label="Blue Team:"
            url={lobby.blueTeamUrl}
            className="bg-blue-700 text-white"
            onClick={() => handleNavigate(lobby.blueTeamUrl)}
          />
          <LobbyUrlButton
            label="Red Team:"
            url={lobby.redTeamUrl}
            className="bg-red-700 text-white"
            onClick={() => handleNavigate(lobby.redTeamUrl)}
          />
          <LobbyUrlButton
            label="Spectators:"
            url={lobby.spectatorUrl}
            className="bg-zinc-700 text-white"
            onClick={() => handleNavigate(lobby.spectatorUrl)}
          />
        </div>
        <Button onClick={copyAllUrls} className="w-full">
          Copy All
        </Button>
      </DialogContent>
    </Dialog>
  )
}