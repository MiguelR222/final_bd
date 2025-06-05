export interface event {
    id_event: number;
    event_name: string;
    event_start: Date;
    event_end: Date;
    img_url: string;
    id_event_status: number;
    id_user: number;
    id_city: number;
}

export interface user {
    id_user: number;
    user_name: string;
    email: string;
    password: string;
    email_verified: boolean;
    id_provider: number;
}

export interface city {
    id_city: number;
    city_name: string;
    id_state: number;
}

export interface state {
    id_state: number;
    state_name: string;
}

export interface EventWithCategories {
    id_event: number;
    event_name: string;
    description: string;
    event_start: string;      
    event_end: string;        
    img_url: string;
    categories: string[];      
    status_description: string;
    username: string;
    city: string;
  }     