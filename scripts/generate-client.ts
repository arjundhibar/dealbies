import { execSync } from "child_process"
import path from "path"
import fs from "fs"

// Path to the Prisma schema
const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")

// Check if the schema exists
if (!fs.existsSync(schemaPath)) {
  console.error("Prisma schema not found at:", schemaPath)
  process.exit(1)
}

try {
  // Generate the Prisma client
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma client generated successfully")
} catch (error) {
  console.error("Failed to generate Prisma client:", error)
  process.exit(1)
}
