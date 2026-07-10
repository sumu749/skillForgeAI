import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateCardProps {
    title: string;
    description: string;
    actionLabel: string;
    href: string;
    className?: string;
}

export function EmptyStateCard({
    title,
    description,
    actionLabel,
    href,
    className,
}: EmptyStateCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-background/80 p-8 text-center",
                className,
            )}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
                <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-2">
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                    {description}
                </p>
            </div>
            <Link href={href} className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto">
                    {actionLabel}
                </Button>
            </Link>
        </div>
    );
}
