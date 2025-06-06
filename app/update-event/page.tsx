"use client";

import { Suspense } from "react";
import UpdateForm from "@/components/update-form";
import { Loader2 } from "lucide-react";

export default function UpdateEventPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Update Event</h1>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"> <Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <UpdateForm />
      </Suspense>
    </div>
  );
}
