import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Protect the /admin routes
      if (req.nextUrl.pathname.startsWith('/admin')) {
        // Require the user to be logged in and have the 'admin' role
        // The role is assigned in the jwt callback based on the email 'l3onsaiii@gmail.com'
        return token?.role === "admin";
      }
      
      // Default behavior for other routes (allow access)
      return true;
    },
  },
});

// Specify the routes that should be processed by the middleware
export const config = {
  matcher: ["/admin/:path*"],
};
