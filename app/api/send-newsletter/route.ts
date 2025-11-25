import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import nodemailer from 'nodemailer';

// Gmail SMTP Configuration for admin emails (newsletters)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alexandrarizoucoiffure@gmail.com',
    pass: 'xgsi lpct tble mpog'
  }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, content, language } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Fetch subscribers from Firestore using client SDK
    // Get all subscribers and filter client-side (more reliable)
    const subscribersRef = collection(db, 'newsletter_subscribers');
    const allSnapshot = await getDocs(subscribersRef);
    
    console.log(`Total subscribers in database: ${allSnapshot.docs.length}`);
    
    // Filter subscribers client-side
    const subscribers = allSnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
      id: doc.id,
          email: data.email || '',
          language: data.language || 'el',
          isActive: data.isActive !== false // Treat undefined/null as active (default to true)
        };
      })
      .filter(sub => {
        // Must have valid email
        if (!sub.email || !sub.email.includes('@')) return false;
        
        // Must be active (isActive !== false means true or undefined)
        if (sub.isActive === false) return false;
        
        // Apply language filter if specified
        if (language && language !== 'all' && sub.language !== language) return false;
        
        return true;
      })
      .map(sub => ({
        id: sub.id,
        email: sub.email,
        language: sub.language
      }));

    console.log(`Active subscribers after filtering: ${subscribers.length}`);
    
    // Log subscribers for debugging
    if (subscribers.length > 0) {
      console.log('Subscribers to send to:', subscribers.map(s => s.email).join(', '));
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { 
          error: 'No active subscribers found',
          debug: {
            totalInDb: allSnapshot.docs.length,
            message: 'Check if subscribers have isActive field set to true'
          }
        },
        { status: 400 }
      );
    }

    // Verify SMTP connection (optional - continue even if verify fails)
    try {
    await gmailTransporter.verify();
    } catch (verifyError) {
      console.warn('SMTP verification failed, but continuing:', verifyError);
      // Continue anyway - sometimes verify fails but sending still works
    }

    const results = [];
    const errors = [];

    // Send emails to each subscriber
    for (const subscriber of subscribers) {
      try {
        const mailOptions = {
          from: '"Alexandra Rizou hair-beauty & health services" <alexandrarizoucoiffure@gmail.com>',
          to: subscriber.email,
          subject: subject,
          html: content,
          text: content.replace(/<[^>]*>/g, '') // Strip HTML for text version
        };

        const info = await gmailTransporter.sendMail(mailOptions);
        console.log(`Newsletter sent to ${subscriber.email}:`, info.messageId);
        results.push({ email: subscriber.email, messageId: info.messageId, success: true });
      } catch (error) {
        console.error(`Error sending newsletter to ${subscriber.email}:`, error);
        errors.push({ email: subscriber.email, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      recipients: results.length,
      errors: errors.length,
      message: `Newsletter sent successfully to ${results.length} subscribers`
    });
  } catch (error) {
    console.error('Error in send-newsletter API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

