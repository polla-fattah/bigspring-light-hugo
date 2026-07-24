import { auth } from './auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');
  const isOnLogin = req.nextUrl.pathname === '/admin/login';

  if (isOnDashboard) {
    if (isLoggedIn) return; // Continue execution
    return Response.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/admin/dashboard', req.nextUrl));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
