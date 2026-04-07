import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.service";

import SubscriptionPlansClient from "@/components/modules/subscription/SubscriptionPlansClient";
import { getMySubscriptionAction } from "./_action";


export const metadata = {
  title: "Subscription Plans — CineTube",
};

export default async function SubscriptionPage() {
  const user = await getUserInfo();
  if (!user) redirect("/login");

  const res = await getMySubscriptionAction();
  const currentSub = res.success ? res.data : null;

  return <SubscriptionPlansClient currentSub={currentSub} />;
}
