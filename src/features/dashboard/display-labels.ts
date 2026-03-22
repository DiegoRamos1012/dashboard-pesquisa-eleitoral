import type { MunicipalityGroup } from "@/api/contracts";

const STATE_NAMES: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export function getStateDisplayLabel(stateAcronym: string): string {
  const normalized = stateAcronym.toUpperCase();
  const fullName = STATE_NAMES[normalized];

  if (!fullName) {
    return normalized;
  }

  return `${fullName} (${normalized})`;
}

export function getMunicipalityGroupLabel(group: MunicipalityGroup): string {
  switch (group) {
    case "GROUP_1":
      return "Porte 1";
    case "GROUP_2":
      return "Porte 2";
    case "GROUP_3":
      return "Porte 3";
    case "GROUP_4":
      return "Porte 4";
    default:
      return group;
  }
}

export function getMunicipalityGroupHint(group: MunicipalityGroup): string {
  switch (group) {
    case "GROUP_1":
      return "Porte 1: municípios do primeiro agrupamento de população definido no backend.";
    case "GROUP_2":
      return "Porte 2: municípios do segundo agrupamento de população definido no backend.";
    case "GROUP_3":
      return "Porte 3: municípios do terceiro agrupamento de população definido no backend.";
    case "GROUP_4":
      return "Porte 4: municípios do quarto agrupamento de população definido no backend.";
    default:
      return group;
  }
}

export function getPollIdentifierLabel(pollId: string): string {
  return `Pesquisa #${pollId}`;
}
