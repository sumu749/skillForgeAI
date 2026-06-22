import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/explore", label: "Explore Courses" },
    { href: "/dashboard/chat", label: "AI Tutor" },
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Help Center" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              SkillForge AI
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered learning platform helping you master in-demand tech skills with expert courses and an intelligent tutor.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-sm text-muted-foreground">
              support@skillforge.ai
              <br />
              San Francisco, CA
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SkillForge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
