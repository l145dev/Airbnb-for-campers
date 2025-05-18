import { Skeleton } from "../ui/skeleton";

const SkeletonComponent = () => {
    return (
        <>
            <div className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-4 w-[30px]" />
                    </div>
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[160px]" />
                </div>
            </div>
        </>
    )
}

export default SkeletonComponent;