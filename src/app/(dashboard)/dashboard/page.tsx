import { getFriendsByUserId } from "@/app/helpers/getFriendsByUserId";
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions)
	if (!session) notFound()
  
	const friends = await getFriendsByUserId(session.user.id)
  
	const friendsWithLastMessage = await Promise.all(
		friends.map(async (friend) => {
		  const [lastMessageRaw] = (await fetchRedis(
			'zrange',
			`chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
			-1,
			-1
		  )) as string[];
	  
		  if (lastMessageRaw) { // Add this check to ensure lastMessageRaw is not empty
			const lastMessage = JSON.parse(lastMessageRaw) as Message;
	  
			return {
			  ...friend,
			  lastMessage,
			};
		  } else {
			return {
			  ...friend,
			  lastMessage: {
				senderId: session.user.id,
				text: "Send a message!"
			  }
			};
		  }
		})
	  );  
	  
	return (
		<div className="container py-12">
			<h1 className="mb-8 text-5xl font-bold">Recent chats</h1>
			{friendsWithLastMessage.length === 0 ? (
				<p className="text-sm text-zinc-500">Nothing to show here...</p>
			) : (
				friendsWithLastMessage.map((friend) => (
					<div
						key={friend.id}
						className="relative rounded-md border border-zinc-200 bg-zinc-50 p-3"
					>
						<div className="absolute inset-y-0 right-4 flex items-center">
							<ChevronRight className="h-7 w-7 text-zinc-400" />
						</div>

						<Link
							href={`/dashboard/chat/${chatHrefConstructor(
								session.user.id,
								friend.id
							)}`}
							className="relative sm:flex"
						>
							<div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
								<div className="relative h-6 w-6">
									<Image
										referrerPolicy="no-referrer"
										className="rounded-full"
										alt={`${friend.name} profile picture`}
										src={friend.image}
										fill
									/>
								</div>
							</div>

							<div>
								<h4 className="text-lg font-semibold">{friend.name}</h4>
								<p className="mt-1 max-w-md">
									<span className="text-zinc-400">
										{friend.lastMessage.senderId === session.user.id
											? "You: "
											: ""}
									</span>
									{friend.lastMessage.text}
								</p>
							</div>
						</Link>
					</div>
				))
			)}
		</div>
	);
}
