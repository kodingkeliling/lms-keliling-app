import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@lmskeliling.id";
    const password = "Password123%";
    const passwordHash = await bcrypt.hash(password, 12);

    console.log("🌱 Seeding super admin account...");

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role: "SUPER_ADMIN",
            name: "Super Admin",
            isVerified: true,
        },
        create: {
            email,
            passwordHash,
            role: "SUPER_ADMIN",
            name: "Super Admin",
            isVerified: true,
        },
    });

    console.log(`✅ Super admin ready: ${user.email} (role: ${user.role})`);
    console.log(`   Email   : ${email}`);
    console.log(`   Password: ${password}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
