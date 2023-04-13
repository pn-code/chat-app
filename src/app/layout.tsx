import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
	title: "Chat App",
	description: "Talk to your buddies!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
