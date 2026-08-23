import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gatrai.id";
  const password = "Password123%";
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("🌱 Seeding super admin account...");

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      name: "Super Admin",
      isVerified: true,
    },
    create: {
      email,
      name: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ Super Admin account ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
