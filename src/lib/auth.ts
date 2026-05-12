import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
  }
  return secret;
};

export const signJwtToken = async (payload: { id: string; email: string; role: string }) => {
  const secret = new TextEncoder().encode(getJwtSecretKey());
  const alg = "HS256";

  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export const verifyJwtToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
};

export const getUserFromRequest = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const verifiedToken = await verifyJwtToken(token);
  return verifiedToken;
};
