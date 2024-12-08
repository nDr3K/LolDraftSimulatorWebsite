import { CreateLobbyPayload } from "./model/create-lobby-payload";
import { CreateLobbyResponse } from "./model/create-lobby-response";

export interface LobbyService {
  createLobby(payload: CreateLobbyPayload): Promise<CreateLobbyResponse>
}

export class LobbyServiceImpl implements LobbyService {
  async createLobby(payload: CreateLobbyPayload): Promise<CreateLobbyResponse> {
    try {
      const response = await fetch("http://localhost:8080/api/lobby/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lobby creation failed:', error);
      throw error;
    }
  }
}