"use client";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
	chatPartner: User;
}

const sendMessage = () => {};

function ChatInput({ chatPartner }: ChatInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [input, setInput] = useState<string>("");
	return (
		<div className="mb-2 border-t border-slate-200 px-4 pt-4 sm:mb-0">
			<div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600">
				<TextareaAutosize
					ref={textareaRef}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`Message ${chatPartner.name}`}
					className="block w-full resize-none border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
	);
}

export default ChatInput;
