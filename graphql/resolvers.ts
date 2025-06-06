import { Context } from "@/app/api/graphql/route";
import bcrypt from "bcrypt";
import { signJwt } from "@/lib/jwt";

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterArgs {
  username: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      const userFromToken = context.user;
      console.log("User from token:", userFromToken);
      if (!userFromToken) {
        throw new Error("Not authenticated");
      }

      const user = await context
        .db("users")
        .where({ id_user: userFromToken.id_user })
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
    getEventsByUserName: async (
      _parent: any,
      { username }: { username: string },
      context: Context,
    ) => {
      console.log("Fetching events for user:", username);
      const events = await context.db.raw(
        `call sp_get_events_by_user('${username}')`,
      );
      console.log("eventos", events[0][0]);
      return events[0][0];
    },
    getEvents: async (_parent: any, _args: any, context: Context) => {
      return await context.db("events");
    },
    getUsers: async (_parent: any, _args: any, context: Context) => {
      return await context.db("users");
    },
    getEventById: async (
      _parent: any,
      { p_id_event, p_id_user }: { p_id_event: number; p_id_user: number },
      context: Context,
    ) => {
      const event = await context.db.raw(
        `call sp_get_detailed_event(${p_id_event}, ${p_id_user})`,
      );

      if (!event) throw new Error("Event not found");

      return event[0][0][0];
    },
  },

  Mutation: {
    login: async (
      _: any,
      { email, password }: AuthPayload,
      context: Context,
    ) => {
      const user = await context.db("users").where({ email }).first();

      console.log("User found:", user.password);

      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = signJwt({ id_user: user.id_user, email: user.email });

      return {
        user: {
          id_user: user.id_user,
          username: user.username,
          email: user.email,
          email_verified: user.email_verified,
          id_provider: user.id_provider,
        },
        token,
      };
    },
    register: async (
      _: any,
      { username, email, password }: RegisterArgs,
      context: Context,
    ) => {
      const existingEmail = await context.db("users").where({ email }).first();

      if (existingEmail) {
        throw new Error("Email is already registered");
      }

      const existingUsername = await context
        .db("users")
        .where({ username })
        .first();

      if (existingUsername) {
        throw new Error("Username is already taken");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await context.db("users").insert({
        username,
        email,
        password: hashedPassword
      });

      const user = await context.db("users").where({ email }).first();

      const token = signJwt({ id_user: user.id_user, email });

      return {
        user: {
          id_user: user.id_user,
          username: user.username,
          email: user.email
        },
        token,
      };
    },
    createEvent: async (
      _: any,
      {
        event_name,
        description,
        event_start,
        event_end,
        img_url,
        id_event_status,
        id_user,
        id_category,
        location,
      }: {
        event_name: string;
        description: string;
        event_start: string;
        event_end: string;
        img_url: string;
        id_event_status: number;
        id_user: number;
        id_category: number;
        location: string;
      },
      context: Context,
    ) => {
      const [id_event] = await context.db("events").insert({
        event_name,
        description,
        event_start,
        event_end,
        img_url,
        id_event_status,
        id_user,
        id_category,
        location,
      });

      const createdEvent = await context
        .db("events")
        .where({ id_event })
        .first();
      console.log("Created event:", createdEvent);
      return createdEvent;
    },

    updateEvent: async (
      _: any,
      {
        id_event,
        event_name,
        description,
        event_start,
        event_end,
        img_url,
        id_event_status,
        id_user,
        id_category,
        location,
      }: {
        id_event: number;
        event_name: string;
        description: string;
        event_start: string;
        event_end: string;
        img_url: string;
        id_event_status: number;
        id_user: number;
        id_category: number;
        location: string;
      },
      context: Context,
    ) => {
      const eventExists = await context
        .db("events")
        .where({ id_event })
        .first();

      if (!eventExists) {
        throw new Error(`Event with id ${id_event} not found.`);
      }

      await context.db("events").where({ id_event }).update({
        event_name,
        description,
        event_start,
        event_end,
        img_url,
        id_event_status,
        id_user,
        id_category,
        location,
      });

      const updatedEvent = await context
        .db("events")
        .where({ id_event })
        .first();

      return updatedEvent;
    },

    deleteEvent: async (
      _: any,
      { id_event }: { id_event: number },
      context: Context,
    ) => {
      await context.db("events").where({ id_event }).update({ visible: 0 });

      const deletedEvent = await context
        .db("events")
        .where({ id_event })
        .first();
      if (!deletedEvent) {
        throw new Error(`Event with id ${id_event} not found.`);
      }
      return deletedEvent
    },

    updateUser: async (_: any,{ id_user, username }:{id_user: number, username : string}, context: Context) => {
      await context
        .db("users")
        .where({ id_user })
        .update({username})
      const user = await context.db("users").where({ id_user }).first();
      return user;
    },

    deleteUser: async (
      _parent: any,
      { id_user }: { id_user: number },
      context: Context,
    ) => {
      await context.db("users").where({ id_user }).update({ visible: 0 });

      const deletedUser = await context.db("users").where({ id_user }).first();
      if (!deletedUser) {
        throw new Error(`User with id ${id_user} not found.`);
      }
      return deletedUser
    },
  },
};
