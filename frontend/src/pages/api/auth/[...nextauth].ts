import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

console.log('Credentials',process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET)

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret:process.env.NEXTAUTH_SECRET
})