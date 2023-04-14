import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import icon from "../../../../public/assets/chat-app-icon.png";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import FriendRequestsSidebarOption from "@/components/FriendRequestsSidebarOption";
import { fetchRedis } from "@/app/helpers/redis";
import { getFriendsByUserId } from "@/app/helpers/getFriendsByUserId";
import ChatListSidebar from "@/components/ChatListSidebar";
import MobileChatLayout from "@/components/MobileChatLayout";

interface LayoutProps {
	children: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
	{
		id: 1,
		name: "Add friend",
		href: "/dashboard/add",
		action: "+",
	},
];

export default async function Layout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions);

	if (!session) {
		notFound();
	}

	const friends = await getFriendsByUserId(session.user.id);

	const unseenRequestCount = (
		(await fetchRedis(
			"smembers",
			`user:${session.user.id}:incoming_friend_request`
		)) as User[]
	).length;

	return (
		<div className="flex h-screen w-full">
			<div className="md:hidden">
				<MobileChatLayout
					friends={friends}
					session={session}
					sidebarOptions={sidebarOptions}
					unseenRequestCount={unseenRequestCount}
				/>
			</div>

			<div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 md:flex">
				<Link href="/dashboard" className="flex h-16 shrink-0 items-center">
					<Image
						className="rounded-full"
						src={icon}
						width={50}
						height={50}
						alt="chat-app logo"
					/>
				</Link>

				{/* Only render when user has friends... */}
				{friends.length > 0 && (
					<div className="text-sm font-semibold leading-6 text-slate-400">
						Your chats
					</div>
				)}

				<nav className="flex flex-1 flex-col">
					<ul role="list" className="flex-q flex flex-col gap-y-7">
						<li>
							<ChatListSidebar friends={friends} sessionId={session.user.id} />
						</li>
						<li>
							<div className="text-sm font-semibold leading-6 text-slate-400">
								Overview
							</div>

							<ul role="list" className="-mx-2 mt-2 space-y-1">
								{sidebarOptions.map((option) => (
									<li key={option.id}>
										<Link
											href={option.href}
											className="group flex gap-3 p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
										>
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[14px] font-bold text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
												{option.action}
											</span>
											<span className="truncate">{option.name}</span>
										</Link>
									</li>
								))}
								<li>
									<FriendRequestsSidebarOption
										sessionId={session.user.id}
										initialUnseenRequestCount={unseenRequestCount}
									/>
								</li>
							</ul>
						</li>

						<li className="-mx-6 mt-auto flex items-center">
							<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
								<div className="relative h-8 w-8 bg-gray-50">
									<Image
										fill
										referrerPolicy="no-referrer"
										className="rounded-full"
										src={session.user.image || ""}
										alt="Your profile picture"
									/>
								</div>

								<span className="sr-only">Your profile</span>
								<div className="flex flex-col">
									<span aria-hidden="true">{session.user.name}</span>
									<span className="text-xs text-zinc-400" aria-hidden="true">
										{session.user.email}
									</span>
								</div>
							</div>

							<SignOutButton className="aspect-square h-full" />
						</li>
					</ul>
				</nav>
			</div>

			<aside className="container max-h-screen w-full px-10 py-10">
				{children}
			</aside>
		</div>
	);
}
