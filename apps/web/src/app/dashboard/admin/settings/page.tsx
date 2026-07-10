import { Cpu, Mail, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const settings = [
    {
        icon: Shield,
        label: "Platform Name",
        value: "SkillForge AI",
        accent: "bg-primary/10 text-primary",
    },
    {
        icon: Mail,
        label: "Support Email",
        value: "support@skillforge.ai",
        accent: "bg-secondary/10 text-secondary",
    },
    {
        icon: Cpu,
        label: "AI Model",
        value: "gpt-4o-mini",
        accent: "bg-accent/10 text-accent",
    },
    {
        icon: Zap,
        label: "Rate Limit (AI)",
        value: "30 requests / 15 min",
        accent: "bg-primary/10 text-primary",
    },
];

export default function AdminSettingsPage() {
    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">Platform configuration</p>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {settings.map((item, i) => (
                        <div
                            key={item.label}
                            className={`flex items-center justify-between py-3.5 ${
                                i !== settings.length - 1
                                    ? "border-b border-border/70"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.accent}`}
                                >
                                    <item.icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {item.label}
                                </span>
                            </div>
                            <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                </span>
                <p className="text-sm text-secondary font-medium">
                    All systems operational
                </p>
            </div>
        </div>
    );
}
