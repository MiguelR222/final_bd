export const typeDefs = `#graphql 
    type Query {
        me: User
        getEvents: [ExtendedEvent]
        getUsers: [User]
        getEventById(p_id_event: Int!, p_id_user: Int!): Event
        getEventsByUserName(username: String!): [ExtendedEvent]
    }
    
    type Event {
        id_event: Int!
        event_name: String!
        description: String!
        event_start: String!
        event_end: String!
        img_url: String!
        id_event_status: Int!
        id_user: Int!
        id_category: Int!
        location: String!
        visible: Boolean
    }

    type User {
        id_user: Int!
        username: String
        email: String
        visible: Boolean
    }

    type EventStatus {
        id_event_status: Int!
        status_description: String!
    }

    type Category {
        id_category: Int!
        category_name: String!
    }

    type AuthPayload {
        user: User
        token: String
    }

    type ExtendedEvent {
        id_event: Int!
        event_name: String!
        description: String!
        event_start: String!
        event_end: String!
        img_url: String!
        category: String!
        status_description: String!
        username: String!
        location: String!
    }
    
    type CreatedEvent {
            event_name: String!
            description: String!
            event_start: String!
            event_end: String!
            img_url: String!
            id_event_status: Int!
            id_user: Int!
            id_category: Int!
            location: String!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload

        createEvent(
            event_name: String!
            description: String!
            event_start: String!
            event_end: String!
            img_url: String!
            id_event_status: Int!
            id_user: Int!
            id_category: Int!
            location: String!
        ): Event
        
        updateEvent(
            id_event: Int!
            event_name: String!
            description: String!
            event_start: String!
            event_end: String!
            img_url: String!
            id_event_status: Int!
            id_user: Int!
            id_category: Int!
            location: String!
        ): Event
        
        deleteEvent(id_event: Int!): Event

        updateUser(id_user: Int!, username: String): User
        deleteUser(id_user: Int!): User

    }
`;
