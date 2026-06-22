import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    q: "How does the AI Tutor work?",
    a: "The AI Tutor uses OpenAI's language models with a custom system prompt tailored for SkillForge learning. It provides context-aware explanations, code help, and study guidance. Responses stream in real-time for a natural conversation experience.",
  },
  {
    q: "Do I need an account to browse courses?",
    a: "No — you can explore our full course catalog without signing in. Creating an account unlocks the dashboard, AI tutor, and enrollment features.",
  },
  {
    q: "Are certificates included?",
    a: "Yes, most courses include a certificate of completion. Check the course specs on each detail page to confirm.",
  },
  {
    q: "Can I access courses on mobile?",
    a: "SkillForge AI is fully responsive and works on phones, tablets, and desktops. Course videos and the AI chat are optimized for all screen sizes.",
  },
  {
    q: "How do I enable Google sign-in?",
    a: "Configure Google OAuth in your Clerk dashboard under Social Connections. Once enabled, the Google button appears on the sign-in page automatically.",
  },
];

export default function HelpPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-10">Find answers to common questions</p>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.q}>
            <CardHeader>
              <CardTitle className="text-base">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
