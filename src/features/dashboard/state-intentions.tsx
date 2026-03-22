import { useMemo } from "react";

import type { GroupBreakdownItem, MunicipalityGroup } from "@/api/contracts";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInteger, formatPercentage } from "@/lib/format";

import { getStateDisplayLabel } from "./display-labels";

interface StateIntentionsProps {
  groups: GroupBreakdownItem[];
}

const GROUP_ORDER: MunicipalityGroup[] = [
  "GROUP_1",
  "GROUP_2",
  "GROUP_3",
  "GROUP_4",
];

const GROUP_DEFINITIONS: Record<
  MunicipalityGroup,
  { shortLabel: string; description: string }
> = {
  GROUP_1: {
    shortLabel: "Grupo 1",
    description: "até 20 mil habitantes",
  },
  GROUP_2: {
    shortLabel: "Grupo 2",
    description: "entre 20 mil e 100 mil habitantes",
  },
  GROUP_3: {
    shortLabel: "Grupo 3",
    description: "entre 100 mil e 1 milhão de habitantes",
  },
  GROUP_4: {
    shortLabel: "Grupo 4",
    description: "acima de 1 milhão de habitantes",
  },
};

interface CandidateAccumulator {
  candidateName: string;
  weightedSum: number;
}

interface StateIntentionsData {
  stateAcronym: string;
  sampledPopulation: number;
  groupSummary: Array<{
    group: MunicipalityGroup;
    sampledPopulation: number;
    groupPopulation: number;
    coverage: number;
  }>;
  candidates: Array<{
    candidateName: string;
    weightedPercentage: number;
  }>;
}

function buildStateIntentions(
  groups: GroupBreakdownItem[],
): StateIntentionsData[] {
  const byState = new Map<
    string,
    {
      sampledPopulation: number;
      candidates: Map<string, CandidateAccumulator>;
      groupSummary: Map<
        MunicipalityGroup,
        {
          sampledPopulation: number;
          groupPopulation: number;
        }
      >;
    }
  >();

  for (const group of groups) {
    const sampled = group.sampledPopulation;
    const stateEntry = byState.get(group.stateAcronym) ?? {
      sampledPopulation: 0,
      candidates: new Map<string, CandidateAccumulator>(),
      groupSummary: new Map<
        MunicipalityGroup,
        {
          sampledPopulation: number;
          groupPopulation: number;
        }
      >(),
    };

    stateEntry.sampledPopulation += sampled;

    const groupEntry = stateEntry.groupSummary.get(group.municipalityGroup) ?? {
      sampledPopulation: 0,
      groupPopulation: 0,
    };
    groupEntry.sampledPopulation += group.sampledPopulation;
    groupEntry.groupPopulation += group.groupPopulation;
    stateEntry.groupSummary.set(group.municipalityGroup, groupEntry);

    for (const candidate of group.candidates) {
      const candidateEntry = stateEntry.candidates.get(
        candidate.candidateId,
      ) ?? {
        candidateName: candidate.candidateName,
        weightedSum: 0,
      };

      candidateEntry.weightedSum += candidate.weightedPercentage * sampled;
      stateEntry.candidates.set(candidate.candidateId, candidateEntry);
    }

    byState.set(group.stateAcronym, stateEntry);
  }

  return Array.from(byState.entries())
    .map(([stateAcronym, stateEntry]) => {
      const denominator = stateEntry.sampledPopulation;
      const candidates = Array.from(stateEntry.candidates.values())
        .map((candidate) => ({
          candidateName: candidate.candidateName,
          weightedPercentage:
            denominator > 0 ? candidate.weightedSum / denominator : 0,
        }))
        .sort((a, b) => b.weightedPercentage - a.weightedPercentage);

      const groupSummary = GROUP_ORDER.map((group) => {
        const summary = stateEntry.groupSummary.get(group) ?? {
          sampledPopulation: 0,
          groupPopulation: 0,
        };
        const coverage =
          summary.groupPopulation > 0
            ? (summary.sampledPopulation / summary.groupPopulation) * 100
            : 0;

        return {
          group,
          sampledPopulation: summary.sampledPopulation,
          groupPopulation: summary.groupPopulation,
          coverage,
        };
      });

      return {
        stateAcronym,
        sampledPopulation: stateEntry.sampledPopulation,
        groupSummary,
        candidates,
      };
    })
    .sort((a, b) => a.stateAcronym.localeCompare(b.stateAcronym));
}

export function StateIntentions({ groups }: StateIntentionsProps) {
  const states = useMemo(() => buildStateIntentions(groups), [groups]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          title="Intenção de voto por estado"
          description="Consolidação por UF com base nos grupos retornados pela API."
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">
            Perspectiva por porte municipal
          </p>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {GROUP_ORDER.map((group) => (
              <div
                key={group}
                className="rounded-md border bg-background/70 p-2"
              >
                <p className="text-xs font-semibold text-foreground">
                  {GROUP_DEFINITIONS[group].shortLabel}
                </p>
                <p className="text-xs">
                  {GROUP_DEFINITIONS[group].description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {states.length === 0 ? (
          <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            Nenhum estado encontrado na importação atual.
          </p>
        ) : null}

        {states.length === 1 ? (
          <p className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
            Apenas o estado{" "}
            <strong>
              {getStateDisplayLabel(states[0]?.stateAcronym ?? "")}
            </strong>{" "}
            foi retornado nesta importação.
          </p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {states.map((state) => (
            <div key={state.stateAcronym} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {getStateDisplayLabel(state.stateAcronym)}
                </h3>
                <Badge variant="outline">
                  Base amostrada consolidada:{" "}
                  {formatInteger(state.sampledPopulation)}
                </Badge>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {state.groupSummary.map((summary) => (
                  <div
                    key={`${state.stateAcronym}-${summary.group}`}
                    className="rounded-md border bg-muted/20 p-2"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {GROUP_DEFINITIONS[summary.group].shortLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Faixa: {GROUP_DEFINITIONS[summary.group].description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Amostra: {formatInteger(summary.sampledPopulation)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cobertura: {formatPercentage(summary.coverage)}
                    </p>
                  </div>
                ))}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidato</TableHead>
                    <TableHead className="text-right">
                      Intenção no estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.candidates.map((candidate) => (
                    <TableRow
                      key={`${state.stateAcronym}-${candidate.candidateName}`}
                    >
                      <TableCell>{candidate.candidateName}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex min-w-[88px] items-center justify-end">
                          {formatPercentage(candidate.weightedPercentage)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
