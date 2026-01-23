// Script to seed sample experiments in production
// Run with: heroku run node scripts/seed-sample-experiments.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleExperiments = [
  {
    name: "Homepage Hero Banner Redesign",
    description: "Testing new hero banner design with larger CTA button and updated copy",
    status: "LIVE",
    primaryKPI: "conversion_rate",
    secondaryKPIs: JSON.stringify(["click_through_rate", "bounce_rate"]),
    targeting: JSON.stringify({ device: ["desktop", "mobile"], country: ["US", "CA", "UK"] }),
    variants: [
      { name: "Control", description: "Current hero banner", trafficPercentage: 50 },
      { name: "Treatment A", description: "New banner with larger CTA", trafficPercentage: 50 }
    ]
  },
  {
    name: "Checkout Flow Simplification",
    description: "Reduce checkout steps from 4 to 2 to improve conversion",
    status: "LIVE",
    primaryKPI: "checkout_completion",
    secondaryKPIs: JSON.stringify(["cart_abandonment_rate", "time_to_checkout"]),
    targeting: JSON.stringify({ device: ["mobile"], country: ["US"] }),
    variants: [
      { name: "Control", description: "4-step checkout", trafficPercentage: 40 },
      { name: "2-Step Flow", description: "Simplified 2-step checkout", trafficPercentage: 60 }
    ]
  },
  {
    name: "Product Recommendation Algorithm",
    description: "Testing ML-based recommendations vs rule-based",
    status: "LIVE",
    primaryKPI: "add_to_cart_rate",
    secondaryKPIs: JSON.stringify(["revenue_per_user", "engagement_rate"]),
    targeting: JSON.stringify({ device: ["desktop", "mobile", "tablet"], channel: ["web"] }),
    variants: [
      { name: "Rule-Based", description: "Current rule-based recommendations", trafficPercentage: 33 },
      { name: "ML Model v1", description: "Collaborative filtering", trafficPercentage: 33 },
      { name: "ML Model v2", description: "Deep learning approach", trafficPercentage: 34 }
    ]
  },
  {
    name: "Email Subject Line Test",
    description: "Testing personalized subject lines for weekly newsletter",
    status: "PAUSED",
    primaryKPI: "email_open_rate",
    secondaryKPIs: JSON.stringify(["click_through_rate"]),
    targeting: JSON.stringify({ channel: ["email"], userType: ["subscribed"] }),
    variants: [
      { name: "Generic", description: "Standard subject line", trafficPercentage: 50 },
      { name: "Personalized", description: "Subject with user's name", trafficPercentage: 50 }
    ]
  },
  {
    name: "Pricing Page Layout",
    description: "Testing different pricing tier arrangements and highlight styles",
    status: "ENDED",
    primaryKPI: "signup_rate",
    secondaryKPIs: JSON.stringify(["premium_tier_selection", "time_on_page"]),
    targeting: JSON.stringify({ device: ["desktop"], country: ["US", "CA", "UK", "AU"] }),
    variants: [
      { name: "Control", description: "Current 3-column layout", trafficPercentage: 50 },
      { name: "Treatment", description: "4-column with popular tag", trafficPercentage: 50 }
    ]
  },
  {
    name: "Mobile App Onboarding",
    description: "Testing shorter onboarding flow (3 screens vs 5 screens)",
    status: "DRAFT",
    primaryKPI: "onboarding_completion",
    secondaryKPIs: JSON.stringify(["time_to_complete", "first_action_rate"]),
    targeting: JSON.stringify({ device: ["mobile"], channel: ["app"] }),
    variants: [
      { name: "5-Screen Flow", description: "Current onboarding", trafficPercentage: 50 },
      { name: "3-Screen Flow", description: "Condensed onboarding", trafficPercentage: 50 }
    ]
  },
  {
    name: "Search Results Ranking",
    description: "Testing new search algorithm with semantic understanding",
    status: "LIVE",
    primaryKPI: "search_success_rate",
    secondaryKPIs: JSON.stringify(["clicks_on_results", "refinement_rate"]),
    targeting: JSON.stringify({ device: ["desktop", "mobile"], language: ["en"] }),
    variants: [
      { name: "Keyword Match", description: "Current keyword-based search", trafficPercentage: 50 },
      { name: "Semantic Search", description: "AI-powered semantic search", trafficPercentage: 50 }
    ]
  },
  {
    name: "Social Proof Messaging",
    description: "Adding customer count badges to product pages",
    status: "DRAFT",
    primaryKPI: "add_to_cart_rate",
    secondaryKPIs: JSON.stringify(["conversion_rate", "trust_score"]),
    targeting: JSON.stringify({ device: ["desktop", "mobile"], country: ["US"] }),
    variants: [
      { name: "No Badge", description: "Product page without social proof", trafficPercentage: 33 },
      { name: "Customer Count", description: "Shows number of customers", trafficPercentage: 33 },
      { name: "Rating Badge", description: "Shows average rating", trafficPercentage: 34 }
    ]
  },
  {
    name: "Free Trial Duration",
    description: "Testing 7-day vs 14-day vs 30-day free trial periods",
    status: "DRAFT",
    primaryKPI: "trial_to_paid_conversion",
    secondaryKPIs: JSON.stringify(["trial_engagement", "cancellation_rate"]),
    targeting: JSON.stringify({ country: ["US", "CA"], userType: ["new"] }),
    variants: [
      { name: "7-Day Trial", description: "Current 7-day trial", trafficPercentage: 33 },
      { name: "14-Day Trial", description: "Extended to 14 days", trafficPercentage: 33 },
      { name: "30-Day Trial", description: "Extended to 30 days", trafficPercentage: 34 }
    ]
  },
  {
    name: "Push Notification Timing",
    description: "Testing optimal time to send engagement push notifications",
    status: "PAUSED",
    primaryKPI: "notification_open_rate",
    secondaryKPIs: JSON.stringify(["app_session_rate", "opt_out_rate"]),
    targeting: JSON.stringify({ device: ["mobile"], channel: ["app"] }),
    variants: [
      { name: "Morning 9AM", description: "Send at 9AM user local time", trafficPercentage: 33 },
      { name: "Afternoon 2PM", description: "Send at 2PM user local time", trafficPercentage: 33 },
      { name: "Evening 7PM", description: "Send at 7PM user local time", trafficPercentage: 34 }
    ]
  }
];

async function seedExperiments() {
  try {
    console.log('Fetching demo user...');

    // Get the demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (!user) {
      console.error('❌ Demo user not found. Please run create-initial-user.js first.');
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.email} (ID: ${user.id})`);
    console.log(`\nCreating ${sampleExperiments.length} sample experiments...\n`);

    let created = 0;
    let skipped = 0;

    for (const exp of sampleExperiments) {
      // Check if experiment already exists
      const existing = await prisma.experiment.findFirst({
        where: { name: exp.name },
      });

      if (existing) {
        console.log(`⊘ Skipped: "${exp.name}" (already exists)`);
        skipped++;
        continue;
      }

      // Create experiment with variants
      const experiment = await prisma.experiment.create({
        data: {
          name: exp.name,
          description: exp.description,
          status: exp.status,
          primaryKPI: exp.primaryKPI,
          secondaryKPIs: exp.secondaryKPIs,
          targeting: exp.targeting,
          ownerId: user.id,
          variants: {
            create: exp.variants,
          },
        },
        include: {
          variants: true,
        },
      });

      // Create audit log for creation
      await prisma.auditLog.create({
        data: {
          action: 'created',
          experimentId: experiment.id,
          userId: user.id,
          changes: JSON.stringify({
            name: experiment.name,
            status: experiment.status,
          }),
        },
      });

      // Create additional audit logs for status transitions
      if (exp.status === 'LIVE') {
        await prisma.auditLog.create({
          data: {
            action: 'went_live',
            experimentId: experiment.id,
            userId: user.id,
            changes: JSON.stringify({
              status: { from: 'DRAFT', to: 'LIVE' },
            }),
          },
        });
      } else if (exp.status === 'PAUSED') {
        await prisma.auditLog.create({
          data: {
            action: 'went_live',
            experimentId: experiment.id,
            userId: user.id,
            changes: JSON.stringify({
              status: { from: 'DRAFT', to: 'LIVE' },
            }),
          },
        });
        await prisma.auditLog.create({
          data: {
            action: 'paused',
            experimentId: experiment.id,
            userId: user.id,
            changes: JSON.stringify({
              status: { from: 'LIVE', to: 'PAUSED' },
            }),
          },
        });
      } else if (exp.status === 'ENDED') {
        await prisma.auditLog.create({
          data: {
            action: 'went_live',
            experimentId: experiment.id,
            userId: user.id,
            changes: JSON.stringify({
              status: { from: 'DRAFT', to: 'LIVE' },
            }),
          },
        });
        await prisma.auditLog.create({
          data: {
            action: 'ended',
            experimentId: experiment.id,
            userId: user.id,
            changes: JSON.stringify({
              status: { from: 'LIVE', to: 'ENDED' },
            }),
          },
        });
      }

      console.log(`✓ Created: "${exp.name}" (${exp.status}, ${exp.variants.length} variants)`);
      created++;
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Created: ${created} experiments`);
    console.log(`   Skipped: ${skipped} experiments (already existed)`);

  } catch (error) {
    console.error('❌ Error seeding experiments:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedExperiments();
