import { NextResponse } from 'next/server';

interface EmailData {
  subject: string;
  from: string;
  to: string;
  body: string;
  date: string;
  uid?: string;
  messageId?: string;
}

// Simple function to analyze email content (extracted from your existing route)
async function analyzeEmailContent(emailData: EmailData) {
  try {
    // This is a simplified version - you can integrate with your existing analyzeEmailContent function
    const analysis = {
      subject: emailData.subject,
      from: emailData.from,
      summary: `Email from ${emailData.from} about ${emailData.subject}`,
      scamScore: Math.random() * 100, // Replace with actual AI analysis
      isScam: Math.random() > 0.8,
      timestamp: new Date().toISOString(),
      originalId: emailData.uid || emailData.messageId
    };
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing email:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle both single email and batch of emails
    const emails = Array.isArray(body) ? body : [body];
    
    console.log(`Processing ${emails.length} emails from n8n webhook`);
    
    // Process each email through analysis
    const results = await Promise.all(
      emails.map(async (email: any) => {
        try {
          const emailData: EmailData = {
            subject: email.subject || '',
            from: email.from || email.sender || '',
            to: email.to || email.recipient || '',
            body: email.text || email.html || email.body || '',
            date: email.date || new Date().toISOString(),
            uid: email.uid,
            messageId: email.messageId || email.id
          };
          
          const result = await analyzeEmailContent(emailData);
          return { success: true, ...result };
        } catch (error) {
          console.error('Error processing individual email:', error);
          return { 
            success: false, 
            error: 'Failed to process email', 
            originalId: email.uid || email.messageId 
          };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({ 
      success: true, 
      processed: emails.length,
      successful: successCount,
      errors: errorCount,
      results 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process emails' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'TrustMail Email Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
