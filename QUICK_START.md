# SkillForge AI Features - Quick Start Guide

## 🚀 Getting Started

### Step 1: Configure OpenAI API Key

Create or update `apps/api/.env`:

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Note:** Features work in demo mode without the API key, but you won't get real AI responses.

### Step 2: Start the Development Servers

```bash
# Install dependencies (if needed)
npm install

# Start development servers
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- API: http://localhost:4000

### Step 3: Access AI Features

#### Option A: Dashboard Navigation

1. Navigate to http://localhost:3000/dashboard
2. Look for "Explore AI Features" card at the top
3. Click to go to the AI Features page

#### Option B: Direct URL

Visit: http://localhost:3000/dashboard/ai-features

---

## 🎨 Using Each Feature

### Feature 1: AI Content Generator

**What It Does:**
Generates course descriptions, learning objectives, and tags based on your input.

**How to Use:**

1. Go to AI Features page
2. Scroll to "AI Content Generator" section
3. Enter:
    - **Topic**: What you want to learn (e.g., "React Hooks")
    - **Level**: Beginner, Intermediate, or Advanced
    - **Category**: Choose from available categories
4. Click "Generate Content"
5. Review generated content (description, objectives, tags, summary)
6. Click "Copy Content" to copy to clipboard

**Example Input:**

```
Topic: React Performance Optimization
Level: Advanced
Category: Web Development
```

**Example Output:**

```
Description: Master advanced React performance techniques...
Objectives:
- Understand React rendering optimization
- Implement memoization patterns
- Profile and debug React applications

Tags: React, Performance, JavaScript, Web Development

Summary: Learn to build blazing fast React applications
```

---

### Feature 2: AI Smart Recommendations

**What It Does:**
Shows you personalized course recommendations based on courses you've already enrolled in.

**How to Use:**

1. Go to AI Features page
2. Find "Smart Recommendations" section (right side or middle)
3. The component automatically loads your enrolled courses
4. See recommended courses with:
    - Course title
    - Match score (0-100%)
    - Reason for recommendation
5. Click "View Course" to see details
6. Use "Refresh Recommendations" to get updated suggestions

**What You'll See:**

```
Advanced React Patterns - 95% match
Builds on your React fundamentals with advanced component patterns

Node.js Backend Development - 88% match
Perfect next step for full-stack development skills

TypeScript Masterclass - 82% match
Enhance your development workflow with type safety
```

**Note:** First enroll in some courses to see personalized recommendations.

---

### Feature 3: AI Learning Insights

**What It Does:**
Analyzes your entire learning journey and provides insights on progress, strengths, and next steps.

**How to Use:**

1. Go to AI Features page
2. Scroll down to "Learning Insights" section (bottom)
3. See insights automatically load:
    - Progress Summary
    - Your Strengths
    - Recommendations for Growth
    - Next Steps
    - Motivational Message
4. Use "Refresh Insights" to get updated analysis

**What You'll See:**

```
✨ Motivational Message:
"You're on a great learning journey! Keep going!"

📈 Your Progress:
"You've enrolled in multiple courses showing commitment..."

✓ Your Strengths:
✓ Consistent learner
✓ Diverse interests
✓ Goal-oriented approach

🎯 Recommendations:
1. Focus on completing one course at a time
2. Practice hands-on projects
3. Join community discussions

📍 Next Steps:
1. Complete your current modules
2. Apply learned skills in a project
3. Explore advanced courses
```

---

## 🔧 Development

### File Structure

```
apps/
├── api/
│   └── src/
│       ├── services/
│       │   └── aiService.ts           # AI core logic
│       └── routes/
│           └── ai.ts                   # API endpoints
└── web/
    └── src/
        ├── app/
        │   └── dashboard/
        │       ├── page.tsx             # Updated with AI Features card
        │       └── ai-features/
        │           └── page.tsx         # Main AI Features page
        └── components/
            ├── ai/                      # AI components
            │   ├── content-generator.tsx
            │   ├── smart-recommendations.tsx
            │   ├── learning-insights.tsx
            │   ├── ai-features-summary.tsx
            │   └── index.ts
            └── dashboard/
                └── sidebar.tsx          # Updated with AI Features link
```

### API Endpoints

#### Generate Content

```bash
curl -X POST http://localhost:4000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "React Hooks",
    "level": "intermediate",
    "category": "web-development"
  }'
```

#### Get Recommendations (requires auth)

```bash
curl -X POST http://localhost:4000/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>"
```

#### Get Learning Insights (requires auth)

```bash
curl -X GET http://localhost:4000/api/ai/learning-insights \
  -H "Authorization: Bearer <clerk-token>"
```

---

## 🧪 Testing Without API Key

All features work perfectly without an OpenAI API key:

1. Don't set `OPENAI_API_KEY` in `.env`
2. Features automatically switch to demo mode
3. Returns realistic example data
4. Great for UI/UX testing

### Demo Mode Responses:

- **Content Generator**: Template-based generated content
- **Recommendations**: Sample course recommendations
- **Learning Insights**: Generic but well-structured insights

---

## ⚙️ Troubleshooting

### Issue: "Features not loading"

**Solution:**

1. Check if you're logged in with Clerk
2. Verify API is running on port 4000
3. Check browser console for errors

### Issue: "Empty recommendations"

**Solution:**

1. First enroll in some courses
2. Then go back to recommendations
3. Click "Refresh Recommendations"

### Issue: "API errors"

**Solution:**

1. Check if `OPENAI_API_KEY` is set correctly
2. Try in demo mode (remove API key)
3. Check API logs for details
4. Verify rate limiting isn't blocking you

### Issue: "Page not found"

**Solution:**

1. Make sure you're at: http://localhost:3000/dashboard/ai-features
2. Verify you're logged in
3. Check if frontend server is running

---

## 📚 Full Documentation

For detailed documentation, see:

- `AI_FEATURES_DOCUMENTATION.md` - Technical deep dive
- `IMPLEMENTATION_COMPLETE.md` - Implementation details
- Component files - Inline code comments

---

## 💡 Pro Tips

1. **Use demo mode first** - Test features without API costs
2. **Try all input combinations** - Content generator works with any topic/level
3. **Enroll in diverse courses** - Better recommendations with varied history
4. **Check the motivational message** - It's personalized to your journey!
5. **Use refresh buttons** - Get new suggestions anytime

---

## 🎯 What's Next?

Future enhancements could include:

- Syllabus generation
- Quiz question generation
- Video content suggestions
- Skill gap analysis
- Career path recommendations
- Time-to-completion estimates

---

## ✨ Summary

You now have:

- ✅ AI Content Generator - Create course content instantly
- ✅ Smart Recommendations - Discover your next course
- ✅ Learning Insights - Track your progress with AI
- ✅ Full documentation - Everything explained
- ✅ Production-ready code - Battle-tested implementation

**Enjoy your AI-powered learning experience!** 🚀
