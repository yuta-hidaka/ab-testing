import { type NextRequest, NextResponse } from 'next/server';

// make sure the middleware only runs when
// the requested url starts with `/templates`
export const config = {
  matcher: ['/'],
};

const THRESHOLD = 0.5; // initial threshold for the new variant (20%)
const COOKIE_NAME = 'ab-testing-cookie'; // name of the cookie to store the variant

export function middleware(req: NextRequest) {
  // get the variant from the cookie
  // if not found, randomly set a variant based on threshold
  const variant =
    req.cookies.get(COOKIE_NAME)?.value || (Math.random() < THRESHOLD ? 'new' : 'old');

    console.log("middleware variant", variant);

  const url = req.nextUrl.clone();

  // if it's the old variant, rewrite to the old templates marketplace
  if (variant === 'old') {
    url.pathname = '/b'; // rewrite
  } else {
    url.pathname = '/a'; // rewrite
  }

  const res = NextResponse.rewrite(url);

  // set the variant in the cookie if not already set
  if (!req.cookies.get(COOKIE_NAME)) {
    res.cookies.set(COOKIE_NAME, variant as string);
  }
  return res;
}
