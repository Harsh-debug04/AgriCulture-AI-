import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Loading() {
    return (
        <main className="p-4 md:p-6">
            <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
                <CardHeader>
                    <CardTitle>Latest Agricultural News</CardTitle>
                    <CardDescription>Stay updated with the latest happenings in the agriculture sector.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="animate-pulse bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
