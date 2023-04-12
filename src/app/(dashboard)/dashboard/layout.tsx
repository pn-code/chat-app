import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import icon from "../../../../public/assets/chat-app-icon.png"
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";

interface LayoutProps {
	children: ReactNode
}

interface SidebarOption {
	id: number,
	name: string,
	href: string,
	action?: string
}

const sidebarOptions: SidebarOption[] = [
	{
		id: 1, 
		name: "Add friend",
		href: "/dashboard/add",
		action: "+"
	}
]

export default async function Layout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions);

	if(!session) {
		notFound()
	}

	return (
		<div className="w-full flex h-screen">
			<div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6">
			
			<Link href="/dashboard" className="flex h-16 shrink-0 items-center">
				<Image className="rounded-full" src={icon} width={50} height={50} alt="chat-app logo"/>
			</Link>

			<div className="text-sm font-semibold leading-6 text-slate-400">
				Your chats
			</div>

			<nav className="flex flex-1 flex-col">
				<ul role="list" className="flex flex-q flex-col gap-y-7">
					<li>
						// User Chats
					</li>
					<li>
						<div className="text-sm font-semibold leading-6 text-slate-400">Overview</div>
						
						<ul role="list" className="-mx-2 mt-2 space-y-1">
							{sidebarOptions.map(option => (
								<li key={option.id}>
									<Link href={option.href} className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 group flex gap-3 p-2 text-sm leading-6 font-semibold">
										<span className="text-slate-400 border-slate-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex w-6 h-6 shrink-0 items-center justify-center rounded-lg border text-[14px] font-bold bg-white">{option.action}</span>
										<span className="truncate">{option.name}</span>
										</Link>
								</li>
							))}
						</ul>
					</li>

					<li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ''}
                    alt='Your profile picture'
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>

				<SignOutButton className="h-full aspect-square"/>
            </li>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
			</div>
	);
}
