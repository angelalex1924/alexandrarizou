import { NextRequest, NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, templateId, customSubject, customMessage, customization } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Emails array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const result = await sendTemplateEmail({
      emails,
      templateId,
      customSubject,
      customMessage,
      customization
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        sent: result.sent,
        errors: result.errors,
        message: `Template emails sent successfully to ${result.sent} recipients`
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send template emails' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-template-email API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

