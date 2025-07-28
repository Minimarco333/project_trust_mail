"use client";

import { useState } from "react";
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// TrustMail Dashboard - Email Security & Analysis
export default function Dashboard() {
  const [emailContent, setEmailContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const analyzeEmail = async () => {
    if (!emailContent.trim()) {
      alert("Please enter email content to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailContent }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
      } else {
        alert("Error analyzing email: " + data.error);
      }
    } catch (error) {
      alert("Failed to analyze email. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const summarizeEmail = async () => {
    if (!emailContent.trim()) {
      alert("Please enter email content to summarize");
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch("/api/summarize-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailContent }),
      });

      const data = await response.json();
      if (data.success) {
        setSummaryResult(data.summary);
      } else {
        alert("Error summarizing email: " + data.error);
      }
    } catch (error) {
      alert("Failed to summarize email. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "high": return "from-red-600 to-red-700 text-white border-red-500/30";
      case "medium": return "from-amber-600 to-orange-600 text-white border-amber-500/30";
      case "low": return "from-emerald-600 to-green-600 text-white border-emerald-500/30";
      default: return "from-cyan-600 to-blue-600 text-white border-cyan-500/30";
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "high":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "medium":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "low":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header with dark gradient background */}
      <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-black shadow-2xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                TrustMail
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                AI-powered email security & intelligent summarization
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
              <ButtonAccount />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Analysis Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Email Input Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Email Analysis
              </h2>
              <p className="text-cyan-100 mt-2">Paste your email content for security analysis</p>
            </div>
            
            <div className="p-8">
              <textarea 
                className="w-full h-40 p-4 bg-gray-900/50 border-2 border-gray-600 rounded-2xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 resize-none text-gray-100 placeholder-gray-400"
                placeholder="Paste your email content here for comprehensive security analysis and intelligent summarization..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
              
              <div className="flex gap-4 mt-6">
                <button 
                  className={`flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-500/25 ${isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={analyzeEmail}
                  disabled={isAnalyzing}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isAnalyzing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12a11.955 11.955 0 01-1.382 5.618m0 0l-3.707-3.707M20.618 17.618l-3.707-3.707M3.382 6.382a11.955 11.955 0 000 11.236m0-11.236l3.707 3.707M3.382 17.618L7.09 13.91" />
                      </svg>
                    )}
                    {isAnalyzing ? 'Analyzing Security...' : 'Scan for Threats'}
                  </div>
                </button>
                
                <button 
                  className={`flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 ${isSummarizing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={summarizeEmail}
                  disabled={isSummarizing}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isSummarizing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                      </svg>
                    )}
                    {isSummarizing ? 'Generating Summary...' : 'Smart Summary'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                  </svg>
                </div>
                Analysis Results
              </h2>
              <p className="text-emerald-100 mt-2">Real-time security insights & summaries</p>
            </div>
            
            <div className="p-8 max-h-96 overflow-y-auto">
              {/* Security Analysis Results */}
              {analysisResult && (
                <div className="space-y-6 mb-8">
                  <div className={`bg-gradient-to-r ${getThreatColor(analysisResult.threatLevel)} p-6 rounded-2xl shadow-lg border`}>
                    <div className="flex items-start gap-4">
                      {getThreatIcon(analysisResult.threatLevel)}
                      <div>
                        <h3 className="font-bold text-lg mb-2">Security Analysis</h3>
                        <p className="mb-3">{analysisResult.summary}</p>
                        <div className="bg-black/20 rounded-lg px-3 py-1 inline-block">
                          <span className="text-sm font-semibold">Risk Score: {analysisResult.riskScore}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {analysisResult.detectedThreats.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl">
                      <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Detected Threats
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.detectedThreats.map((threat: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-red-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.recommendations.length > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                      <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-blue-300">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Summary Results */}
              {summaryResult && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg border border-purple-500/30">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Email Summary
                    </h3>
                    <p>{summaryResult.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Category", value: summaryResult.category, color: "bg-purple-900/30 text-purple-300 border border-purple-500/30" },
                      { label: "Urgency", value: summaryResult.urgency, color: "bg-orange-900/30 text-orange-300 border border-orange-500/30" },
                      { label: "Sentiment", value: summaryResult.sentiment, color: "bg-green-900/30 text-green-300 border border-green-500/30" },
                      { label: "Words", value: summaryResult.wordCount, color: "bg-blue-900/30 text-blue-300 border border-blue-500/30" }
                    ].map((item, index) => (
                      <div key={index} className={`${item.color} p-4 rounded-xl text-center font-semibold`}>
                        <div className="text-sm opacity-75">{item.label}</div>
                        <div className="text-lg">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {summaryResult.keyPoints.length > 0 && (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                      <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {summaryResult.keyPoints.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-emerald-300">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summaryResult.actionItems.length > 0 && (
                    <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-2xl">
                      <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {summaryResult.actionItems.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-amber-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {!analysisResult && !summaryResult && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center border border-gray-600">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500">Enter email content and click "Scan for Threats" or "Smart Summary" to see results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Emails Analyzed",
              value: "0",
              desc: "This month",
              gradient: "from-cyan-600 to-blue-700",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              title: "Threats Blocked",
              value: "0",
              desc: "Potential scams detected",
              gradient: "from-red-600 to-pink-700",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )
            },
            {
              title: "Safe Emails",
              value: "0",
              desc: "Verified as legitimate",
              gradient: "from-emerald-600 to-green-700",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className={`bg-gradient-to-r ${stat.gradient} p-6`}>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-90">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-75 mt-1">{stat.desc}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
