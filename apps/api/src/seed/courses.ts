import type { Course, Review } from "@skillforge/shared";
import { v4 as uuidv4 } from "uuid";

const imgs = [
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1512941937664-90a1b58da7e9?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1618401471358-2f2112a046fd?w=800&h=450&fit=crop",
];
let imgIndex = 0;
const img = () => imgs[imgIndex++ % imgs.length];

export const seedCourses: Course[] = [
    {
        id: uuidv4(),
        title: "Complete React & Next.js Masterclass",
        slug: "react-nextjs-masterclass",
        description:
            "Build production-ready React apps with Next.js App Router, Server Components, and modern patterns.",
        longDescription:
            "Master React 19 and Next.js 15 from fundamentals to deployment. Learn Server Components, data fetching, authentication patterns, and performance optimization. Build three portfolio projects including a full-stack SaaS dashboard.",
        category: "web-development",
        level: "intermediate",
        price: 89.99,
        rating: 4.8,
        reviewCount: 342,
        durationHours: 42,
        instructor: "Sarah Chen",
        instructorBio:
            "Senior Frontend Engineer at Vercel with 10+ years building scalable web applications.",
        imageUrl: img(),
        tags: ["React", "Next.js", "TypeScript", "Tailwind"],
        modules: [
            { title: "React Fundamentals", lessons: 12 },
            { title: "Next.js App Router", lessons: 15 },
            { title: "Data Fetching & Caching", lessons: 10 },
            { title: "Deployment & Performance", lessons: 8 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 3,
        },
        featured: true,
    },
    {
        id: uuidv4(),
        title: "Python for Data Science & Machine Learning",
        slug: "python-data-science-ml",
        description:
            "Learn Python, pandas, NumPy, scikit-learn, and build real ML models from scratch.",
        longDescription:
            "A comprehensive journey through data science with Python. Cover data wrangling, visualization with Matplotlib and Seaborn, statistical analysis, and machine learning algorithms. Includes Kaggle-style projects and a capstone predictive modeling assignment.",
        category: "data-science",
        level: "beginner",
        price: 79.99,
        rating: 4.7,
        reviewCount: 518,
        durationHours: 38,
        instructor: "Dr. Marcus Webb",
        instructorBio:
            "PhD in Statistics, former Google ML engineer, published researcher in predictive analytics.",
        imageUrl: img(),
        tags: ["Python", "pandas", "Machine Learning", "Statistics"],
        modules: [
            { title: "Python Essentials", lessons: 10 },
            { title: "Data Analysis with pandas", lessons: 14 },
            { title: "Visualization", lessons: 8 },
            { title: "Machine Learning Basics", lessons: 16 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 5,
        },
        featured: true,
    },
    {
        id: uuidv4(),
        title: "AWS Cloud Practitioner to Solutions Architect",
        slug: "aws-cloud-architect",
        description:
            "Prepare for AWS certifications while building real cloud infrastructure with EC2, S3, Lambda, and more.",
        longDescription:
            "Go from cloud beginner to confident AWS practitioner. Learn core services, IAM, VPC networking, serverless architecture, and cost optimization. Hands-on labs deploy production-style infrastructure using CloudFormation and the AWS CLI.",
        category: "cloud-devops",
        level: "intermediate",
        price: 94.99,
        rating: 4.9,
        reviewCount: 276,
        durationHours: 35,
        instructor: "James Okonkwo",
        instructorBio:
            "AWS Certified Solutions Architect Professional, 8 years designing enterprise cloud systems.",
        imageUrl: img(),
        tags: ["AWS", "Cloud", "DevOps", "Serverless"],
        modules: [
            { title: "Cloud Foundations", lessons: 8 },
            { title: "Compute & Storage", lessons: 12 },
            { title: "Networking & Security", lessons: 10 },
            { title: "Serverless & Automation", lessons: 9 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 4,
        },
        featured: true,
    },
    {
        id: uuidv4(),
        title: "Ethical Hacking & Penetration Testing",
        slug: "ethical-hacking-pentest",
        description:
            "Learn offensive security techniques, vulnerability assessment, and defensive countermeasures.",
        longDescription:
            "Understand how attackers think and operate. Practice reconnaissance, exploitation, post-exploitation, and reporting in controlled lab environments. Covers OWASP Top 10, network scanning, web app pentesting, and security hardening best practices.",
        category: "cybersecurity",
        level: "advanced",
        price: 99.99,
        rating: 4.6,
        reviewCount: 189,
        durationHours: 40,
        instructor: "Elena Vasquez",
        instructorBio:
            "Certified Ethical Hacker (CEH), OSCP holder, security consultant for Fortune 500 companies.",
        imageUrl: img(),
        tags: ["Security", "Penetration Testing", "OWASP", "Linux"],
        modules: [
            { title: "Security Fundamentals", lessons: 9 },
            { title: "Network Attacks", lessons: 11 },
            { title: "Web Application Security", lessons: 14 },
            { title: "Reporting & Defense", lessons: 7 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 6,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "Flutter Mobile App Development",
        slug: "flutter-mobile-development",
        description:
            "Build beautiful cross-platform iOS and Android apps with Flutter and Dart.",
        longDescription:
            "Create polished mobile applications with Flutter's widget system, state management (Riverpod), Firebase integration, and platform-specific features. Build a social media app, e-commerce app, and fitness tracker as portfolio pieces.",
        category: "mobile-development",
        level: "intermediate",
        price: 74.99,
        rating: 4.5,
        reviewCount: 203,
        durationHours: 32,
        instructor: "Aisha Rahman",
        instructorBio:
            "Mobile developer with apps reaching 2M+ downloads on App Store and Google Play.",
        imageUrl: img(),
        tags: ["Flutter", "Dart", "Mobile", "Firebase"],
        modules: [
            { title: "Dart & Flutter Basics", lessons: 10 },
            { title: "UI & Animations", lessons: 12 },
            { title: "State Management", lessons: 8 },
            { title: "Backend Integration", lessons: 9 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 3,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "Deep Learning with TensorFlow & PyTorch",
        slug: "deep-learning-tensorflow-pytorch",
        description:
            "Neural networks, CNNs, RNNs, transformers, and deploy ML models to production.",
        longDescription:
            "Dive deep into modern deep learning. Implement architectures from scratch and with frameworks. Cover computer vision, NLP, transfer learning, and model deployment with TensorFlow Serving and ONNX. GPU-accelerated labs included.",
        category: "ai-machine-learning",
        level: "advanced",
        price: 109.99,
        rating: 4.8,
        reviewCount: 156,
        durationHours: 45,
        instructor: "Dr. Yuki Tanaka",
        instructorBio:
            "AI researcher at MIT, contributor to open-source ML libraries, Kaggle Grandmaster.",
        imageUrl: img(),
        tags: ["Deep Learning", "TensorFlow", "PyTorch", "NLP"],
        modules: [
            { title: "Neural Network Foundations", lessons: 11 },
            { title: "Computer Vision", lessons: 14 },
            { title: "NLP & Transformers", lessons: 13 },
            { title: "Model Deployment", lessons: 8 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 4,
        },
        featured: true,
    },
    {
        id: uuidv4(),
        title: "UI/UX Design for Developers",
        slug: "ui-ux-design-developers",
        description:
            "Learn Figma, design systems, accessibility, and user research to create delightful interfaces.",
        longDescription:
            "Bridge the gap between design and development. Master Figma workflows, create design tokens, build component libraries, conduct usability testing, and implement accessible WCAG-compliant interfaces. Perfect for developers who want design skills.",
        category: "design",
        level: "beginner",
        price: 59.99,
        rating: 4.7,
        reviewCount: 421,
        durationHours: 24,
        instructor: "Mia Laurent",
        instructorBio:
            "Lead Product Designer at Stripe, speaker at Config and Design+Research conferences.",
        imageUrl: img(),
        tags: ["Figma", "UI/UX", "Accessibility", "Design Systems"],
        modules: [
            { title: "Design Principles", lessons: 8 },
            { title: "Figma Mastery", lessons: 10 },
            { title: "User Research", lessons: 7 },
            { title: "Design Systems", lessons: 9 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 2,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "Node.js & Express Backend Development",
        slug: "nodejs-express-backend",
        description:
            "Build scalable REST APIs with Node.js, Express, MongoDB, authentication, and testing.",
        longDescription:
            "Create production-grade backend services. Learn Express middleware patterns, MongoDB with Mongoose, JWT authentication, input validation, error handling, API documentation with Swagger, and deployment with Docker. Includes a full e-commerce API project.",
        category: "programming",
        level: "intermediate",
        price: 69.99,
        rating: 4.6,
        reviewCount: 387,
        durationHours: 30,
        instructor: "David Park",
        instructorBio:
            "Backend architect with 12 years experience building APIs serving millions of requests daily.",
        imageUrl: img(),
        tags: ["Node.js", "Express", "MongoDB", "REST API"],
        modules: [
            { title: "Node.js Fundamentals", lessons: 9 },
            { title: "Express & Middleware", lessons: 11 },
            { title: "Database Integration", lessons: 10 },
            { title: "Auth & Deployment", lessons: 8 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 2,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "Docker & Kubernetes DevOps Bootcamp",
        slug: "docker-kubernetes-devops",
        description:
            "Containerize applications and orchestrate with Kubernetes in production environments.",
        longDescription:
            "Master containerization from Dockerfile to Helm charts. Learn Docker Compose, Kubernetes pods, services, ingress, CI/CD pipelines with GitHub Actions, monitoring with Prometheus, and GitOps workflows. Deploy a microservices application cluster.",
        category: "cloud-devops",
        level: "advanced",
        price: 89.99,
        rating: 4.7,
        reviewCount: 234,
        durationHours: 36,
        instructor: "Carlos Mendez",
        instructorBio:
            "DevOps lead at a fintech startup, CKA and CKAD certified, open-source contributor.",
        imageUrl: img(),
        tags: ["Docker", "Kubernetes", "CI/CD", "DevOps"],
        modules: [
            { title: "Docker Essentials", lessons: 10 },
            { title: "Kubernetes Core", lessons: 14 },
            { title: "CI/CD Pipelines", lessons: 8 },
            { title: "Monitoring & GitOps", lessons: 9 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 3,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "SQL & Database Design Mastery",
        slug: "sql-database-design",
        description:
            "Master SQL queries, database normalization, indexing, and PostgreSQL administration.",
        longDescription:
            "Become proficient in relational database design and SQL. Write complex queries with joins, subqueries, window functions, and CTEs. Learn normalization, indexing strategies, query optimization, and PostgreSQL-specific features including JSONB and full-text search.",
        category: "programming",
        level: "beginner",
        price: 49.99,
        rating: 4.8,
        reviewCount: 612,
        durationHours: 22,
        instructor: "Rachel Kim",
        instructorBio:
            "Database administrator with 15 years managing PostgreSQL clusters for enterprise clients.",
        imageUrl: img(),
        tags: ["SQL", "PostgreSQL", "Database Design", "Indexing"],
        modules: [
            { title: "SQL Basics", lessons: 10 },
            { title: "Advanced Queries", lessons: 12 },
            { title: "Database Design", lessons: 8 },
            { title: "Performance Tuning", lessons: 6 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 2,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "TypeScript Full-Stack Development",
        slug: "typescript-fullstack",
        description:
            "End-to-end TypeScript development with strict typing, generics, and monorepo patterns.",
        longDescription:
            "Level up your JavaScript with TypeScript across the full stack. Master advanced types, generics, utility types, decorators, and monorepo tooling with Turborepo. Build a typed API client, shared packages, and a full-stack application with end-to-end type safety.",
        category: "web-development",
        level: "intermediate",
        price: 64.99,
        rating: 4.7,
        reviewCount: 298,
        durationHours: 28,
        instructor: "Alex Turner",
        instructorBio:
            "TypeScript core contributor, author of 'Type-Safe Web Apps' published by O'Reilly.",
        imageUrl: img(),
        tags: ["TypeScript", "Monorepo", "Full-Stack", "Zod"],
        modules: [
            { title: "TypeScript Deep Dive", lessons: 11 },
            { title: "Advanced Patterns", lessons: 9 },
            { title: "Full-Stack Integration", lessons: 10 },
            { title: "Monorepo Architecture", lessons: 7 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 2,
        },
        featured: false,
    },
    {
        id: uuidv4(),
        title: "Generative AI & Prompt Engineering",
        slug: "generative-ai-prompt-engineering",
        description:
            "Build AI-powered apps with OpenAI, LangChain, RAG pipelines, and effective prompt design.",
        longDescription:
            "Harness the power of large language models in your applications. Learn prompt engineering techniques, build RAG systems with vector databases, create AI agents with tool use, and implement streaming chat interfaces. Includes ethics and safety considerations.",
        category: "ai-machine-learning",
        level: "intermediate",
        price: 84.99,
        rating: 4.9,
        reviewCount: 445,
        durationHours: 26,
        instructor: "Dr. Nina Patel",
        instructorBio:
            "AI product lead, former OpenAI researcher, creator of popular prompt engineering courses.",
        imageUrl: img(),
        tags: ["OpenAI", "LangChain", "RAG", "Prompt Engineering"],
        modules: [
            { title: "LLM Fundamentals", lessons: 8 },
            { title: "Prompt Engineering", lessons: 10 },
            { title: "RAG & Vector DBs", lessons: 9 },
            { title: "AI App Development", lessons: 8 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 3,
        },
        featured: true,
    },
    {
        id: uuidv4(),
        title: "Git & GitHub for Professional Teams",
        slug: "git-github-professional",
        description:
            "Master version control workflows, branching strategies, code review, and CI integration.",
        longDescription:
            "Essential Git skills for professional development teams. Learn branching models (Git Flow, trunk-based), rebasing vs merging, resolving conflicts, pull request workflows, GitHub Actions basics, and maintaining clean commit history. Perfect for bootcamp graduates entering the workforce.",
        category: "programming",
        level: "beginner",
        price: 39.99,
        rating: 4.6,
        reviewCount: 789,
        durationHours: 12,
        instructor: "Tom Bradley",
        instructorBio:
            "Engineering manager at GitHub, 20 years in software development and team leadership.",
        imageUrl: img(),
        tags: ["Git", "GitHub", "Version Control", "CI/CD"],
        modules: [
            { title: "Git Basics", lessons: 8 },
            { title: "Branching & Merging", lessons: 7 },
            { title: "Team Workflows", lessons: 6 },
            { title: "GitHub & CI", lessons: 5 },
        ],
        specs: {
            language: "English",
            certificate: true,
            lifetimeAccess: true,
            projects: 1,
        },
        featured: false,
    },
];

export const seedReviews: Review[] = [
    {
        id: uuidv4(),
        courseId: seedCourses[0].id,
        userId: "user_1",
        userName: "Jordan Lee",
        rating: 5,
        comment:
            "Best React course I've taken. The Next.js App Router section alone was worth the price. Built my portfolio site using techniques from module 3.",
        createdAt: "2025-11-15T10:00:00.000Z",
    },
    {
        id: uuidv4(),
        courseId: seedCourses[0].id,
        userId: "user_2",
        userName: "Priya Sharma",
        rating: 5,
        comment:
            "Sarah explains complex concepts clearly. The Server Components chapter finally made everything click for me.",
        createdAt: "2025-12-02T14:30:00.000Z",
    },
    {
        id: uuidv4(),
        courseId: seedCourses[1].id,
        userId: "user_3",
        userName: "Michael Torres",
        rating: 4,
        comment:
            "Solid introduction to data science. The pandas section is comprehensive. Would love more advanced ML topics.",
        createdAt: "2025-10-20T09:15:00.000Z",
    },
    {
        id: uuidv4(),
        courseId: seedCourses[2].id,
        userId: "user_4",
        userName: "Emily Watson",
        rating: 5,
        comment:
            "Passed my AWS Solutions Architect exam on the first try thanks to this course. Labs are excellent.",
        createdAt: "2025-11-28T16:45:00.000Z",
    },
    {
        id: uuidv4(),
        courseId: seedCourses[11].id,
        userId: "user_5",
        userName: "Chris Anderson",
        rating: 5,
        comment:
            "The RAG pipeline project is fantastic. I deployed a chatbot for my company using exactly what I learned here.",
        createdAt: "2026-01-10T11:20:00.000Z",
    },
    {
        id: uuidv4(),
        courseId: seedCourses[11].id,
        userId: "user_6",
        userName: "Sofia Martinez",
        rating: 5,
        comment:
            "Dr. Patel's prompt engineering techniques improved my AI app responses dramatically. Highly recommended.",
        createdAt: "2026-02-05T08:00:00.000Z",
    },
];
