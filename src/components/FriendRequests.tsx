"use client";
import { X } from "lucide-react";
import { Check, UserPlus } from "lucide-react";
import React, { useState } from "react";

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
    
	return (
		<>
			{friendRequests.length === 0 ? (
				<p className="text-sm text-slate-500">Nothing to show here...</p>
			) : (
				friendRequests.map((request) => (
					<div key={request.senderId} className="flex gap-4 items-center">
						<UserPlus className="text-black" />
						<p className="font-medium text-lg">{request.senderEmail}</p>
						<button
							aria-label="accept friend"
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<Check className="font-semibold text-white w-3/4 h-3/4" />
						</button>
                        <button
							aria-label="reject friend"
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<X className="font-semibold text-white w-3/4 h-3/4" />
						</button>
					</div>
				))
			)}
		</>
	);
}

export default FriendRequests;
