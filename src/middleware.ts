import { withAuth } from 'next-auth/middleware'

// This middleware protects all routes under /dashboard
// If user is not logged in, they will be redirected to /login
export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/dashboard/:path*']
}
