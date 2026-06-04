const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("admin123", 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { passwordHash, role: "owner" },
    create: {
      username: "admin",
      passwordHash,
      role: "owner"
    }
  });

  await prisma.player.upsert({
    where: { accountName: "account001" },
    update: {},
    create: {
      accountName: "account001",
      characterName: "RogueBlade",
      level: 110,
      gold: 945000000n,
      ipAddress: "185.22.10.4",
      status: "active",
      notes: "Trusted player"
    }
  });

  await prisma.player.upsert({
    where: { accountName: "account002" },
    update: {},
    create: {
      accountName: "account002",
      characterName: "MoonWizard",
      level: 98,
      gold: 120000000n,
      ipAddress: "185.22.10.5",
      status: "active"
    }
  });

  await prisma.player.upsert({
    where: { accountName: "account003" },
    update: {},
    create: {
      accountName: "account003",
      characterName: "GoldTrader",
      level: 80,
      gold: 2500000000n,
      ipAddress: "91.10.45.8",
      status: "flagged",
      notes: "High gold movement"
    }
  });

  console.log("Seed complete.");
  console.log("Login: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
