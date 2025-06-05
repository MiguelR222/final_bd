'use client'
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "../queries";

export default function Home() {
  const {data} = useQuery(GET_EVENTS);
  console.log(data);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">LiveIt</h1>
    </div>
  );
}
