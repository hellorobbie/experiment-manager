import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  console.log("Created user:", user.email);

  // Create a sample experiment
  const experiment = await prisma.experiment.create({
    data: {
      name: "Homepage Hero Test",
      description: "Testing new hero image vs current design",
      hypothesis: "A more vibrant hero image will increase sign-up conversion",
      ownerId: user.id,
      status: "DRAFT",
      primaryKPI: "signup_conversion_rate",
      targeting: JSON.stringify({
        device: ["desktop", "mobile"],
        country: ["US", "CA"],
      }),
      variants: {
        create: [
          {
            name: "Control",
            description: "Current hero image",
            trafficPercentage: 50,
            isControl: true,
          },
          {
            name: "Treatment",
            description: "New vibrant hero image",
            trafficPercentage: 50,
            isControl: false,
          },
        ],
      },
    },
  });

  // Create audit log for experiment creation
  await prisma.auditLog.create({
    data: {
      action: "created",
      experimentId: experiment.id,
      userId: user.id,
      changes: JSON.stringify({}),
    },
  });

  console.log("Created sample experiment:", experiment.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
