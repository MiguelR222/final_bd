"use client";

import { Suspense } from "react";
import UpdateForm from "@/components/update-form";

export default function UpdateEventPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Update Event</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <UpdateForm />
      </Suspense>
    </div>
  );
}
