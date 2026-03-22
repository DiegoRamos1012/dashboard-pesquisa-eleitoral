import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ActionFeedbackProps {
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function ActionFeedback({
  successTitle,
  successMessage,
  errorMessage,
}: ActionFeedbackProps) {
  return (
    <div className="space-y-2">
      {successMessage ? (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{successTitle ?? "Operação concluída"}</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
