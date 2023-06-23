import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const newAdmin = await prisma.user.upsert({
    where: { email: "felipe.vidal@mesquita.rj.gov.br" },
    update: {},
    create: {
      email: "felipe.vidal@mesquita.rj.gov.br",
      name: "Felipe Vidal",
      password: await bcrypt.hash(process.env.DEFAULT_PASSWORD ? process.env.DEFAULT_PASSWORD : "secret", 10),
      role: "SUPERADMIN",
      updated_at: null,
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
