import { OAuth2Client } from "google-auth-library";
import { prisma } from "#/config/database";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  async loginWithGoogle(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Invalid token");

    const { email, name, sub: googleId } = payload;

    let user = await prisma.user.findFirst({
      where: { email },
      include: { store: true },
    });

    if (!user) {
      const store = await prisma.store.create({
        data: {
          name: `${name}'s Store`,
          email,
          password: "",
        },
      });

      user = await prisma.user.create({
        data: {
          name: name || "User",
          email,
          googleId,
          storeId: store.id,
        },
        include: { store: true },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        storeId: user.storeId,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token, user };
  }
}