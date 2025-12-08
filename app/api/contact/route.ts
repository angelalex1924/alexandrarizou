import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/emailService';
import { trackConversion } from '@/lib/acronMetrics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await sendContactFormEmail({
      name,
      email,
      phone: phone || undefined,
      subject: subject || 'other',
      message
    });

    if (result.success) {
      // Track conversion for AcronMetrics
      try {
        const siteId = 'alexandra-rizou';
        await trackConversion({
          siteId,
          type: 'contact_form',
          value: 0, // Contact form has no direct revenue, but it's a lead
          source: 'organic',
          page: request.headers.get('referer') || '/contact',
          userAgent: request.headers.get('user-agent') ?? undefined,
          metadata: { name, email, subject }
        });
      } catch (error) {
        console.error('Error tracking contact form conversion:', error);
        // Don't fail the request if tracking fails
      }
      
      return NextResponse.json({
        success: true,
        message: 'Contact form submitted successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send contact form email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

