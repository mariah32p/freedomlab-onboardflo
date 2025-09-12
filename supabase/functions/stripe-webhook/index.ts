import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// OnboardFlo specific price IDs - only process events for these products
const ONBOARDFLO_PRICE_IDS = [
  'price_1RzrMYDn6VTzl81bogCwhX1U', // Standard plan
  'price_1RzrMYDn6VTzl81bTSgcl0ZA', // Pro plan
];

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'OnboardFlo Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!, 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ error: 'No signature found' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      console.log(`✅ Webhook verified: ${event.type} for ${event.id}`);
    } catch (error: any) {
      console.error(`❌ Webhook signature verification failed: ${error.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process the event asynchronously
    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(
      JSON.stringify({ received: true, event_type: event.type }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleEvent(event: Stripe.Event) {
  console.log(`🔄 Processing event: ${event.type}`);
  
  const stripeData = event?.data?.object ?? {};
  if (!stripeData) {
    console.warn('⚠️ No data object in event');
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`❌ Error handling ${event.type}:`, error);
    throw error;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`🛒 Processing checkout completion: ${session.id}`);
  
  if (!session.customer || typeof session.customer !== 'string') {
    console.error('❌ No customer ID in checkout session');
    return;
  }

  // For subscription checkouts, verify this is for OnboardFlo
  if (session.mode === 'subscription') {
    // Check the specific subscription created by this checkout session
    if (!session.subscription || typeof session.subscription !== 'string') {
      console.error('❌ No subscription ID in checkout session');
      return;
    }

    // Get the specific subscription from this checkout
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const priceId = subscription.items.data[0]?.price?.id;
    
    if (!priceId || !ONBOARDFLO_PRICE_IDS.includes(priceId)) {
      console.log(`ℹ️ Ignoring checkout for different product. Price ID: ${priceId}`);
      return;
    }
  }

  const customerId = session.customer;
  
  // For subscription checkouts, ensure customer mapping exists
  if (session.mode === 'subscription') {
    console.log(`📝 Creating/updating customer mapping for: ${customerId}`);
    
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    if (!customer.email) {
      console.error('❌ No email found for customer');
      return;
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('❌ Error fetching users:', userError);
      return;
    }

    const user = userData.users.find(u => u.email === customer.email);
    if (!user) {
      console.error(`❌ No user found with email: ${customer.email}`);
      return;
    }

    // Create or update customer mapping
    const { error: customerError } = await supabase
      .from('stripe_customers')
      .upsert({
        user_id: user.id,
        customer_id: customerId,
      }, {
        onConflict: 'user_id'
      });

    if (customerError) {
      console.error('❌ Error creating customer mapping:', customerError);
      return;
    }

    console.log(`✅ Customer mapping created/updated for user: ${user.id}`);
    
    // Now sync the subscription
    await syncSubscriptionFromStripe(customerId);
  }
  
  // For one-time payments, handle order creation
  if (session.mode === 'payment' && session.payment_status === 'paid') {
    console.log(`💳 Processing one-time payment: ${session.id}`);
    
    const { error: orderError } = await supabase
      .from('stripe_orders')
      .upsert({
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent as string,
        customer_id: customerId,
        amount_subtotal: session.amount_subtotal || 0,
        amount_total: session.amount_total || 0,
        currency: session.currency || 'usd',
        payment_status: session.payment_status,
        status: 'completed',
      }, {
        onConflict: 'checkout_session_id'
      });

    if (orderError) {
      console.error('❌ Error creating order:', orderError);
      return;
    }
    
    console.log(`✅ Order created for session: ${session.id}`);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log(`🔄 Processing subscription change: ${subscription.id} (${subscription.status})`);
  
  // Only process OnboardFlo subscriptions
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId || !ONBOARDFLO_PRICE_IDS.includes(priceId)) {
    console.log(`ℹ️ Ignoring subscription change for different product. Price ID: ${priceId}`);
    return;
  }

  if (!subscription.customer || typeof subscription.customer !== 'string') {
    console.error('❌ No customer ID in subscription');
    return;
  }

  await syncSubscriptionFromStripe(subscription.customer);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`🗑️ Processing subscription deletion: ${subscription.id}`);
  
  // Only process OnboardFlo subscriptions
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId || !ONBOARDFLO_PRICE_IDS.includes(priceId)) {
    console.log(`ℹ️ Ignoring subscription deletion for different product. Price ID: ${priceId}`);
    return;
  }

  if (!subscription.customer || typeof subscription.customer !== 'string') {
    console.error('❌ No customer ID in deleted subscription');
    return;
  }

  const { error } = await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      deleted_at: new Date().toISOString(),
    })
    .eq('customer_id', subscription.customer);

  if (error) {
    console.error('❌ Error marking subscription as deleted:', error);
    return;
  }
  
  console.log(`✅ Subscription marked as canceled: ${subscription.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`💳❌ Processing payment failure: ${invoice.id}`);
  
  // Only process OnboardFlo invoices
  if (invoice.lines && invoice.lines.data.length > 0) {
    const priceId = invoice.lines.data[0]?.price?.id;
    if (!priceId || !ONBOARDFLO_PRICE_IDS.includes(priceId)) {
      console.log(`ℹ️ Ignoring payment failure for different product. Price ID: ${priceId}`);
      return;
    }
  }

  if (!invoice.customer || typeof invoice.customer !== 'string') {
    console.error('❌ No customer ID in failed invoice');
    return;
  }

  // Only set payment_issue_since if not already set (first failure)
  const { error } = await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'past_due',
      payment_issue_since: new Date().toISOString(),
    })
    .eq('customer_id', invoice.customer)
    .is('payment_issue_since', null);

  if (error) {
    console.error('❌ Error updating payment failure status:', error);
    return;
  }
  
  console.log(`✅ Payment failure recorded for customer: ${invoice.customer}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`💳✅ Processing payment success: ${invoice.id}`);
  
  // Only process OnboardFlo invoices
  if (invoice.lines && invoice.lines.data.length > 0) {
    const priceId = invoice.lines.data[0]?.price?.id;
    if (!priceId || !ONBOARDFLO_PRICE_IDS.includes(priceId)) {
      console.log(`ℹ️ Ignoring payment success for different product. Price ID: ${priceId}`);
      return;
    }
  }

  if (!invoice.customer || typeof invoice.customer !== 'string') {
    console.error('❌ No customer ID in successful invoice');
    return;
  }

  // Clear payment issues when payment succeeds
  const { error } = await supabase
    .from('stripe_subscriptions')
    .update({
      payment_issue_since: null,
    })
    .eq('customer_id', invoice.customer);

  if (error) {
    console.error('❌ Error clearing payment issues:', error);
    return;
  }
  
  console.log(`✅ Payment issues cleared for customer: ${invoice.customer}`);
  
  // Also sync the subscription to get latest status
  await syncSubscriptionFromStripe(invoice.customer);
}

async function syncSubscriptionFromStripe(customerId: string) {
  console.log(`🔄 Syncing subscription for customer: ${customerId}`);
  
  try {
    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.log(`ℹ️ No subscriptions found for customer: ${customerId}`);
      
      // Mark as not_started if no subscription exists
      const { error } = await supabase
        .from('stripe_subscriptions')
        .upsert({
          customer_id: customerId,
          status: 'not_started',
        }, {
          onConflict: 'customer_id',
        });

      if (error) {
        console.error('❌ Error updating subscription status to not_started:', error);
        throw error;
      }
      
      return;
    }

    // Get the most recent subscription
    const subscription = subscriptions.data[0];
    console.log(`📊 Subscription status: ${subscription.status}, Price: ${subscription.items.data[0]?.price?.id}`);

    // Prepare subscription data
    const subscriptionData: any = {
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0]?.price?.id || null,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      status: subscription.status,
    };

    // Clear payment_issue_since if subscription is healthy
    if (['active', 'trialing'].includes(subscription.status)) {
      subscriptionData.payment_issue_since = null;
    }

    // Add payment method info if available
    if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
      const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
      subscriptionData.payment_method_brand = paymentMethod.card?.brand || null;
      subscriptionData.payment_method_last4 = paymentMethod.card?.last4 || null;
    }

    // Upsert subscription data
    const { error: subError } = await supabase
      .from('stripe_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'customer_id',
      });

    if (subError) {
      console.error('❌ Error syncing subscription:', subError);
      throw subError;
    }

    console.log(`✅ Successfully synced subscription: ${subscription.id} (${subscription.status})`);
  } catch (error) {
    console.error(`❌ Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}