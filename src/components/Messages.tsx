"use client";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface MessagesProps {
	initialMessages: Message[];
	sessionId: string;
	sessionImage: string | null | undefined;
	chatPartner: User;
	chatId: string;
}

function Messages({
	initialMessages,
	sessionId,
	chatPartner,
	sessionImage,
	chatId,
}: MessagesProps) {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const scrollDownRef = useRef<HTMLDivElement | null>(null);

	const formatTimestamp = (timestamp: number) => {
		return format(timestamp, "HH:mm");
	};

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

		const messageHandler = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};

		pusherClient.bind("incoming-message", messageHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
			pusherClient.unbind("incoming-message", messageHandler);
		};
	}, [chatId]);

	return (
		<div
			id="messages"
			className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3"
		>
			<div ref={scrollDownRef} />

			{messages.map((message, index) => {
				const isCurrentUser = message.senderId === sessionId;

				const hasNextMessageFromSameUser =
					messages[index - 1]?.senderId === messages[index].senderId;

				return (
					<div key={`${message.id}-${message.timestamp}`}>
						<div
							className={cn("flex items-end", { "justify-end": isCurrentUser })}
						>
							<div
								className={cn(
									"mx-2 flex max-w-xs flex-col space-y-2 text-base",
									{
										"order-1 items-end": isCurrentUser,
										"order-2 items-start": !isCurrentUser,
									}
								)}
							>
								<span
									className={cn("inline-block rounded-lg px-4 py-2", {
										"bg-indigo-600 text-white": isCurrentUser,
										"bg-slate-200 text-slate-900": !isCurrentUser,
										"rounded-br-none":
											!hasNextMessageFromSameUser && isCurrentUser,
										"rounded-bl-none":
											!hasNextMessageFromSameUser && !isCurrentUser,
									})}
								>
									{message.text}{" "}
									<span className="ml-2 text-xs text-slate-400">
										{formatTimestamp(message.timestamp)}
									</span>
								</span>
							</div>

							<div
								className={cn("relative h-8 w-8", {
									"order-2": isCurrentUser,
									"order-1": !isCurrentUser,
									invisible: hasNextMessageFromSameUser,
								})}
							>
								<Image
									fill
									src={
										isCurrentUser ? (sessionImage as string) : chatPartner.image
									}
									alt={
										isCurrentUser
											? "Your Profile Picture"
											: `${chatPartner.name}'s Profile Picture`
									}
									referrerPolicy="no-referrer"
									className="rounded-full"
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Messages;
