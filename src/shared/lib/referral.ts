// Shared by the login page (which stores the code) and the sign-in route
// (which forwards it to the backend).
export const REFERRAL_COOKIE = "fl_ref";
export const REFERRAL_PARAM = "ref";
export const REFERRAL_CODE = /^[A-Z0-9]{6,12}$/;
export const REFERRAL_COOKIE_DAYS = 30;

export function referralLink(siteUrl: string, code: string): string {
  return `${siteUrl}/entrar?${REFERRAL_PARAM}=${code}`;
}
