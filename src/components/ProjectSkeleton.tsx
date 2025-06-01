import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectSkeleton = () => {
  return (
    <Card className="h-full glass-effect border-0 overflow-hidden">
      <div className="p-0">
        <Skeleton className="w-full h-48" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectSkeleton; 