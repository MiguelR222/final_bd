import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/typeDefs";
import db from "@/lib/db"; // Your knex instance

export type Context = {
  db: typeof db;
  req: NextRequest;
};

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => ({ req, db }),
});

export { handler as GET, handler as POST };
