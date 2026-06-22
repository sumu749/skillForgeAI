import { Schema, model, models } from "mongoose";
import type { Course } from "@skillforge/shared";

const moduleSchema = new Schema(
  {
    title: { type: String, required: true },
    lessons: { type: Number, required: true },
  },
  { _id: false }
);

const courseSchema = new Schema<Course>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    durationHours: { type: Number, required: true },
    instructor: { type: String, required: true },
    instructorBio: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    modules: [moduleSchema],
    specs: {
      language: String,
      certificate: Boolean,
      lifetimeAccess: Boolean,
      projects: Number,
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CourseModel = models.Course || model("Course", courseSchema);
