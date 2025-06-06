"use client";

import { useQuery } from "@apollo/client";
import { ME } from "@/queries";

export default function Home() {

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">LiveIt</h1>
    </div>
  );
}
