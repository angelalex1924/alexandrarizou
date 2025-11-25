import { NextRequest, NextResponse } from 'next/server';
import { generateTemplateEmailHTML } from '@/lib/emailTemplateGenerator';
import { emailTemplates } from '@/lib/emailTemplates';
import { emailTemplates as newsletterTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, customization, preview } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Find template from either emailTemplates or newsletterTemplates
    const template = emailTemplates.find(t => t.id === templateId);
    let templateContent = '';
    let templateName = '';

    if (template) {
      // From emailTemplates (holiday templates) - content is a string
      templateContent = typeof template.content === 'string' ? template.content : '';
      templateName = template.name;
    } else {
      // Try newsletter templates - content is an object with el/en
      const newsletterTemplate = newsletterTemplates.find(t => t.id === templateId);
      if (newsletterTemplate) {
        // Default to Greek, fallback to English
        templateContent = typeof newsletterTemplate.content === 'object' 
          ? (newsletterTemplate.content.el || newsletterTemplate.content.en || '')
          : (newsletterTemplate.content || '');
        templateName = newsletterTemplate.name;
      } else {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
    }

    // Apply customization if provided
    let finalContent = templateContent;
    if (customization) {
      // Apply color customization
      if (customization.colors) {
        finalContent = finalContent.replace(/#6B9A7A/g, customization.colors.primary || '#6B9A7A');
        finalContent = finalContent.replace(/#D4A574/g, customization.colors.accent || '#D4A574');
      }
    }

    // Generate HTML using the emailService function
    const html = generateTemplateEmailHTML(finalContent, templateName);

    return NextResponse.json({
      success: true,
      html: html,
      templateName: templateName
    });
  } catch (error) {
    console.error('Error in generate-template-preview API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

