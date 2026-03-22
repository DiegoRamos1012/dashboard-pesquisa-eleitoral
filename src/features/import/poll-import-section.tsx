import { useMemo, useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud } from "lucide-react";

import { getApiErrorMessage } from "@/api/client";
import type { PollImportResponse } from "@/api/contracts";
import { importPollCsv } from "@/api/services";
import { ActionFeedback } from "@/components/action-feedback";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
    setErrorMessage(null);
    setSuccessMessage(null);
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
        <form className="space-y-3" onSubmit={handleImport}>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              handleFileSelected(event.target.files?.[0] ?? null);
            }}
          />

          <div
            className={[
              "rounded-xl border border-dashed p-4 transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20",
            ].join(" ")}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => {
              setIsDragActive(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragActive(false);
              const dropped = event.dataTransfer.files?.[0] ?? null;
              handleFileSelected(dropped);
            }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-border bg-background p-2">
                  <UploadCloud className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Arraste o CSV aqui ou selecione manualmente
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: .csv
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                Escolher arquivo
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>
                {file ? `Arquivo selecionado: ${file.name}` : "Nenhum arquivo selecionado"}
              </span>
            </div>

            <Button type="submit" disabled={!canSubmit}>
              {isLoading ? "Importando CSV..." : "Importar pesquisa CSV"}
            </Button>
          </div>
        </form>

        <ActionFeedback
          successMessage={successMessage ?? undefined}
          errorMessage={errorMessage ?? undefined}
        />
      </CardContent>
    </Card>
  );
}
