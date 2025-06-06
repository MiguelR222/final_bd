"use client";

import type React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ME } from "@/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CREATE_EVENT } from "@/mutations";

function datetimeLocalToTimestamp(datetime: string): string {
  const date = new Date(datetime);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export default function CreateEventPage() {
  const router = useRouter();

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME);
  const user_id = userData?.me?.id_user;


  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_start: "",
    event_end: "",
    location: "",
    img_url: "",
    id_category: 1,
    id_event_status: 1,
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [createEvent, { loading: createLoading }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      setNotification({
        type: "success",
        message: "Event created successfully!",
      });
      setTimeout(() => {
        router.push("/my-events");
      }, 2000);
    },
    onError: (error) => {
      setNotification({
        type: "error",
        message: `Failed to create event: ${error.message}`,
      });
      console.error("Create error:", error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "id_category" || name === "id_event_status"
          ? Number.parseInt(value) || 1
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user_id) {
      setNotification({
        type: "error",
        message: "User not authenticated",
      });
      return;
    }

    try {
      await createEvent({
        variables: {
          eventName: formData.event_name,
          description: formData.description,
          eventStart: datetimeLocalToTimestamp(formData.event_start),
          eventEnd: datetimeLocalToTimestamp(formData.event_end),
          location: formData.location,
          imgUrl: formData.img_url,
          idCategory: formData.id_category,
          idEventStatus: formData.id_event_status,
          idUser: user_id,
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error: {userError.message}</p>
      </div>
    );
  }

  if (!user_id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please log in to create an event</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new event
          </CardDescription>
          {notification.type && (
            <div
              className={`p-4 rounded-md mb-4 ${
                notification.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {notification.message}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="event_name">Event Name</Label>
              <Input
                id="event_name"
                name="event_name"
                value={formData.event_name}
                onChange={handleInputChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event_start">Start Date & Time</Label>
                <Input
                  id="event_start"
                  name="event_start"
                  type="datetime-local"
                  value={formData.event_start}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="event_end">End Date & Time</Label>
                <Input
                  id="event_end"
                  name="event_end"
                  type="datetime-local"
                  value={formData.event_end}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="img_url">Image URL</Label>
              <Input
                id="img_url"
                name="img_url"
                type="text"
                value={formData.img_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id_category">Category ID</Label>
                <Input
                  id="id_category"
                  name="id_category"
                  type="number"
                  value={formData.id_category}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_event_status">Status ID</Label>
                <Input
                  id="id_event_status"
                  name="id_event_status"
                  type="number"
                  value={formData.id_event_status}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={createLoading}>
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
