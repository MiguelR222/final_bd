import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
    query Query {
      getEvents {
        id_event
        event_name
        event_start
        event_end
        img_url
        id_event_status
        id_user
        id_city
      }
    } `
  ;
