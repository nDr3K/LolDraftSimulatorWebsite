import { DraftChampion } from '@/types/draft-champion';
import { DataChampion } from '@/types/datadragon-champion';
import { ChampionRoles, RolesData } from '@/types/roles-data';
import { Role } from '@/types/role';

interface IChampionService {

}

class ChampionService implements IChampionService {
  version: string | null;
  roles: RolesData | null;
  champions: Record<string, DataChampion> | null;

  constructor() {
    this.version = null;
    this.roles = null;
    this.champions = null;
  }

  async fetchLatestVersion(): Promise<string> {
    if (this.version) {
      return this.version;
    }
    const versionsResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!versionsResponse.ok) {
      throw new Error('Failed to fetch versions');
    }
    const versions = await versionsResponse.json();
    this.version = versions[0];
    if (!this.version) {
      throw new Error('Unable to retrieve valid version');
    }
    return this.version;
  }

  async fetchChampions(): Promise<Record<string, DataChampion>> {
    if (this.champions) {
      return this.champions;
    }
    if (!this.version) {
      throw new Error('Version not set. Call fetchLatestVersion() first.');
    }
    const championsResponse = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US/champion.json`
    );
    if (!championsResponse.ok) {
      throw new Error('Failed to fetch champions');
    }
    await this.fetchRolesData();
    const championsData = await championsResponse.json();
    this.champions = championsData.data as Record<string, DataChampion>;
    return this.champions;
  }

  async fetchRolesData() {
    try {
      const rolesResponse = await fetch(
        "http://localhost:8080/proxy/championrates"
      );
      if (!rolesResponse.ok) {
        throw new Error('Failed to fetch roles')
      }
      const rolesData = await rolesResponse.json();
      this.roles = rolesData as RolesData;
    } catch(err) {
      // TODO: remove role filter
    }
  }

  transformChampions(
    championsData: Record<string, DataChampion>,
    disabledChampionIds: Set<string | null>,
    currentChampion: DraftChampion | null,
    draftPhase: string | null
  ): Array<DraftChampion> {
    const transformedChampions: Array<DraftChampion> = Object.values(championsData).map((champion: DataChampion) => ({
      id: champion.id,
      name: champion.name,
      role: getRoles(this.roles?.data[champion.key]),
      status: disabledChampionIds.has(champion.id)
        ? 'disabled'
        : currentChampion?.id === champion.id
        ? 'hover'
        : 'none',
    }));

    transformedChampions.sort((a, b) => a.name.localeCompare(b.name));

    if (draftPhase && draftPhase !== 'pick') {
      transformedChampions.unshift({ id: 'none', name: 'none', role: [], status: 'none' });
    }

    return transformedChampions;
  }
}

function getRoles(rolesRates: ChampionRoles | undefined): Array<Role> {
  if (!rolesRates) return [];
  return Object.entries(rolesRates)
    .map(([role, data]) => ({
      role: role,
      playRate: data.playRate
    }))
    .filter(role => role.playRate > 0)
    .map(role => role.role as Role)
}

export default new ChampionService();