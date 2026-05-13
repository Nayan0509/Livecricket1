const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// Cache for generated articles (TTL: 24 hours)
const articleCache = new NodeCache({ stdTTL: 86400 });

/**
 * Generates an original SEO-optimized article based on a brief headline/description
 */
async function generateArticle(title, description, source) {
  const cacheKey = `article:${title}`;
  const cached = articleCache.get(cacheKey);
  if (cached) return cached;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy_key") {
    return {
      title,
      content: `${description}\n\n[Note: This is a placeholder. Please set GEMINI_API_KEY in your server/.env file to automatically generate 500-word original articles from this news snippet.]`,
      tags: ["Cricket", "News"],
      isGenerated: false
    };
  }

  try {
    // We use gemini-1.5-flash as it's the fastest and extremely cheap/free tier
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an expert cricket journalist writing for a premium sports website. 
    Write a 300-500 word original, engaging, and SEO-optimized news article based on the following information. 
    DO NOT mention that you are an AI. DO NOT simply repeat the prompt. Add professional commentary, context, and insight.
    Format the article in clean HTML paragraphs (<p>). Do not use Markdown backticks or markdown headers, just pure HTML tags for formatting.
    Make it look like a highly professional editorial piece.

    Original Headline: ${title}
    Original Context: ${description}
    Source Context: ${source}

    Return JSON strictly in this format (no markdown code blocks, just raw JSON):
    {
      "title": "A slightly more engaging version of the original headline",
      "content": "<p>Paragraph 1...</p><p>Paragraph 2...</p>...",
      "tags": ["tag1", "tag2", "tag3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up potential markdown code blocks
    let cleanedJson = responseText;
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const articleData = JSON.parse(cleanedJson);
    
    const finalArticle = {
      ...articleData,
      isGenerated: true,
      timestamp: new Date().toISOString()
    };

    articleCache.set(cacheKey, finalArticle);
    return finalArticle;

  } catch (error) {
    console.error("Gemini Generation Error:", error.message);
    return {
      title,
      content: `<p>${description}</p><p><em>Our editorial team is currently expanding on this story. Check back later for the full analysis.</em></p>`,
      tags: ["Update"],
      isGenerated: false
    };
  }
}

module.exports = { generateArticle };
