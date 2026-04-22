import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { WorkerSummary } from "@/types";

type DisplayWorkersProps = {
  workers?: WorkerSummary[];
};

const DisplayWorkers = ({ workers }: DisplayWorkersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Current workers</CardTitle>
      </CardHeader>
      <CardContent>
        {workers?.length ? (
          <div className="flex flex-wrap gap-2">
            {workers.map((worker) => (
              <span
                key={worker.worker_id}
                className="rounded-md border px-2 py-1 text-sm"
              >
                {worker.full_name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No workers currently assigned.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DisplayWorkers;
