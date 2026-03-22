import { lazy, Suspense, useState } from "react";

import type { IbgeSyncResponse, PollImportResponse } from "@/api/contracts";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { PollImportSection } from "@/features/import/poll-import-section";
import { SyncSection } from "@/features/sync/sync-section";
import { Separator } from "@/components/ui/separator";

const DashboardView = lazy(() =>
  import("@/features/dashboard/dashboard-view").then((module) => ({
    default: module.DashboardView,
  })),
);

function App() {
  const [lastSyncResult, setLastSyncResult] = useState<IbgeSyncResponse | null>(
    null,
  );
  const [pollData, setPollData] = useState<PollImportResponse | null>(null);

  return (
    <div className="min-h-screen bg-page grid-soft">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 md:px-8 md:py-10">
        <header className="panel-shell fade-rise rounded-2xl bg-card/85 p-6 backdrop-blur-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Pesquisa Eleitoral
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Dashboard de importação e análise de pesquisas
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            Atualize a base IBGE, importe o CSV e visualize ranking consolidado,
            cobertura amostral e detalhamento por grupo.
          </p>

          {lastSyncResult ? (
            <div className="mt-4 inline-flex items-center rounded-full border border-border bg-background/90 px-3 py-1 text-xs text-muted-foreground shadow-[0_8px_20px_-16px_rgba(0,0,0,0.5)]">
              Última sincronização: {lastSyncResult.statesCreated} estados
              criados e {lastSyncResult.municipalitiesCreated} municípios
              criados.
            </div>
          ) : null}
        </header>

        <div className="fade-rise">
          <SyncSection onSynced={setLastSyncResult} />
        </div>
        <div className="fade-rise">
          <PollImportSection onImported={setPollData} />
        </div>

        <Separator />

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardView pollData={pollData} />
        </Suspense>

        <footer className="panel-shell mt-2 rounded-xl text-center bg-card/85 p-4 text-xs leading-relaxed text-muted-foreground">
          Este site faz parte de um teste de projeto para processo seletivo da
          empresa Konatus, desenvolvido por Diego Ramos dos Santos. GitHub:{" "}
          <a
            href="https://github.com/DiegoRamos1012"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Diego1012
          </a>{" "}
          | Projeto:{" "}
          <a
            href="https://github.com/DiegoRamos1012/dashboard-pesquisa-eleitoral"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            dashboard-pesquisa-eleitoral
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
