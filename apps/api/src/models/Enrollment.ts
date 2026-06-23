import { Schema, model, models } from "mongoose";

export type EnrollmentDocument = {
    id: string;
    courseId: string;
    userId: string;
    enrolledAt: Date;
};

const enrollmentSchema = new Schema<EnrollmentDocument>(
    {
        courseId: { type: String, required: true },
        userId: { type: String, required: true },
        enrolledAt: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true },
);

enrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export const EnrollmentModel =
    models.Enrollment ||
    model<EnrollmentDocument>("Enrollment", enrollmentSchema);
