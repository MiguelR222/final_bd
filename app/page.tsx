"use client";

import { useQuery } from "@apollo/client";
import { ME } from "@/queries";

export default function Home() {
  // const [login, { data, loading, error }] = useMutation(LOGIN, {
  //   variables: {
  //     email: "carloelperrito@gmail.com",
  //     password: "password",
  //   },
  // });

  // useEffect(() => {
  //   login();
  // }, [login]);

  // useEffect(() => {
  //   if (data?.login?.token) {
  //     console.log("✅ Login successful, token:", data.login.token);
  //     localStorage.setItem("token", data.login.token);
  //   }
  // }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  const { data } = useQuery(ME);
  console.log("User data:", data?.me.username);
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">LiveIt</h1>
    </div>
  );
}
