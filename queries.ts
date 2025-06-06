import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
query Query {
  getEvents {
    id_event
    event_name
    description
    event_start
    event_end
    img_url
    category
    status_description
    username
    location
  }
}
`;

export const ME = gql`
  query Me {
    me {
      id_user
      username
      email
    }
  }
`;

export const GET_EVENTS_BY_USERNAME = gql`
  query GetEventsByUserName($username: String!) {
    getEventsByUserName(username: $username) {
      id_event
      event_name
      description
      event_start
      event_end
      img_url
      category
      status_description
      username
      location
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($pIdEvent: Int!, $pIdUser: Int!) {
    getEventById(p_id_event: $pIdEvent, p_id_user: $pIdUser) {
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
