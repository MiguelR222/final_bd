export const typeDefs = `#graphql 
    type Query {
        getEvents: [Event]
        getUsers: [User]
        getCities: [City]
        getStates: [State]
        getEventById(id_event: Int!): ExtendedEvent
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
        id_city: Int!
    }

    type User {
        id_user: Int!
        username: String
        email: String
        password: String
        email_verified: Boolean
        id_provider: Int
    }

    type City {
        id_city: Int!
        city_name: String
        id_state: Int
        state: State
    }

    type State {
        id_state: Int!
        state_name: String
    }

    type EventStatus {
        id_event_status: Int!
        status_description: String!
    }

    type Category {
        id_category: Int!
        category_name: String!
    }
    
    type ExtendedEvent {
        id_event: Int!
        event_name: String!
        description: String!
        event_start: String!
        event_end: String!
        img_url: String!
        categories: String!
        status_description: String!
        username: String!
        city: String!
    }

    type Mutation {
        createEvent(
            event_name: String!
            description: String!
            event_start: String!
            event_end: String!
            img_url: String!
            id_event_status: Int!
            id_user: Int!
            id_city: Int!
            categoryIds: [Int!]
        ): Event
        
        updateEvent(
            id_event: Int!
            event_name: String
            description: String
            event_start: String
            event_end: String
            img_url: String
            id_event_status: Int
            id_city: Int
            categoryIds: [Int!]
        ): Event
        
        deleteEvent(id_event: Int!): Event

        addUser(username: String, email: String, password: String, email_verified: Boolean, id_provider: Int): User
        updateUser(id_user: Int!, username: String, email: String, password: String, email_verified: Boolean, id_provider: Int): User
        deleteUser(id_user: Int!): User

        addCity(city_name: String, id_state: Int): City
        updateCity(id_city: Int!, city_name: String, id_state: Int): City
        deleteCity(id_city: Int!): City

        addState(state_name: String): State
        updateState(id_state: Int!, state_name: String): State
        deleteState(id_state: Int!): State
    }
`;
