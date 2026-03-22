import type {
  CandidateWeightedResult,
  GroupBreakdownItem,
} from "@/api/contracts";
import { SectionHeader } from "@/components/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatInteger, formatPercentage } from "@/lib/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info } from "lucide-react";

import {
  getCoverageLevel,
  getCoverageLevelLabel,
  getCoveragePercentage,
} from "./coverage";
import {
  getMunicipalityGroupHint,
  getMunicipalityGroupLabel,
  getStateDisplayLabel,
} from "./display-labels";

interface GroupBreakdownProps {
  groups: GroupBreakdownItem[];
}

function getBadgeVariant(
  level: "baixa" | "media" | "alta",
): "destructive" | "secondary" | "default" {
  if (level === "baixa") {
    return "destructive";
  }

  if (level === "media") {
    return "secondary";
  }

  return "default";
}

function normalizeCandidates(
  candidates: CandidateWeightedResult[],
): CandidateWeightedResult[] {
  return [...candidates].sort(
    (a, b) => b.weightedPercentage - a.weightedPercentage,
  );
}

export function GroupBreakdown({ groups }: GroupBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <SectionHeader
          title="Detalhamento por Grupo"
          description="Comparativo por porte municipal e estado retornado no processamento da pesquisa."
        />
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Nenhum detalhamento por grupo foi retornado para esta importação.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {groups.map((group) => {
              const coverage = getCoveragePercentage(group);
              const coverageLevel = getCoverageLevel(coverage);
              const orderedCandidates = normalizeCandidates(group.candidates);
              const groupLabel = getMunicipalityGroupLabel(
                group.municipalityGroup,
              );
              const groupHint = getMunicipalityGroupHint(
                group.municipalityGroup,
              );
              const stateLabel = getStateDisplayLabel(group.stateAcronym);

              return (
                <AccordionItem
                  key={`${group.stateAcronym}-${group.municipalityGroup}`}
                  value={`${group.stateAcronym}-${group.municipalityGroup}`}
                >
                  <AccordionTrigger>
                    <div className="flex w-full flex-col gap-2 pr-3 text-left md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-foreground">
                        {groupLabel} - {stateLabel}
                        <span
                          className="ml-2 inline-flex align-middle text-muted-foreground"
                          title={groupHint}
                          aria-label={groupHint}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </span>
                      </span>
                      <Badge variant={getBadgeVariant(coverageLevel)}>
                        Cobertura {getCoverageLevelLabel(coverageLevel)}:{" "}
                        {formatPercentage(coverage)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                      <div className="grid gap-3 text-sm md:grid-cols-3">
                        <p>
                          População do grupo:{" "}
                          <strong>
                            {formatInteger(group.groupPopulation)}
                          </strong>
                        </p>
                        <p>
                          População amostrada:{" "}
                          <strong>
                            {formatInteger(group.sampledPopulation)}
                          </strong>
                        </p>
                        <p>
                          Estado: <strong>{stateLabel}</strong>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Taxa de cobertura
                        </p>
                        <Progress value={coverage} />
                      </div>

                      <div className="h-[270px] rounded-md border bg-background p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={orderedCandidates}
                            margin={{
                              top: 10,
                              right: 16,
                              left: 12,
                              bottom: 18,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                            />
                            <XAxis
                              dataKey="candidateName"
                              angle={-20}
                              textAnchor="end"
                              interval={0}
                              height={65}
                            />
                            <YAxis
                              tickFormatter={(value: number) => `${value}%`}
                            />
                            <Tooltip
                              formatter={(value) =>
                                formatPercentage(Number(value ?? 0))
                              }
                            />
                            <Bar dataKey="weightedPercentage" fill="#0f766e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
