import { useState } from "react";

import type {
  CandidateWeightedResult,
  GroupBreakdownItem,
} from "@/api/contracts";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercentage } from "@/lib/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GeneralRankingProps {
  candidates: CandidateWeightedResult[];
  groups: GroupBreakdownItem[];
}

const BAR_COLORS = [
  "#0f766e",
  "#0369a1",
  "#f97316",
  "#b45309",
  "#475569",
  "#be123c",
  "#4f46e5",
];

type ChartType = "bar" | "line-dotted" | "pie";

function buildNationalIntention(
  groups: GroupBreakdownItem[],
  fallbackCandidates: CandidateWeightedResult[],
): CandidateWeightedResult[] {
  if (groups.length === 0) {
    return [...fallbackCandidates].sort(
      (a, b) => b.weightedPercentage - a.weightedPercentage,
    );
  }

  const byCandidate = new Map<
    string,
    {
      candidateName: string;
      weightedSum: number;
    }
  >();

  let sampledTotal = 0;

  for (const group of groups) {
    const sampled = group.sampledPopulation;
    sampledTotal += sampled;

    for (const candidate of group.candidates) {
      const entry = byCandidate.get(candidate.candidateId) ?? {
        candidateName: candidate.candidateName,
        weightedSum: 0,
      };

      entry.weightedSum += candidate.weightedPercentage * sampled;
      byCandidate.set(candidate.candidateId, entry);
    }
  }

  if (sampledTotal <= 0) {
    return [...fallbackCandidates].sort(
      (a, b) => b.weightedPercentage - a.weightedPercentage,
    );
  }

  return Array.from(byCandidate.entries())
    .map(([candidateId, entry]) => ({
      candidateId,
      candidateName: entry.candidateName,
      weightedPercentage: entry.weightedSum / sampledTotal,
    }))
    .sort((a, b) => b.weightedPercentage - a.weightedPercentage);
}

export function GeneralRanking({ candidates, groups }: GeneralRankingProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const orderedCandidates = buildNationalIntention(groups, candidates);
  const total = orderedCandidates.reduce(
    (sum, candidate) => sum + candidate.weightedPercentage,
    0,
  );

  const renderChart = () => {
    if (chartType === "line-dotted") {
      return (
        <LineChart
          data={orderedCandidates}
          margin={{ top: 10, right: 16, left: 12, bottom: 18 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="candidateName"
            angle={-20}
            textAnchor="end"
            interval={0}
            height={65}
          />
          <YAxis tickFormatter={(value: number) => `${value}%`} />
          <Tooltip
            formatter={(value) => formatPercentage(Number(value ?? 0))}
          />
          <Line
            type="monotone"
            dataKey="weightedPercentage"
            name="Percentual"
            stroke="#0f766e"
            strokeWidth={2.5}
            strokeDasharray="4 4"
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    }

    if (chartType === "pie") {
      return (
        <PieChart>
          <Tooltip
            formatter={(value) => formatPercentage(Number(value ?? 0))}
          />
          <Legend />
          <Pie
            data={orderedCandidates}
            dataKey="weightedPercentage"
            nameKey="candidateName"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, value }) =>
              `${String(name ?? "Candidato")}: ${formatPercentage(Number(value ?? 0))}`
            }
          >
            {orderedCandidates.map((candidate, index) => (
              <Cell
                key={candidate.candidateId}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      );
    }

    return (
      <BarChart
        data={orderedCandidates}
        margin={{ top: 10, right: 16, left: 12, bottom: 18 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="candidateName"
          angle={-20}
          textAnchor="end"
          interval={0}
          height={65}
        />
        <YAxis tickFormatter={(value: number) => `${value}%`} />
        <Tooltip formatter={(value) => formatPercentage(Number(value ?? 0))} />
        <Bar dataKey="weightedPercentage" name="Percentual">
          {orderedCandidates.map((candidate, index) => (
            <Cell
              key={candidate.candidateId}
              fill={BAR_COLORS[index % BAR_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          title="Ranking Geral"
          description="Intenção de voto nacional consolidada com base na soma ponderada de todos os estados retornados."
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => setChartType("bar")}
          >
            Gráfico de barras
          </Button>
          <Button
            type="button"
            size="sm"
            variant={chartType === "line-dotted" ? "default" : "outline"}
            onClick={() => setChartType("line-dotted")}
          >
            Gráfico pontilhado
          </Button>
          <Button
            type="button"
            size="sm"
            variant={chartType === "pie" ? "default" : "outline"}
            onClick={() => setChartType("pie")}
          >
            Gráfico de pizza
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead className="text-right">
                  Percentual ponderado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedCandidates.map((candidate) => (
                <TableRow key={candidate.candidateId}>
                  <TableCell className="font-medium">
                    {candidate.candidateName}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(candidate.weightedPercentage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="h-[320px] min-w-0 rounded-lg border bg-background p-2">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={220}
          >
            {renderChart()}
          </ResponsiveContainer>
        </div>

        <p className="text-sm font-medium text-foreground">
          Soma dos percentuais: {formatPercentage(total)}
        </p>
      </CardContent>
    </Card>
  );
}
