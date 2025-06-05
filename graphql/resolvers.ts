import { Context } from "@/app/api/graphql/route";

export const resolvers = {
  Query: {
    getEvents: async (_parent: any, _args: any, context: Context) => {
      return await context.db("events");
    },
    getUsers: async (_parent: any, _args: any, context: Context) => {
      return await context.db("users");
    },
    getCities: async (_parent: any, _args: any, context: Context) => {
      return await context.db("city").join("state", "city.id_state", "state.id_state");
    },
    getStates: async (_parent: any, _args: any, context: Context) => {
      return await context.db("state");
    },
    getEventById: async (_parent: any, { id_event }: { id_event: number }, context: Context) => {
      const event = await context.db("event")
        .where({ id_event })
        .first()
        .leftJoin("user", "event.id_user", "user.id_user")
        .leftJoin("city", "event.id_city", "city.id_city")
        .leftJoin("state", "city.id_state", "state.id_state")
        .leftJoin("event_status", "event.id_event_status", "event_status.id_event_status");

      if (!event) throw new Error("Event not found");

      const categories = await context.db("event_category")
        .join("category", "event_category.id_category", "category.id_category")
        .where({ id_event })
        .select("category.category_name");

      return {
        ...event,
        categories: categories.map(c => c.category_name).join(", "),
        status_description: event.status_description,
        username: event.username,
        city: event.city_name,
      };
    },
  },

  Mutation: {
    createEvent: async (_parent: any, args: any, context: Context) => {
      const [event] = await context.db("event").insert({
        event_name: args.event_name,
        description: args.description,
        event_start: new Date(args.event_start),
        event_end: new Date(args.event_end),
        img_url: args.img_url,
        id_event_status: args.id_event_status,
        id_user: args.id_user,
        id_city: args.id_city,
      }).returning("*");

      if (args.categoryIds?.length) {
        const categories = args.categoryIds.map((id: number) => ({
          id_event: event.id_event,
          id_category: id,
        }));
        await context.db("event_category").insert(categories);
      }

      return event;
    },

    updateEvent: async (_parent: any, args: any, context: Context) => {
      const { id_event, categoryIds, ...data } = args;

      if (data.event_start) data.event_start = new Date(data.event_start);
      if (data.event_end) data.event_end = new Date(data.event_end);

      const [event] = await context.db("event")
        .where({ id_event })
        .update(data)
        .returning("*");

      if (categoryIds) {
        await context.db("event_category").where({ id_event }).del();
        const categories = categoryIds.map((id: number) => ({
          id_event,
          id_category: id,
        }));
        await context.db("event_category").insert(categories);
      }

      return event;
    },

    deleteEvent: async (_parent: any, { id_event }: { id_event: number }, context: Context) => {
      return await context.db("event").where({ id_event }).del();
    },

    addUser: async (_parent: any, args: any, context: Context) => {
      const [user] = await context.db("user").insert(args).returning("*");
      return user;
    },

    updateUser: async (_parent: any, args: any, context: Context) => {
      const { id_user, ...data } = args;
      const [user] = await context.db("user").where({ id_user }).update(data).returning("*");
      return user;
    },

    deleteUser: async (_parent: any, { id_user }: { id_user: number }, context: Context) => {
      return await context.db("user").where({ id_user }).del();
    },

    addCity: async (_parent: any, args: any, context: Context) => {
      const [city] = await context.db("city").insert(args).returning("*");
      return city;
    },

    updateCity: async (_parent: any, args: any, context: Context) => {
      const { id_city, ...data } = args;
      const [city] = await context.db("city").where({ id_city }).update(data).returning("*");
      return city;
    },

    deleteCity: async (_parent: any, { id_city }: { id_city: number }, context: Context) => {
      return await context.db("city").where({ id_city }).del();
    },

    addState: async (_parent: any, args: any, context: Context) => {
      const [state] = await context.db("state").insert(args).returning("*");
      return state;
    },

    updateState: async (_parent: any, args: any, context: Context) => {
      const { id_state, ...data } = args;
      const [state] = await context.db("state").where({ id_state }).update(data).returning("*");
      return state;
    },

    deleteState: async (_parent: any, { id_state }: { id_state: number }, context: Context) => {
      return await context.db("state").where({ id_state }).del();
    },
  },
};
