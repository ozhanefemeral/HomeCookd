import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireCookId } from "~/session.server";
import { useCook } from "~/utils";
import { getCookSubscriptions } from "~/models/subscription.server";

// days of week in small letters
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// TODO
// AUTOMATICALLY NAVIGATE TO THAT DAY OF THE WEEK

export default function SubscriptionsPage() {
  const cook = useCook();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Subscriptions</Link>
        </h1>
        <p>{cook.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
