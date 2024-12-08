import { LobbyService, LobbyServiceImpl } from "./lobby.service";

export function useLobbyService(): LobbyService {
  return new LobbyServiceImpl()
}