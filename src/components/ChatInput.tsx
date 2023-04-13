"use client";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ChatInputProps {
	chatPartner: User;
	chatId: string;
}

function ChatInput({ chatPartner, chatId }: ChatInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [input, setInput] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const sendMessage = async () => {
		setIsLoading(true);

		try {
			await axios.post("/api/message/send", { text: input, chatId });
			setInput("");
			textareaRef.current?.focus();
		} catch (error) {
			toast.error("Something went wrong. Please try again later!")
		} finally {
			setIsLoading(false);
		}
	};

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

				<div
					onClick={() => textareaRef.current?.focus()}
					className="py-2"
					aria-hidden="true"
				>
					<div className="py-px">
						<div className="h-9"></div>
					</div>
				</div>

				<div className="absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2">
					<div className="flex-shrink-0">
						<Button isLoading={isLoading} onClick={sendMessage} type="submit">
							Post
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatInput;
