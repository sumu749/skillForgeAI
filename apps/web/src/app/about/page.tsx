export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About SkillForge AI</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          SkillForge AI is an online learning platform designed to help professionals and aspiring developers master in-demand technology skills. We combine expert-led courses with an AI-powered tutor that provides personalized guidance throughout your learning journey.
        </p>
        <p>
          Founded in 2024, our mission is to make high-quality tech education accessible to everyone. Our catalog spans web development, data science, cloud computing, cybersecurity, mobile development, AI, design, and core programming fundamentals.
        </p>
        <p>
          Every course is crafted by industry practitioners with real-world experience. Our AI tutor understands your learning context and adapts explanations to your level, making complex topics approachable and actionable.
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-8">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Practical, project-based learning over theory alone</li>
          <li>AI-enhanced personalization without replacing human expertise</li>
          <li>Accessible pricing and lifetime course access</li>
          <li>Continuous curriculum updates reflecting industry trends</li>
        </ul>
      </div>
    </div>
  );
}
