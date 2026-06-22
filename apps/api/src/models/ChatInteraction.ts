import { Schema, model, models } from "mongoose";

const chatMessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const chatInteractionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String },
    conversationId: { type: String, required: true, index: true },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

export const ChatInteractionModel =
  models.ChatInteraction || model("ChatInteraction", chatInteractionSchema);
