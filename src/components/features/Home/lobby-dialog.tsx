'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateLobbyResponse } from '@/services/lobby/model/create-lobby-response'

export default function LobbyDialog({ 
  lobby,
  onClose
}: { lobby: CreateLobbyResponse, onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(true);

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
          <a
            href={lobby.blueTeamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 text-white p-3 rounded-md hover:opacity-80 transition-opacity flex items-center justify-between"
          >
            <span className="mr-2">Blue Team:</span>
            <span className="text-sm opacity-75">{lobby.blueTeamUrl}</span>
          </a>
          <a
            href={lobby.redTeamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-700 text-white p-3 rounded-md hover:opacity-80 transition-opacity flex items-center justify-between"
          >
            <span className="mr-2">Red Team:</span>
            <span className="text-sm opacity-75">{lobby.redTeamUrl}</span>
          </a>
          <a
            href={lobby.spectatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-700 text-white p-3 rounded-md hover:opacity-80 transition-opacity flex items-center justify-between"
          >
            <span className="mr-2">Spectators:</span>
            <span className="text-sm opacity-75">{lobby.spectatorUrl}</span>
          </a>
        </div>
        <Button onClick={copyAllUrls} className="w-full">
          Copy All
        </Button>
      </DialogContent>
    </Dialog>
  )
}