import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id_user
        username
        email
        email_verified
        id_provider
        visible
      }
      token
    }
  }
`;

export const REGISTER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    user {
      id_user
      username
      email
      visible
    }
    token
  }
}`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $idEvent: Int!
    $eventName: String!
    $description: String!
    $eventStart: String!
    $eventEnd: String!
    $imgUrl: String!
    $idEventStatus: Int!
    $idUser: Int!
    $idCategory: Int!
    $location: String!
  ) {
    updateEvent(
      id_event: $idEvent
      event_name: $eventName
      description: $description
      event_start: $eventStart
      event_end: $eventEnd
      img_url: $imgUrl
      id_event_status: $idEventStatus
      id_user: $idUser
      id_category: $idCategory
      location: $location
    ) {
      id_event
      event_name
      description
      event_start
      event_end
      img_url
      id_event_status
      id_user
      id_category
      location
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($idEvent: Int!) {
    deleteEvent(id_event: $idEvent) {
      id_event
      event_name
      description
      event_start
      event_end
      img_url
      id_event_status
      id_user
      id_category
      location
      visible
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $eventName: String!
    $description: String!
    $eventStart: String!
    $eventEnd: String!
    $imgUrl: String!
    $idEventStatus: Int!
    $idUser: Int!
    $idCategory: Int!
    $location: String!
  ) {
    createEvent(
      event_name: $eventName
      description: $description
      event_start: $eventStart
      event_end: $eventEnd
      img_url: $imgUrl
      id_event_status: $idEventStatus
      id_user: $idUser
      id_category: $idCategory
      location: $location
    ) {
      event_name
      description
      event_start
      event_end
      img_url
      id_event_status
      id_user
      id_category
      location
    }
  }
`;
