import { TwitterApi } from "twitter-api-v2";
import { BskyAgent } from "@atproto/api";

import store, { credientialsKey } from "./store.js";

export async function postToTwitter(text, images) {
	const credentials = store.get(credientialsKey) ?? {}
	
	if (!credentials.twitterAPIKey || !credentials.twitterAPISecret || !credentials.twitterAccessToken || !credentials.twitterAccessTokenSecret) {
		throw new Error("Please configure Twitter correctly.")
	}

	const twitterClient = new TwitterApi({
		appKey: credentials.twitterAPIKey,
		appSecret: credentials.twitterAPISecret,
		accessToken: credentials.twitterAccessToken,
		accessSecret: credentials.twitterAccessTokenSecret,
	});

	// Post to Twitter
	let twitterMediaIds = [];
	for (const image of images) {
		const mediaUpload = await twitterClient.v1.uploadMedia(image.buffer, {
			mimeType: image.mimeType,
		});
		twitterMediaIds.push(mediaUpload);
	}

	const twitterResponse = await twitterClient.v2.tweet({
		text: text,
		...(twitterMediaIds.length > 0 && {
			media: { media_ids: twitterMediaIds },
		}),
	});
	return twitterResponse
}

export async function postToBluesky(text, images) {
	const blueskyAgent = new BskyAgent({
		service: "https://bsky.social",
	});

	const credentials = store.get(credientialsKey) ?? {}
	
	if (!credentials.blueskyIdentifier || !credentials.blueskyPassword) {
		throw new Error("Please configure Bluesky correctly.")
	}

	// Post to Bluesky
	await blueskyAgent.login({
		identifier: credentials.blueskyIdentifier,
		password: credentials.blueskyPassword,
	});

	let blueskyResponse;
	if (images.length > 0) {
		const uploadedImages = await Promise.all(
			images.map((image) =>
				blueskyAgent.uploadBlob(image.buffer, { encoding: image.mimeType })
			)
		);
		blueskyResponse = await blueskyAgent.post({
			text: text,
			embed: {
				$type: "app.bsky.embed.images",
				images: uploadedImages.map((img) => ({
					image: img.data.blob,
					alt: "Uploaded image",
				})),
			},
		});
	} else {
		blueskyResponse = await blueskyAgent.post({ text: text });
	}
	return blueskyResponse
}