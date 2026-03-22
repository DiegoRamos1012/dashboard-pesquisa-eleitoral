import { useMemo, useState } from "react";

import { getApiErrorMessage } from "@/api/client";
import type { PollImportResponse } from "@/api/contracts";
import { importPollCsv } from "@/api/services";
import { ActionFeedback } from "@/components/action-feedback";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PollImportSectionProps {
  onImported: (result: PollImportResponse) => void;
}

function isCsvFile(file: File | null): boolean {
  if (!file) {
    return false;
  }

  const byType =
    file.type === "text/csv" || file.type === "application/vnd.ms-excel";
  const byExtension = file.name.toLowerCase().endsWith(".csv");
  return byType || byExtension;
}

export function PollImportSection({ onImported }: PollImportSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => isCsvFile(file) && !isLoading,
    [file, isLoading],
  );

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage("Selecione um arquivo CSV para importar.");
      return;
    }

    if (!isCsvFile(file)) {
      setErrorMessage("Arquivo inválido. Envie um arquivo com extensão .csv.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await importPollCsv(file);
      onImported(result);
      setSuccessMessage(
        "Pesquisa importada com sucesso. Dashboard atualizado.",
      );
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
          title="Importação de Pesquisa"
          description="Envie um arquivo CSV no formato: poll_id, poll_date, estado, municipio, candidate_id, percentual."
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex flex-col gap-3 md:flex-row md:items-center"
          onSubmit={handleImport}
        >
          <Input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0] ?? null;
              setFile(selectedFile);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          />

          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? "Importando CSV..." : "Importar pesquisa CSV"}
          </Button>
        </form>

        {file ? (
          <p className="text-sm text-muted-foreground">
            Arquivo selecionado: {file.name}
          </p>
        ) : null}

        <ActionFeedback
          successMessage={successMessage ?? undefined}
          errorMessage={errorMessage ?? undefined}
        />
      </CardContent>
    </Card>
  );
}
