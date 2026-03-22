import { lazy, Suspense } from "react";

import type { PollImportResponse } from "@/api/contracts";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PollSummary = lazy(() =>
  import("./poll-summary").then((module) => ({ default: module.PollSummary })),
);
const GeneralRanking = lazy(() =>
  import("./general-ranking").then((module) => ({
    default: module.GeneralRanking,
  })),
);
const StateIntentions = lazy(() =>
  import("./state-intentions").then((module) => ({
    default: module.StateIntentions,
  })),
);
const GroupBreakdown = lazy(() =>
  import("./group-breakdown").then((module) => ({
    default: module.GroupBreakdown,
  })),
);
const SampleQuality = lazy(() =>
  import("./sample-quality").then((module) => ({
    default: module.SampleQuality,
  })),
);

interface DashboardViewProps {
  pollData: PollImportResponse | null;
}

export function DashboardView({ pollData }: DashboardViewProps) {
  if (!pollData) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Dashboard de Resultados
          </h2>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
            Importe um arquivo CSV para visualizar o resumo, ranking geral e
            detalhamento por grupo.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        <PollSummary data={pollData} />
        <GeneralRanking
          candidates={pollData.candidates}
          groups={pollData.groupBreakdown}
        />
        <StateIntentions groups={pollData.groupBreakdown} />
        <GroupBreakdown groups={pollData.groupBreakdown} />
        <SampleQuality groups={pollData.groupBreakdown} />
      </div>
    </Suspense>
  );
}
