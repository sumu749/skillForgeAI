import Link from "next/link";
import { Compass, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6 py-16">
            <div className="absolute inset-0 bg-mesh -z-10" />
            <Card className="max-w-lg w-full text-center p-10 md:p-12 shadow-xl animate-in-up">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
                    <Compass className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                    Error 404
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    Lost your place?
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or may
                    have been moved. Let&apos;s get you back on track.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/">
                        <Button size="lg" className="shadow-glow gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/explore">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="gap-2 shadow-sm"
                        >
                            <Sparkles className="h-4 w-4" />
                            Explore Courses
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
