import { useState } from "react";
import { Loader2 } from "lucide-react";

import { getApiErrorMessage } from "@/api/client";
import type { IbgeSyncResponse } from "@/api/contracts";
import { syncIbge } from "@/api/services";
import { ActionFeedback } from "@/components/action-feedback";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatInteger } from "@/lib/format";

interface SyncSectionProps {
  onSynced: (result: IbgeSyncResponse) => void;
}

export function SyncSection({ onSynced }: SyncSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<IbgeSyncResponse | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await syncIbge(true);
      setLastResult(result);
      onSynced(result);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          title="Atualização da Base IBGE"
          description="Sincroniza estados e municípios antes da importação da pesquisa."
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSync} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Atualizando base...
              </>
            ) : (
              "Atualizar base IBGE"
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando atualização da base IBGE. Isso pode levar alguns
            instantes.
          </div>
        ) : null}

        {lastResult ? (
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm md:grid-cols-2">
            <p>
              Estados criados:{" "}
              <strong>{formatInteger(lastResult.statesCreated)}</strong>
            </p>
            <p>
              Estados atualizados:{" "}
              <strong>{formatInteger(lastResult.statesUpdated)}</strong>
            </p>
            <p>
              Municípios criados:{" "}
              <strong>{formatInteger(lastResult.municipalitiesCreated)}</strong>
            </p>
            <p>
              Forçado: <strong>{lastResult.forced ? "sim" : "não"}</strong>
            </p>
          </div>
        ) : null}

        <ActionFeedback
          successTitle="Base IBGE atualizada"
          successMessage={
            lastResult
              ? "A sincronização foi concluída com sucesso."
              : undefined
          }
          errorMessage={errorMessage ?? undefined}
        />
      </CardContent>
    </Card>
  );
}
