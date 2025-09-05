import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Resend } from 'npm:resend@4.0.1';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const resendApiKey = Deno.env.get('RESEND_API_KEY');

if (!resendApiKey) {
  console.error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(resendApiKey);
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'welcome' | 'reminder';
  sessionId: string;
  recipientEmails: string[];
  sessionName?: string;
  businessName?: string;
  checklistTitle?: string;
  sessionUrl?: string;
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRequest: EmailRequest = await req.json();
    const { type, sessionId, recipientEmails, sessionName, businessName, checklistTitle, sessionUrl } = emailRequest;

    // Validate request
    if (!type || !sessionId || !recipientEmails || recipientEmails.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user owns this session
    const { data: session, error: sessionError } = await supabase
      .from('customer_sessions')
      .select(`
        *,
        checklists!inner(
          id,
          title,
          user_id
        )
      `)
      .eq('id', sessionId)
      .eq('checklists.user_id', user.id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const checklist = (session as any).checklists;
    const finalSessionUrl = sessionUrl || `${req.headers.get('origin') || 'https://your-domain.com'}/c/${checklist.id}/${session.session_token}`;

    let emailSubject: string;
    let emailHtml: string;

    if (type === 'welcome') {
      emailSubject = `Welcome to ${sessionName || checklist.title} - Let's get started!`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to OnboardFlo!</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your onboarding session is ready</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 22px;">${sessionName || checklist.title}</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              We've created a personalized onboarding checklist to help you get started. 
              Complete the steps at your own pace - your progress is automatically saved.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${finalSessionUrl}" 
               style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              Start Your Onboarding →
            </a>
          </div>

          <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">💡 What to expect:</h3>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li>Step-by-step guidance through the process</li>
              <li>Your progress is automatically saved</li>
              <li>Complete at your own pace</li>
              <li>Get help if you need it</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Sent by <strong>OnboardFlo by Freedom Lab</strong><br>
              Questions? Just reply to this email.
            </p>
          </div>
        </body>
        </html>
      `;
    } else { // reminder
      emailSubject = `Reminder: Complete your ${sessionName || checklist.title} onboarding`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Don't forget to complete your onboarding!</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">We're here to help you get started</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 22px;">${sessionName || checklist.title}</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">
              You started your onboarding process but haven't finished yet. 
              No worries - your progress has been saved and you can continue where you left off.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${finalSessionUrl}" 
               style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
              Continue Your Onboarding →
            </a>
          </div>

          <div style="background: #fef7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⏰ Quick reminder:</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Your progress is automatically saved</li>
              <li>Takes just a few minutes to complete</li>
              <li>We're here if you need any help</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Sent by <strong>OnboardFlo by Freedom Lab</strong><br>
              Questions? Just reply to this email.
            </p>
          </div>
        </body>
        </html>
      `;
    }

    // Send email to all recipients
    const emailPromises = recipientEmails.map(email => 
      resend.emails.send({
        from: 'OnboardFlo by Freedom Lab <info@freedomlab.ai>',
        to: [email.trim()],
        subject: emailSubject,
        html: emailHtml,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    // Check if any emails failed
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some emails failed to send:', failures);
      return new Response(
        JSON.stringify({ 
          error: `Failed to send ${failures.length} out of ${recipientEmails.length} emails`,
          details: failures.map(f => (f as PromiseRejectedResult).reason)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${type === 'welcome' ? 'Welcome' : 'Reminder'} email sent to ${recipientEmails.length} recipient(s)` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});