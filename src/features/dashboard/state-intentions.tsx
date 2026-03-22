import type { GroupBreakdownItem } from "@/api/contracts";
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

interface StateIntentionsProps {
  groups: GroupBreakdownItem[];
}

interface CandidateAccumulator {
  candidateName: string;
  weightedSum: number;
}

interface StateIntentionsData {
  stateAcronym: string;
  sampledPopulation: number;
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
    }
  >();

  for (const group of groups) {
    const sampled = group.sampledPopulation;
    const stateEntry = byState.get(group.stateAcronym) ?? {
      sampledPopulation: 0,
      candidates: new Map<string, CandidateAccumulator>(),
    };

    stateEntry.sampledPopulation += sampled;

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

      return {
        stateAcronym,
        sampledPopulation: stateEntry.sampledPopulation,
        candidates,
      };
    })
    .sort((a, b) => a.stateAcronym.localeCompare(b.stateAcronym));
}

export function StateIntentions({ groups }: StateIntentionsProps) {
  const states = buildStateIntentions(groups);

  if (states.length === 0) {
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
        {states.length === 1 ? (
          <p className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
            Apenas o estado <strong>{states[0]?.stateAcronym}</strong> foi
            retornado nesta importação.
          </p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {states.map((state) => (
            <div key={state.stateAcronym} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {state.stateAcronym}
                </h3>
                <Badge variant="outline">
                  Base amostrada consolidada:{" "}
                  {formatInteger(state.sampledPopulation)}
                </Badge>
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
