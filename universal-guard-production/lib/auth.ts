import { SignJWT, jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(process.env.AUTH_SECRET || "dev_secret_change_me");

export type AuthUser = {
  id: number;
  username: string;
  role: string;
};

export async function signToken(user: AuthUser) {
  return new SignJWT({
    id: user.id,
    username: user.username,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());

    return {
      id: Number(payload.id),
      username: String(payload.username),
      role: String(payload.role)
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request) {
  const auth = req.headers.get("authorization");

  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }

  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )guard_token=([^;]+)/);

  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1]);
}

export async function requireAuth(req: Request) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
