import type { GroupBreakdownItem } from "@/api/contracts";

export type CoverageLevel = "baixa" | "media" | "alta";

export function getCoverageLevelLabel(level: CoverageLevel): string {
  if (level === "media") {
    return "média";
  }

  return level;
}

export function getCoveragePercentage(group: GroupBreakdownItem): number {
  if (group.groupPopulation <= 0) {
    return 0;
  }

  return (group.sampledPopulation / group.groupPopulation) * 100;
}

export function getCoverageLevel(coverage: number): CoverageLevel {
  if (coverage < 5) {
    return "baixa";
  }

  if (coverage < 15) {
    return "media";
  }

  return "alta";
}
