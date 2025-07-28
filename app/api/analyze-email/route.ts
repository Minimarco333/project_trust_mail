import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

// Enhanced domain and email validation functions
function validateEmailDomain(email: string): { isValid: boolean; riskScore: number; issues: string[] } {
  const issues: string[] = [];
  let riskScore = 0;

  // Extract domain from email
  const emailRegex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = email.match(emailRegex);
  
  if (!match) {
    return { isValid: false, riskScore: 100, issues: ["Invalid email format"] };
  }

  const [, localPart, domain] = match;
  const domainLower = domain.toLowerCase();

  // Check for suspicious TLDs
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.top', '.click', '.download', '.work', '.party', '.review', '.science', '.date', '.faith', '.loan', '.win', '.bid', '.racing', '.stream'];
  if (suspiciousTlds.some(tld => domainLower.endsWith(tld))) {
    riskScore += 40;
    issues.push("Suspicious top-level domain detected");
  }

  // Check for domain spoofing (common brand impersonation)
  const legitimateDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'apple.com', 'microsoft.com', 'amazon.com', 'paypal.com', 'ebay.com', 'facebook.com', 'google.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'netflix.com', 'spotify.com'];
  const spoofingPatterns = [
    /g[o0]ogle\.com/i,
    /[a4]mazon\.com/i,
    /p[a4]yp[a4]l\.com/i,
    /micr[o0]s[o0]ft\.com/i,
    /[a4]pple\.com/i,
    /netfl[i1]x\.com/i,
    /f[a4]ceb[o0][o0]k\.com/i,
    /tw[i1]tter\.com/i,
    /[i1]nst[a4]gr[a4]m\.com/i,
    /l[i1]nked[i1]n\.com/i,
    /sp[o0]t[i1]fy\.com/i
  ];

  spoofingPatterns.forEach(pattern => {
    if (pattern.test(domainLower) && !legitimateDomains.includes(domainLower)) {
      riskScore += 50;
      issues.push("Potential domain spoofing detected");
    }
  });

  // Check for suspicious domain characteristics
  if (domainLower.includes('secure') || domainLower.includes('verify') || domainLower.includes('update')) {
    riskScore += 25;
    issues.push("Domain contains suspicious security-related keywords");
  }

  // Check for excessive hyphens or numbers
  if ((domainLower.match(/-/g) || []).length > 2) {
    riskScore += 15;
    issues.push("Domain contains excessive hyphens");
  }

  if ((domainLower.match(/\d/g) || []).length > 3) {
    riskScore += 15;
    issues.push("Domain contains excessive numbers");
  }

  // Check for homograph attacks (similar looking characters)
  const homographPatterns = [/[а-я]/i, /[α-ω]/i]; // Cyrillic and Greek characters
  if (homographPatterns.some(pattern => pattern.test(domainLower))) {
    riskScore += 35;
    issues.push("Domain contains non-Latin characters (potential homograph attack)");
  }

  // Check for very new or suspicious domain patterns
  if (domainLower.length > 30) {
    riskScore += 10;
    issues.push("Unusually long domain name");
  }

  // Check for subdomain spoofing
  const subdomainParts = domainLower.split('.');
  if (subdomainParts.length > 3) {
    const potentialSpoof = subdomainParts.slice(-3, -1).join('.');
    if (legitimateDomains.some(legit => potentialSpoof.includes(legit.split('.')[0]))) {
      riskScore += 30;
      issues.push("Potential subdomain spoofing detected");
    }
  }

  return { isValid: true, riskScore: Math.min(riskScore, 100), issues };
}

function extractEmailAddresses(content: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return content.match(emailRegex) || [];
}

function extractUrls(content: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  return content.match(urlRegex) || [];
}

function analyzeUrlSafety(urls: string[]): { riskScore: number; issues: string[] } {
  const issues: string[] = [];
  let riskScore = 0;

  urls.forEach(url => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Check for URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link', 'is.gd', 'buff.ly', 'adf.ly'];
      if (shorteners.some(shortener => domain.includes(shortener))) {
        riskScore += 20;
        issues.push("Shortened URLs detected (potential redirect risk)");
      }

      // Check for suspicious domains in URLs
      const suspiciousDomains = ['.tk', '.ml', '.ga', '.cf', '.top', '.click', '.download'];
      if (suspiciousDomains.some(tld => domain.endsWith(tld))) {
        riskScore += 25;
        issues.push("URLs pointing to suspicious domains");
      }

      // Check for IP addresses instead of domains
      if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) {
        riskScore += 30;
        issues.push("URLs using IP addresses instead of domain names");
      }

      // Check for suspicious URL patterns
      if (urlObj.pathname.includes('login') || urlObj.pathname.includes('verify') || urlObj.pathname.includes('secure')) {
        riskScore += 15;
        issues.push("URLs contain suspicious security-related paths");
      }

    } catch (e) {
      riskScore += 10;
      issues.push("Malformed URLs detected");
    }
  });

  return { riskScore: Math.min(riskScore, 100), issues };
}

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

    // Enhanced scam detection patterns
    const scamPatterns = [
      // Financial scams
      { pattern: /urgent.{0,20}action.{0,20}required/i, weight: 25, description: "Urgent action language" },
      { pattern: /verify.{0,20}account.{0,20}immediately/i, weight: 30, description: "Account verification pressure" },
      { pattern: /suspended.{0,20}account/i, weight: 35, description: "Account suspension threat" },
      { pattern: /click.{0,20}here.{0,20}immediately/i, weight: 20, description: "Immediate action request" },
      { pattern: /limited.{0,20}time.{0,20}offer/i, weight: 15, description: "Limited time pressure" },
      { pattern: /congratulations.{0,20}won/i, weight: 40, description: "Lottery/prize scam language" },
      { pattern: /inheritance.{0,20}money/i, weight: 45, description: "Inheritance scam" },
      { pattern: /nigerian.{0,20}prince/i, weight: 50, description: "Classic Nigerian prince scam" },
      { pattern: /lottery.{0,20}winner/i, weight: 40, description: "Lottery scam" },
      { pattern: /tax.{0,20}refund/i, weight: 30, description: "Tax refund scam" },
      { pattern: /irs.{0,20}refund/i, weight: 35, description: "IRS impersonation" },
      { pattern: /bitcoin.{0,20}investment/i, weight: 25, description: "Cryptocurrency scam" },
      { pattern: /crypto.{0,20}opportunity/i, weight: 25, description: "Cryptocurrency opportunity scam" },
      
      // Romance/social engineering
      { pattern: /lonely.{0,20}widow/i, weight: 35, description: "Romance scam language" },
      { pattern: /military.{0,20}deployment/i, weight: 30, description: "Military romance scam" },
      { pattern: /love.{0,20}you.{0,20}forever/i, weight: 25, description: "Romance scam language" },
      
      // Tech support scams
      { pattern: /microsoft.{0,20}support/i, weight: 30, description: "Tech support scam" },
      { pattern: /computer.{0,20}infected/i, weight: 35, description: "Malware scare tactic" },
      { pattern: /virus.{0,20}detected/i, weight: 35, description: "Virus scare tactic" },
      
      // Phishing attempts
      { pattern: /update.{0,20}payment.{0,20}method/i, weight: 30, description: "Payment method phishing" },
      { pattern: /confirm.{0,20}identity/i, weight: 25, description: "Identity confirmation phishing" },
      { pattern: /security.{0,20}alert/i, weight: 20, description: "Security alert phishing" }
    ];

    const urgencyWords = [
      { pattern: /urgent/i, weight: 10, description: "Urgency pressure" },
      { pattern: /immediate/i, weight: 10, description: "Immediate action pressure" },
      { pattern: /expires.{0,10}today/i, weight: 15, description: "Expiration pressure" },
      { pattern: /act.{0,10}now/i, weight: 15, description: "Act now pressure" },
      { pattern: /limited.{0,10}time/i, weight: 10, description: "Limited time pressure" },
      { pattern: /hurry/i, weight: 10, description: "Hurry pressure" },
      { pattern: /don't.{0,10}delay/i, weight: 12, description: "Don't delay pressure" },
      { pattern: /final.{0,10}notice/i, weight: 20, description: "Final notice pressure" }
    ];

    // Analysis results
    const analysis = {
      threatLevel: "low" as "low" | "medium" | "high",
      riskScore: 0,
      detectedThreats: [] as string[],
      recommendations: [] as string[],
      summary: "",
      domainAnalysis: [] as string[],
      urlAnalysis: [] as string[],
      emailAddresses: [] as string[],
      suspiciousSegments: [] as { text: string; reason: string }[]
    };

    let riskScore = 0;
    const suspiciousSegments: { text: string; reason: string }[] = [];

    // Extract and analyze email addresses
    const emailAddresses = extractEmailAddresses(emailContent);
    analysis.emailAddresses = emailAddresses;

    emailAddresses.forEach(email => {
      const domainCheck = validateEmailDomain(email);
      // Increase impact of suspicious domain findings
      riskScore += domainCheck.riskScore * 0.6; // Heavier weight for domain risk
      analysis.domainAnalysis.push(...domainCheck.issues);
      domainCheck.issues.forEach((reason) => {
        suspiciousSegments.push({ text: email, reason });
      });
    });

    // Extract and analyze URLs
    const urls = extractUrls(emailContent);
    const urlAnalysis = analyzeUrlSafety(urls);
    riskScore += urlAnalysis.riskScore * 0.4; // Weight URL issues
    analysis.urlAnalysis.push(...urlAnalysis.issues);
    urlAnalysis.issues.forEach((reason) => {
      urls.forEach((u) => suspiciousSegments.push({ text: u, reason }));
    });

    // Check for enhanced scam patterns
    scamPatterns.forEach(({ pattern, weight, description }) => {
      if (pattern.test(emailContent)) {
        riskScore += weight;
        analysis.detectedThreats.push(description);
        const m = emailContent.match(pattern);
        if (m) suspiciousSegments.push({ text: m[0], reason: description });
      }
    });

    // Check for urgency tactics
    urgencyWords.forEach(({ pattern, weight, description }) => {
      if (pattern.test(emailContent)) {
        riskScore += weight;
        analysis.detectedThreats.push(description);
        const m = emailContent.match(pattern);
        if (m) suspiciousSegments.push({ text: m[0], reason: description });
      }
    });

    // Check for financial requests
    if (/send.{0,20}money|wire.{0,20}transfer|bank.{0,20}details|credit.{0,20}card|social.{0,20}security|ssn/i.test(emailContent)) {
      riskScore += 30;
      analysis.detectedThreats.push("Financial or personal information request detected");
      suspiciousSegments.push({
        text: "Financial request keywords",
        reason: "Financial or personal information request detected",
      });
    }

    // Check for poor grammar/spelling (enhanced)
    const grammarIssues = emailContent.match(/\b(recieve|seperate|occured|definately|loose|there|youre|its|alot|wich|wont|cant|dont|im|ill|well|theyll|youll|were|where|than|then)\b/gi);
    if (grammarIssues && grammarIssues.length > 3) {
      riskScore += 15;
      analysis.detectedThreats.push("Multiple spelling/grammar errors detected");
      suspiciousSegments.push({
        text: grammarIssues?.slice(0, 5).join(", ") || "grammar errors",
        reason: "Multiple spelling/grammar errors detected",
      });
    }

    // Check for excessive capitalization
    const capsWords = emailContent.match(/\b[A-Z]{3,}\b/g);
    if (capsWords && capsWords.length > 5) {
      riskScore += 10;
      analysis.detectedThreats.push("Excessive use of capital letters (shouting)");
      suspiciousSegments.push({
        text: capsWords?.slice(0, 3).join(" ") || "CAPS",
        reason: "Excessive use of capital letters",
      });
    }

    // Check for suspicious attachments mentioned
    if (/attachment|download|file|pdf|doc|exe|zip/i.test(emailContent)) {
      riskScore += 15;
      analysis.detectedThreats.push("Mentions of attachments or downloads");
      suspiciousSegments.push({ text: "attachment/download keywords", reason: "Attachment mention" });
    }

    // Check for impersonation attempts
    const impersonationPatterns = [
      /from.{0,10}(bank|paypal|amazon|microsoft|apple|google|facebook|twitter|instagram|netflix|spotify)/i,
      /(bank|paypal|amazon|microsoft|apple|google|facebook|twitter|instagram|netflix|spotify).{0,10}support/i
    ];
    
    impersonationPatterns.forEach(pattern => {
      if (pattern.test(emailContent)) {
        riskScore += 25;
        analysis.detectedThreats.push("Potential brand impersonation detected");
        suspiciousSegments.push({ text: "brand impersonation keywords", reason: "Potential brand impersonation" });
      }
    });

    // Determine threat level
    analysis.riskScore = Math.min(riskScore, 100);
    
    if (riskScore >= 70) {
      analysis.threatLevel = "high";
      analysis.recommendations.push("🚨 HIGH RISK: This email shows multiple red flags");
      analysis.recommendations.push("🚫 Do not respond, click links, or download attachments");
      analysis.recommendations.push("🚫 Do not provide personal or financial information");
      analysis.recommendations.push("📧 Report this email as spam/phishing to your email provider");
      analysis.recommendations.push("🗑️ Delete this email immediately");
    } else if (riskScore >= 40) {
      analysis.threatLevel = "medium";
      analysis.recommendations.push("⚠️ MEDIUM RISK: Exercise extreme caution");
      analysis.recommendations.push("🔍 Verify sender through official channels (phone, official website)");
      analysis.recommendations.push("❌ Avoid clicking any links or downloading attachments");
      analysis.recommendations.push("🤔 Be skeptical of any urgent requests");
      analysis.recommendations.push("📞 Contact the organization directly if this claims to be from them");
    } else {
      analysis.threatLevel = "low";
      analysis.recommendations.push("✅ Email appears relatively safe");
      analysis.recommendations.push("🔍 Still verify important requests independently");
      analysis.recommendations.push("🤔 Be cautious with personal information sharing");
      analysis.recommendations.push("📧 When in doubt, contact the sender through known channels");
    }

    // Attach suspicious segments to analysis before summary generation
    analysis.suspiciousSegments = suspiciousSegments;

    // Generate enhanced summary
    const threatCount = analysis.detectedThreats.length;
    const domainIssues = analysis.domainAnalysis.length;
    const urlIssues = analysis.urlAnalysis.length;

    if (threatCount > 0 || domainIssues > 0 || urlIssues > 0) {
      analysis.summary = `Analysis complete: ${threatCount} threat pattern(s), ${domainIssues} domain issue(s), ${urlIssues} URL concern(s) detected. Risk score: ${analysis.riskScore}/100.`;
    } else {
      analysis.summary = "No obvious security threats detected. Email appears legitimate, but always remain vigilant.";
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Email analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze email" },
      { status: 500 }
    );
  }
}
