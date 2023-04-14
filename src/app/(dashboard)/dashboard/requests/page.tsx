import { fetchRedis } from "@/app/helpers/redis";
import FriendRequests from "@/components/FriendRequests";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

async function FriendRequestsPage() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	// Ids of people who sent the current user a friend request...
	const incomingSenderIds = (await fetchRedis(
		"smembers",
		`user:${session.user.id}:incoming_friend_request`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingSenderIds.map(async (senderId) => {
			const senderResult = (await fetchRedis("get", `user:${senderId}`)) as string;
			const sender = JSON.parse(senderResult)
			
			return {
				senderId,
				senderEmail: sender.email,
			};
		})
	);
	return (
		<main className="pt-8">
			<h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
            </div>
		</main>
	);
}

export default FriendRequestsPage;
