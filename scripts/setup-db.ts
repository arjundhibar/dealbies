import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Setting up database...")

  // Check if database is accessible
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log("Database connection successful")
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }

  console.log("Database setup complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
