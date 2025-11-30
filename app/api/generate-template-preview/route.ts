import { NextRequest, NextResponse } from 'next/server';
import { generateTemplateEmailHTML } from '@/lib/emailTemplateGenerator';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { templateId, customization, preview } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Find the template from emailTemplates
    const template = emailTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Get template content (handle both string and object with el/en)
    let templateContent = '';
    if (typeof template.content === 'string') {
      templateContent = template.content;
    } else if (typeof template.content === 'object' && template.content.el) {
      templateContent = template.content.el;
    } else if (typeof template.content === 'object' && template.content.en) {
      templateContent = template.content.en;
    }

    // Use customization message if provided, otherwise use template content
    const message = customization?.customMessage || templateContent;

    // Get colors from customization
    const colors = customization?.colors || {};

    // Generate HTML using the same function as the real emails, with custom colors and baseTemplateId
    const html = generateTemplateEmailHTML(message, template.name, colors, templateId);

    return NextResponse.json({
      success: true,
      html: html,
      templateName: template.name
    });
  } catch (error) {
    console.error('Error in generate-template-preview API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

