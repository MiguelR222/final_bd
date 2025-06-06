"use client";

import type React from "react";

import { GET_EVENT_BY_ID, ME } from "@/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { UPDATE_EVENT } from "@/mutations";

interface Event {
  description: string;
  event_end: string;
  event_name: string;
  event_start: string;
  id_category: number;
  id_event: number;
  id_event_status: number;
  id_user: number;
  img_url: string;
  location: string;
}

function timestampToDatetimeLocal(timestamp: string): string {
  const date = new Date(Number.parseInt(timestamp));
  return date.toISOString().slice(0, 16);
}

function datetimeLocalToTimestamp(datetime: string): string {
  const date = new Date(datetime);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export default function UpdateForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME);
  const user_id = userData?.me?.id_user;

  const {
    loading: eventLoading,
    error: eventError,
    data: eventsData,
  } = useQuery(GET_EVENT_BY_ID, {
    variables: { pIdEvent: Number(id), pIdUser: user_id },
    skip: !user_id || !id,
  });

  const event: Event = eventsData?.getEventById;

  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_start: "",
    event_end: "",
    location: "",
    img_url: "",
    id_category: 0,
    id_event_status: 0,
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [updateEvent, { loading: updateLoading }] = useMutation(UPDATE_EVENT, {
    onCompleted: (data) => {
      try {
        if (data && typeof data === "object") {
          setNotification({
            type: "success",
            message: "Event updated successfully!",
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error processing response:", error);
        setNotification({
          type: "error",
          message: "Failed to process server response",
        });
      }
    },
    onError: (error) => {
      console.error("Update error details:", {
        message: error.message,
        networkError: error.networkError,
        graphQLErrors: error.graphQLErrors,
        extraInfo: error.extraInfo,
      });
      setNotification({
        type: "error",
        message: `Failed to update event: ${error.message}`,
      });
    },
  });

  useEffect(() => {
    if (event) {
      setFormData({
        event_name: event.event_name || "",
        description: event.description || "",
        event_start: timestampToDatetimeLocal(event.event_start),
        event_end: timestampToDatetimeLocal(event.event_end),
        location: event.location || "",
        img_url: event.img_url || "",
        id_category: event.id_category || 0,
        id_event_status: event.id_event_status || 0,
      });
    }
  }, [event]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "id_category" || name === "id_event_status"
          ? Number.parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event) return;

    if (
      !formData.event_name ||
      !formData.event_start ||
      !formData.event_end ||
      !formData.location
    ) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    try {

      const mutationVariables = {
        idEvent: Number(event.id_event),
        eventName: String(formData.event_name),
        description: String(formData.description || ""),
        eventStart: datetimeLocalToTimestamp(formData.event_start),
        eventEnd: datetimeLocalToTimestamp(formData.event_end),
        location: String(formData.location),
        imgUrl: String(formData.img_url || ""),
        idCategory: Number(formData.id_category),
        idEventStatus: Number(formData.id_event_status),
        idUser: Number(user_id),
      };
      await updateEvent({
        variables: mutationVariables,
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (userLoading || eventLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (userError || eventError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Error: {userError?.message || eventError?.message}
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Update Event</CardTitle>
          <CardDescription>
            Update the details for event ID: {id}
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
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
