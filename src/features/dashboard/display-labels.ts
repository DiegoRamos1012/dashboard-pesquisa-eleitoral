import type { MunicipalityGroup } from "@/api/contracts";

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
