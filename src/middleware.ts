import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	async function middleware(req) {
		const pathname = req.nextUrl.pathname;

		// Manage route protection
		const isAuth = await getToken({ req });
		const isLoginPage = pathname.startsWith("/login");

		const protectedRoutes = ["/dashboard"];
		const isAccessingProtectedRoute = protectedRoutes.some((route) =>
			pathname.startsWith(route)
		);

		// If user is logged in, but on login page then redirect to dashboard
		if (isLoginPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
			return NextResponse.next();
		}

		// If user is not logged in, but accessing protected routes
		if (!isAuth && isAccessingProtectedRoute) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// If user is trying to access our homepage, redirect to dashboard
		if (pathname === "/") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	},
	{
		callbacks: {
			async authorized() {
				return true;
			},
		},
	}
);

export const config = {
	matcher: ["/", "/login", "/dashboard/:path*"],
};
