import type { PollImportResponse } from "@/api/contracts";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatInteger, formatIsoDate } from "@/lib/format";

import { getPollIdentifierLabel } from "./display-labels";

interface PollSummaryProps {
  data: PollImportResponse;
}

export function PollSummary({ data }: PollSummaryProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <SectionHeader
          title="Resumo da Pesquisa"
          description="Dados consolidados da importação realizada."
        />
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            Identificador: {getPollIdentifierLabel(data.pollId)}
          </Badge>
          <Badge variant="outline">Data: {formatIsoDate(data.pollDate)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              População ponderada
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {formatInteger(data.weightedPopulation)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total de candidatos
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {data.candidates.length}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Grupos retornados
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {data.groupBreakdown.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
