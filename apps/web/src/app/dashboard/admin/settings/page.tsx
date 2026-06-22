import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Platform configuration</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between border-b pb-3">
            <span>Platform Name</span>
            <span className="font-medium">SkillForge AI</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>Support Email</span>
            <span className="font-medium">support@skillforge.ai</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>AI Model</span>
            <span className="font-medium">gpt-4o-mini</span>
          </div>
          <div className="flex justify-between">
            <span>Rate Limit (AI)</span>
            <span className="font-medium">30 requests / 15 min</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
