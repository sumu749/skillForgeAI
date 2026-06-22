export * from "./schemas/course";
export * from "./schemas/chat";
export * from "./schemas/review";

export const CATEGORY_LABELS: Record<string, string> = {
  "web-development": "Web Development",
  "data-science": "Data Science",
  "cloud-devops": "Cloud & DevOps",
  cybersecurity: "Cybersecurity",
  "mobile-development": "Mobile Development",
  "ai-machine-learning": "AI & Machine Learning",
  design: "Design",
  programming: "Programming",
};

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
