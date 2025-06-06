"use client";
import { useQuery } from "@apollo/client";
import { GET_EVENTS} from "@/queries";
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
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function EventsPage() {
    const router = useRouter();
  const {
    loading,
    error,
    data: eventsData,
  } = useQuery(GET_EVENTS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);
        

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(eventsData);
  console.log("Events data:", eventsData?.getEvents);

  const events = eventsData?.getEvents || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      <EventGrid events={events} />
    </div>
  );
}