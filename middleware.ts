// middleware.ts — ضيفه في ROOT المشروع (جنب package.json)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// الروتات اللي محتاجة login
const PROTECTED_ROUTES = [
  '/account',
  '/checkout',
]

// الروتات اللي المفروض اليوزر المسجل ما يفتحهاش (login/signup)
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // جيب الـ session الحالية
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // لو الصفحة محمية والمستخدم مش مسجل → روح للـ login
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    // احفظ الصفحة اللي كان رايحلها عشان ترجعه بعد الـ login
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // لو مسجل وبيحاول يفتح login/signup → روحه للـ account
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/account/profile', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * بيشتغل على كل الروتات ماعدا:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - الصور والـ assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}