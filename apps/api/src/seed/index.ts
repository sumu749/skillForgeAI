import { connectDatabase } from "../db/connection";
import { seedCourses, seedReviews } from "./courses";
import { seedCourses as persistCourses } from "../services/courseService";

async function seed() {
  await connectDatabase();
  await persistCourses(seedCourses, seedReviews);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
