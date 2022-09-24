import NextAuth from 'next-auth'

import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>',
    // }),
    // ...add more providers here
  ],
  // session: {
  //   jwt: true,
  // },
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   // error: '/auth/error', // Error code passed in query string as ?error=
  //   // verifyRequest: '/auth/verify-request', // (used for check email message)
  //   // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
}

export default NextAuth(authOptions)
