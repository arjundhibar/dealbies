const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Function to execute commands and log output
function runCommand(command) {
  console.log(`Running: ${command}`)
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Command failed: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

// Check if Prisma schema exists
const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")
if (!fs.existsSync(schemaPath)) {
  console.error("Prisma schema not found at:", schemaPath)
  process.exit(1)
}

// Generate Prisma client
console.log("Generating Prisma client...")
runCommand("npx prisma generate")

// Build Next.js app
console.log("Building Next.js app...")
runCommand("next build")

console.log("Build completed successfully!")
