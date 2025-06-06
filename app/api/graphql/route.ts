import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/typeDefs";
import db from "@/lib/db";
import { verifyJwt } from "@/lib/jwt";

export type Context = {
  db: typeof db;
  req: NextRequest;
  user?: { id_user: number; email: string };
};

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const cookie = req.cookies.get("token")?.value;
    const header = req.headers.get("authorization")?.split(" ")[1];

    const token = cookie || header;
    let user: { id_user: number; email: string } | undefined = undefined;

    const payload = token ? verifyJwt(token) : undefined;
    if (
      payload &&
      typeof payload === "object" &&
      "id_user" in payload &&
      "email" in payload
    ) {
      user = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id_user: (payload as any).id_user,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: (payload as any).email,
      };
    }

    return {
      req,
      db,
      user,
    };
  },
});

export { handler as GET, handler as POST };
