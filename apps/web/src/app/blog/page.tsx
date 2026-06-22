import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  {
    slug: "ai-tutor-learning",
    title: "How AI Tutors Are Transforming Online Education",
    excerpt: "Discover how context-aware AI assistants help learners grasp complex concepts faster than traditional methods.",
    date: "June 15, 2026",
    author: "Dr. Nina Patel",
  },
  {
    slug: "react-19-guide",
    title: "React 19: What Developers Need to Know",
    excerpt: "A practical overview of Server Components, Actions, and the new hooks that change how we build React apps.",
    date: "June 8, 2026",
    author: "Sarah Chen",
  },
  {
    slug: "cloud-career-2026",
    title: "Top Cloud Skills Employers Want in 2026",
    excerpt: "AWS, Kubernetes, and Terraform remain in high demand. Here's how to prioritize your learning path.",
    date: "May 28, 2026",
    author: "James Okonkwo",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-10">Insights on learning, technology, and career growth</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog#${post.slug}`}>
            <Card className="h-full hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{post.date} · {post.author}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
