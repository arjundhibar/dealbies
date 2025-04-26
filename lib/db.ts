import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon serverless driver
export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Export a function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    return await sql(sql, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
