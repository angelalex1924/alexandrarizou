import { NextRequest, NextResponse } from 'next/server';
import { sendReviewRequest } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, subject, message } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Emails array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    const result = await sendReviewRequest({
      emails,
      subject,
      message
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        sent: result.sent,
        errors: result.errors,
        message: `Review request emails sent successfully to ${result.sent} recipients`
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send review request emails' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-review-request API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

