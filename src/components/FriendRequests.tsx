"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { X } from "lucide-react";
import { Check, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FriendRequestsPage {
	incomingFriendRequests: IncomingFriendRequest[];
	sessionId: string;
}

function FriendRequests({
	incomingFriendRequests,
	sessionId,
}: FriendRequestsPage) {
	const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
		incomingFriendRequests
	);

	const router = useRouter();

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_request`)
		);

		const friendRequestHandler = ({
			senderId,
			senderEmail,
		}: IncomingFriendRequest) => {
			setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
		};

		pusherClient.bind("incoming_friend_request", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_request`)
			);
			pusherClient.unbind("incoming_friend_request", friendRequestHandler);
		};
	}, []);

	const acceptFriend = async (senderId: string) => {
		await axios.post("/api/friends/accept", { id: senderId });

		setFriendRequests((prev) =>
			prev.filter((request) => senderId !== request.senderId)
		);

		router.refresh();
	};

	const rejectFriend = async (senderId: string) => {
		await axios.post("/api/friends/reject", { id: senderId });

		setFriendRequests((prev) =>
			prev.filter((request) => senderId !== request.senderId)
		);

		router.refresh();
	};

	return (
		<>
			{friendRequests.length === 0 ? (
				<p className="text-sm text-slate-500">Nothing to show here...</p>
			) : (
				friendRequests.map((request) => (
					<div key={request.senderId} className="flex items-center gap-4">
						<UserPlus className="text-black" />
						<p className="text-lg font-medium">{request.senderEmail}</p>
						<button
							onClick={() => acceptFriend(request.senderId)}
							aria-label="accept friend"
							className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md"
						>
							<Check className="h-3/4 w-3/4 font-semibold text-white" />
						</button>
						<button
							onClick={() => rejectFriend(request.senderId)}
							aria-label="reject friend"
							className="grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
						>
							<X className="h-3/4 w-3/4 font-semibold text-white" />
						</button>
					</div>
				))
			)}
		</>
	);
}

export default FriendRequests;
