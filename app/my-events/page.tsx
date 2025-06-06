"use client";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EVENTS_BY_USERNAME, ME } from "@/queries";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DELETE_EVENT } from "@/mutations";

interface Event {
  id_event: number;
  event_name: string;
  event_start: string;
  event_end: string;
  img_url: string;
  username: string;
  category: string;
  location: string;
  description: string;
  status_description: string;
}
function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const [deleteEvent] = useMutation(DELETE_EVENT);

  const handleDeleteEvent = (eventId: number) => () => {
    deleteEvent({ variables: { idEvent: eventId } });
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">
            {event.event_name}
          </CardTitle>
          <Badge
            variant={
              event.status_description === "Active" ? "default" : "secondary"
            }
          >
            {event.status_description}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <UserIcon className="h-3.5 w-3.5" />
          {event.username}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p>Starts: {event.event_start}</p>
              <p>Ends: {event.event_end}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <p className="text-sm mt-2">{event.description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Badge variant="outline" className="mr-2">
          {event.category}
        </Badge>
        <Button
          onClick={handleDeleteEvent(event.id_event)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </Button>
        <Button
          onClick={() => router.push(`/update-event?id=${event.id_event}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Event
        </Button>
      </CardFooter>
    </Card>
  );
}

function EventGrid({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id_event} event={event} />
      ))}
    </div>
  );
}

export default function MyEventsPage() {
  const { data: userData } = useQuery(ME);
  console.log("User data:", userData?.me.username);

  const username = userData?.me.username;

  const {
    loading,
    error,
    data: eventsData,
  } = useQuery(GET_EVENTS_BY_USERNAME, {
    variables: { username },
    skip: !username,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Events data:", eventsData?.getEventsByUserName);

  const events = eventsData?.getEventsByUserName || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      <EventGrid events={events} />
    </div>
  );
}
