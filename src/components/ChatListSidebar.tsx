"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatListSidebarProps {
	friends: User[];
	sessionId: string;
}

function ChatListSidebar({ friends, sessionId }: ChatListSidebarProps) {
	const router = useRouter();
	const pathname = usePathname();

	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

	// If user checks chat, update unseen messages count...
	useEffect(() => {
		if (pathname?.includes("chat")) {
			setUnseenMessages((prev) => {
				return prev.filter((msg) => !pathname.includes(msg.senderId));
			});
		}
	}, [pathname]);

	return (
		<ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
			{friends.sort().map((friend) => {
				const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
					return unseenMsg.senderId === friend.id;
				}).length;

				return (
					<li key={friend.id}>
						<a
							className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
							href={`/dashboard/chat/${chatHrefConstructor(
								sessionId,
								friend.id
							)}`}
						>
							{friend.name}
							{unseenMessagesCount > 0 && (
								<div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
									{unseenMessagesCount}
								</div>
							)}
						</a>
					</li>
				);
			})}
		</ul>
	);
}

export default ChatListSidebar;
