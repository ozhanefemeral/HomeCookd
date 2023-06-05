import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/Button";
import { useUser } from "~/utils";

// TODO
// AUTOMATICALLY NAVIGATE TO THAT DAY OF THE WEEK

export default function SubscriptionsPage() {
  const user = useUser();
  const navigate = useNavigate();

  function goToSubscriptions(){
    navigate("/cook/me/subscriptions")
  }

  function goToMeals(){
    navigate("/cook/me/meals")
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="p-4">
        <ul className="flex flex-col gap-2">
          <li>
              {/* replace Link with Button */}
              <Button text="Your subscriptions" onClick={goToSubscriptions} variant="primary" />
          </li>
          <li>
            <Button text="Your meals" onClick={goToMeals} variant="primary" />
          </li>
        </ul>

        <div className="flex-1 pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
