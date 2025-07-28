import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailContent } = await req.json();

    if (!emailContent || typeof emailContent !== "string") {
      return NextResponse.json(
        { error: "Email content is required" },
        { status: 400 }
      );
    }

    // Extract key information from email
    const summary = analyzeEmailContent(emailContent);

    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Email summarization error:", error);
    return NextResponse.json(
      { error: "Failed to summarize email" },
      { status: 500 }
    );
  }
}

function analyzeEmailContent(content: string) {
  // Clean and normalize the content
  const cleanContent = content.replace(/\s+/g, ' ').trim();
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Extract key information
  const analysis = {
    summary: "",
    keyPoints: [] as string[],
    actionItems: [] as string[],
    sentiment: "neutral" as "positive" | "negative" | "neutral",
    urgency: "normal" as "low" | "normal" | "high",
    category: "general" as "business" | "personal" | "marketing" | "notification" | "general",
    wordCount: cleanContent.split(/\s+/).length,
  };

  // Detect email category
  if (/meeting|schedule|calendar|appointment|conference/i.test(content)) {
    analysis.category = "business";
  } else if (/offer|sale|discount|buy|purchase|deal/i.test(content)) {
    analysis.category = "marketing";
  } else if (/notification|alert|update|status|confirmation/i.test(content)) {
    analysis.category = "notification";
  } else if (/family|friend|personal|birthday|wedding/i.test(content)) {
    analysis.category = "personal";
  }

  // Detect urgency
  if (/urgent|asap|immediate|emergency|critical|deadline/i.test(content)) {
    analysis.urgency = "high";
  } else if (/whenever|no rush|when you can|at your convenience/i.test(content)) {
    analysis.urgency = "low";
  }

  // Detect sentiment
  const positiveWords = /thank|appreciate|great|excellent|wonderful|pleased|happy|congratulations/gi;
  const negativeWords = /problem|issue|concern|disappointed|angry|frustrated|complaint|error/gi;
  
  const positiveMatches = (content.match(positiveWords) || []).length;
  const negativeMatches = (content.match(negativeWords) || []).length;
  
  if (positiveMatches > negativeMatches + 1) {
    analysis.sentiment = "positive";
  } else if (negativeMatches > positiveMatches + 1) {
    analysis.sentiment = "negative";
  }

  // Extract action items
  const actionPatterns = [
    /please\s+([^.!?]+)/gi,
    /need\s+to\s+([^.!?]+)/gi,
    /should\s+([^.!?]+)/gi,
    /must\s+([^.!?]+)/gi,
    /required\s+to\s+([^.!?]+)/gi,
    /action\s+needed:?\s*([^.!?]+)/gi,
  ];

  actionPatterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 5) {
        analysis.actionItems.push(match[1].trim());
      }
    }
  });

  // Extract key points (important sentences)
  const importantSentences = sentences.filter(sentence => {
    const s = sentence.trim();
    return s.length > 20 && (
      /important|key|main|primary|essential|critical|note|remember/i.test(s) ||
      /\$[\d,]+|\d+%|deadline|date|time|meeting|appointment/i.test(s) ||
      s.includes('?') // Questions are often important
    );
  });

  analysis.keyPoints = importantSentences.slice(0, 3).map(s => s.trim());

  // Generate summary
  if (sentences.length === 0) {
    analysis.summary = "Email appears to be empty or contains only formatting.";
  } else if (sentences.length <= 2) {
    analysis.summary = cleanContent.substring(0, 200) + (cleanContent.length > 200 ? "..." : "");
  } else {
    // Create a summary from the first sentence and key points
    const firstSentence = sentences[0].trim();
    const lastSentence = sentences[sentences.length - 1].trim();
    
    if (analysis.keyPoints.length > 0) {
      analysis.summary = `${firstSentence}. Key points include: ${analysis.keyPoints[0]}`;
    } else {
      analysis.summary = `${firstSentence}. ${lastSentence}`;
    }
    
    // Limit summary length
    if (analysis.summary.length > 300) {
      analysis.summary = analysis.summary.substring(0, 297) + "...";
    }
  }

  // Remove duplicates from action items
  analysis.actionItems = [...new Set(analysis.actionItems)].slice(0, 5);

  return analysis;
}
