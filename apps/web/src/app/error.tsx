"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6 py-16">
            <div className="absolute inset-0 bg-mesh -z-10" />
            <Card className="max-w-lg w-full text-center p-10 md:p-12 shadow-xl animate-in-up">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto mb-6">
                    <AlertTriangle className="h-7 w-7 text-destructive" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-destructive mb-3">
                    Something went wrong
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    An unexpected error occurred
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
                    Our team has been notified. You can try again or head back
                    to the homepage.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button
                        size="lg"
                        onClick={() => reset()}
                        className="shadow-sm gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 shadow-xs"
                        >
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
                {error.digest && (
                    <p className="mt-6 text-xs text-muted-foreground font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </Card>
        </div>
    );
}
