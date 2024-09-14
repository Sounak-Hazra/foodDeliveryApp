import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password",placeholder:"Password" }
      },
      async authorize(credentials) {
        const iscorrectUsername = credentials.username === process.env.USER_NAME
        const iscorrectPassword = credentials.password === process.env.PASSWORD

        if (iscorrectUsername && iscorrectPassword) {
          return { name: credentials.username, isverified: true,admin:true }
        } else {
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (token) {
        session.username = token.username
        session.isverified = token.isverified
        session.admin = token.admin
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.name
        token.isverified = user.isverified
        token.admin = user.admin

      }
      return token
    }
  },

  secret: process.env.NEXT_SECRET,
}
const handler = NextAuth(authOptions)


export {handler as GET, handler as  POST}