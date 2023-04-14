"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendRequestsSidebarOptionProps {
	sessionId: string;
	initialUnseenRequestCount: number;
}

function FriendRequestsSidebarOption({
	sessionId,
	initialUnseenRequestCount,
}: FriendRequestsSidebarOptionProps) {
	const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
		initialUnseenRequestCount
	);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_request`)
		);

		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

		const friendRequestHandler = () => {
			setUnseenRequestCount((prev) => prev + 1);
		};

		const addedFriendHandler = () => {
			setUnseenRequestCount((prev) => prev - 1);
		};

		pusherClient.bind("incoming_friend_request", friendRequestHandler);
		pusherClient.bind("new_friend", addedFriendHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_request`)
			);
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
			pusherClient.unbind("incoming_friend_request", friendRequestHandler);
			pusherClient.unbind("new_friend", addedFriendHandler);
		};
	}, [sessionId]);

	return (
		<Link
			href="/dashboard/requests"
			className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
		>
			<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
				<User className="h-4 w-4" />
			</div>
			<p className="truncate">Friend Requests</p>

			{unseenRequestCount > 0 && (
				<div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
					{unseenRequestCount}
				</div>
			)}
		</Link>
	);
}

export default FriendRequestsSidebarOption;
