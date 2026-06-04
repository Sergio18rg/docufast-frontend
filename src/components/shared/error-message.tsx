import { Alert, AlertDescription } from "@/components/ui/alert";

type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className="mt-3 border-red-200 bg-red-50 text-red-700"
    >
      <AlertDescription className="text-red-700">{message}</AlertDescription>
    </Alert>
  );
};
