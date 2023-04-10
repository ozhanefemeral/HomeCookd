import { useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/server-runtime";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import Address from "~/components/Address/Address";
import CreateAddressModal from "~/components/Address/CreateAddressModal";
import { getSubscriptionOrderById } from "~/models/subscription.server";
import { getUserAddresses } from "~/models/user.server";
import { getUserProfile } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.subscriptionId, "subscriptionId not found");

  const userProfile = await getUserProfile(request);

  invariant(userProfile, "userProfile not found");

  const subscriptionOrder = await getSubscriptionOrderById(
    params.subscriptionId
  );

  const addresses = await getUserAddresses(userProfile.id);

  invariant(subscriptionOrder, "subscriptionOrder not found");
  return json({ subscriptionOrder, addresses });
}

export default function SubscriptionOrder() {
  const data = useLoaderData<typeof loader>();
  const { subscriptionOrder } = data;

  const dateNow = new Date();
  const deliveryDateTime = new Date(subscriptionOrder.deliveryTime);
  const diffTime = Math.abs(deliveryDateTime.getTime() - dateNow.getTime());

  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil((diffTime / (1000 * 60)) % 60);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showCreateAddress, setShowCreateAddress] = useState(false);

  const { addresses } = data;

  const price = useMemo(() => {
    // convert to string
    const totalPrice =
      subscriptionOrder.subscription.meal.price * subscriptionOrder.quantity;
    // if price is flat, add ".00 to end, else; render it as it is"
    if (totalPrice.toString() === totalPrice.toFixed(2)) {
      return totalPrice.toFixed(2) + ",00";
    }
    return totalPrice.toFixed(2).replace(".", ",");
  }, [subscriptionOrder]);

  function handleAddressClick(address: Address) {
    setSelectedAddress(address);
  }

  return (
    <div className="flex gap-16 px-48">
      {showCreateAddress && (
        <CreateAddressModal setOpen={setShowCreateAddress} />
      )}
      {/* delivery hour minus dateNow for how much time left */}
      <div className="w-2/3">
        <h1 className="py-6 text-4xl font-bold">My Cart</h1>

        {/* apply shadow to left only */}
        <div
          className="flex flex-row items-center rounded-3xl bg-[#FDBA7424]"
          style={{
            boxShadow: "-8px 0px 0px #F97316",
          }}
        >
          <div className="py-4 pl-8 ">
            <img
              src={subscriptionOrder.subscription.meal.image}
              alt="meal"
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
          <div className="ml-8 flex flex-grow flex-col">
            <h1 className="text-xl">
              {subscriptionOrder.subscription.cook.name}
            </h1>
            <h1 className="text-3xl font-bold">
              {subscriptionOrder.subscription.meal.title}
            </h1>
            <h1 className="text-xl">{subscriptionOrder.quantity}x</h1>
          </div>
          <div className="flex flex-col items-end justify-center pr-8">
            <h1 className="text-3xl font-bold text-primary">{price} ₺</h1>
          </div>
        </div>

        <h1 className="py-6 text-4xl font-bold">My Address</h1>
        {addresses != null && (
          <div className="grid grid-cols-3 gap-4">
            {addresses.map((address) => (
              <div
                onClick={() => handleAddressClick(address)}
                className="cursor-pointer"
                key={address.id}
              >
                <Address
                  address={address}
                  isSelected={selectedAddress?.id === address.id}
                />
              </div>
            ))}
            <button
              className="rounded-3xl bg-[#FDBA7424] py-8"
              onClick={() => setShowCreateAddress(true)}
            >
              Add new address
            </button>
          </div>
        )}
      </div>
      <div className="mt-[88px] w-1/3 rounded-3xl bg-[#FDBA7424] p-6 flex flex-col">
        <h1 className="text-center text-2xl font-semibold">Total cost</h1>
        <div className="mt-4 grid grid-cols-2">
          {/* 16px, 600fw */}
          <div className="text-lg font-semibold">Subtotal</div>
          <div className="text-right text-lg font-semibold">{price}₺</div>
          <div className="text-lg font-semibold">Delivery</div>
          <div className="text-right text-lg font-semibold">Free</div>
          <div className="text-lg font-semibold">Total</div>
          <div className="text-right text-lg font-semibold">{price}₺</div>
        </div>
        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-3xl bg-primary py-4 font-semibold text-white">
          <svg
            width="21"
            height="14"
            viewBox="0 0 21 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 5V3C19.5 1.89543 18.6046 1 17.5 1H3.5C2.39543 1 1.5 1.89543 1.5 3V5M19.5 5V11C19.5 12.1046 18.6046 13 17.5 13H3.5C2.39543 13 1.5 12.1046 1.5 11V5M19.5 5H1.5M4.5 10H8.5"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Pay
        </button>
      </div>
    </div>
  );
}
