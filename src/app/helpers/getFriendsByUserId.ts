import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
	// Retrieve friends for current user...
	const friendIds = (await fetchRedis(
		"smembers",
		`user:${userId}:friends`
	)) as string[];

	// Get user data
	const friends = await Promise.all(
		friendIds.map(async (friendId) => {
			const friendData = (await fetchRedis("get", `user:${friendId}`)) as string;
			const friend = JSON.parse(friendData) as User;

			return friend;
		})
	);

    // Return array of friends
	return friends;
};
