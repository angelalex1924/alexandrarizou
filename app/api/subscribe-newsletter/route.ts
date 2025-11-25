import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Try to use Admin SDK first, fallback to client SDK if not available
    if (adminDb) {
      try {
        // Check if email already exists
        const subscribersRef = adminDb.collection('newsletter_subscribers');
        const existingQuery = await subscribersRef
          .where('email', '==', normalizedEmail)
          .limit(1)
          .get();

        if (!existingQuery.empty) {
          return NextResponse.json(
            { error: 'This email is already subscribed' },
            { status: 400 }
          );
        }

        // Add to Firestore using Admin SDK
        const docRef = await subscribersRef.add({
          email: normalizedEmail,
          language: language || 'el',
          subscribedAt: FieldValue.serverTimestamp(),
          isActive: true
        });

        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter',
          id: docRef.id
        });
      } catch (adminError) {
        console.error('Admin SDK error, falling back to client SDK:', adminError);
        // Fall through to client SDK
      }
    }

    // Fallback to client SDK (requires proper Firestore rules)
    const subscribersRef = collection(db, 'newsletter_subscribers');
    const q = query(subscribersRef, where('email', '==', normalizedEmail));
    const existingSubscribers = await getDocs(q);

    if (!existingSubscribers.empty) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
      email: normalizedEmail,
      language: language || 'el',
      subscribedAt: serverTimestamp(),
      isActive: true
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      id: docRef.id
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

