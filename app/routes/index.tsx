import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import SubscriptionCard from "~/components/Subscriptions/Cards/HomeCard";
import SubscribeModal from "~/components/Subscriptions/SubscribeModal";
import {
  getFeaturedSubscriptions,
  getTodaysSubscriptions,
  HomepageSubscription,
} from "~/models/subscription.server";

import AppLogo from "../assets/svg/enfes_logo.svg";
import { useOptionalCook, useOptionalUser } from "~/utils";
import FeaturedMealsCarousel from "~/components/Subscriptions/Featured/Carousel";

export async function loader({ request }: LoaderArgs) {
  // const userId = await requireUserId(request);
  const featuredSubscriptions = await getFeaturedSubscriptions();
  const todaysSubscriptions = await getTodaysSubscriptions();
  return json({ featuredSubscriptions, todaysSubscriptions });
}

export default function Index() {
  const user = useOptionalUser();
  const navigate = useNavigate();

  const { featuredSubscriptions, todaysSubscriptions } =
    useLoaderData<typeof loader>();
  const [clickedSubscription, setClickedSubscription] =
    useState<HomepageSubscription>();
  const [mealModalEnabled, setMealModalEnabled] = useState(false);

  useEffect(() => {
    // console.log("subscriptions", subscriptions);
    console.log("featuredSubscriptions", featuredSubscriptions);
  }, [featuredSubscriptions]);

  function handleSubscribeClick(subscription: HomepageSubscription) {
    // if we have user show meal modal
    // else, redirect to login
    if (user) {
      setClickedSubscription(subscription);
      setMealModalEnabled(true);
    } else {
      navigate("/login");
    }
  }

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      {/* 
      button to navigate to /cook/me on top rightmost corner
      */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
        }}
      >
        <img src={AppLogo} width={80} />
      </Link>
      {user && (
        <Link to="/cook/me" className="absolute top-4 right-4">
          <Button
            text="Dashboard"
            variant="primary"
            icon="fluent:food-pizza-20-filled"
          />
        </Link>
      )}
      {!user && (
        <Link to="/login" className="absolute top-4 right-4">
          <Button
            text="Login"
            variant="primary"
            icon="fluent:food-pizza-20-filled"
          />
        </Link>
      )}
      <div className="relative mt-16 sm:pb-16">
        <div className="mx-auto sm:px-6 lg:px-8">
          <FeaturedMealsCarousel subscriptions={featuredSubscriptions} />
        </div>

        <div className="relative mt-16 sm:pb-16 md:mx-4">
          <h3 className="mb-2 ml-4 text-4xl font-bold tracking-tight">
            Around you 📍
          </h3>
          <div className="relative grid grid-cols-1 gap-y-12 gap-x-6 p-4  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {todaysSubscriptions.map((subscription) => (
              <SubscriptionCard
                subscription={subscription}
                handleSubscribeClick={handleSubscribeClick}
                key={subscription.id}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
