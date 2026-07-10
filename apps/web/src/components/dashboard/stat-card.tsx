import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatAccent = "primary" | "secondary" | "accent" | "destructive";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number | null | undefined;
    accent?: StatAccent;
}

const accentClasses: Record<StatAccent, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({
    icon: Icon,
    label,
    value,
    accent = "primary",
}: StatCardProps) {
    const isLoading = value === null || value === undefined || value === "";

    return (
        <Card interactive className="group">
            <CardContent className="p-6 flex items-center gap-4">
                <div
                    className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-smooth group-hover:scale-105",
                        accentClasses[accent],
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                        {label}
                    </p>
                    {isLoading ? (
                        <Skeleton className="h-7 w-16 mt-1.5" />
                    ) : (
                        <p className="text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
