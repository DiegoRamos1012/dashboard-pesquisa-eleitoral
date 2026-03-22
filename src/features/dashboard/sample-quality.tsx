import type { GroupBreakdownItem } from "@/api/contracts";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

import { getCoverageLevel, getCoveragePercentage } from "./coverage";
import {
  getMunicipalityGroupHint,
  getMunicipalityGroupLabel,
  getStateDisplayLabel,
} from "./display-labels";

interface SampleQualityProps {
  groups: GroupBreakdownItem[];
}

function badgeVariant(
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

export function SampleQuality({ groups }: SampleQualityProps) {
  const enriched = groups.map((group) => {
    const coverage = getCoveragePercentage(group);

    return {
      key: `${group.stateAcronym}-${group.municipalityGroup}`,
      label: `${getMunicipalityGroupLabel(group.municipalityGroup)} (${getStateDisplayLabel(group.stateAcronym)})`,
      hint: getMunicipalityGroupHint(group.municipalityGroup),
      coverage,
      level: getCoverageLevel(coverage),
    };
  });

  const hasLowCoverage = enriched.some((entry) => entry.coverage < 5);

  return (
    <Card className={hasLowCoverage ? "border-destructive/40" : undefined}>
      <CardHeader>
        <SectionHeader
          title="Qualidade da Amostra"
          description="Sinaliza grupos com cobertura abaixo do limiar recomendado de 5%."
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {hasLowCoverage ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>
              Há grupos com cobertura inferior a 5%. Considere revisar a
              representatividade da amostra.
            </p>
          </div>
        ) : (
          <p className="rounded-lg border bg-muted/20 p-3 text-sm text-foreground">
            Nenhum grupo com cobertura crítica no resultado importado.
          </p>
        )}

        {enriched.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem grupos para avaliar a qualidade da amostra.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {enriched.map((entry) => (
              <Badge
                key={entry.key}
                variant={badgeVariant(entry.level)}
                title={entry.hint}
              >
                {entry.label}: {entry.coverage.toFixed(2)}%
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
