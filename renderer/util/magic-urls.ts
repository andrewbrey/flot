/*===================================================
 * "Magically" convert urls which target hosts that prevent display in an iframe
 *  to their corresponding "embeddable" url structure.
 *
 * Thanks to https://github.com/kamranahmedse/pennywise for much of the logic here
 ===================================================*/

export function prepareYoutubeUrl(target: string) {
	const asURL = new URL(target);

	if (!asURL.host.includes("youtube.com") && !asURL.host.includes("youtu.be")) {
		return target;
	}

	const queryParams = asURL.searchParams || {};
	let videoId = queryParams.get("v") || asURL.pathname;

	// Remove slashes – pathname is prefixed with slash
	videoId = videoId.replace(/\//g, "");
	// Empty URL or already an embed link
	if (!videoId || videoId.includes("embed")) {
		return target;
	}

	queryParams.delete("v");
	queryParams.delete("index");
	queryParams.delete("list");
	queryParams.delete("modestbranding");
	queryParams.delete("autoplay");

	queryParams.set("autoplay", "1");
	queryParams.set("modestbranding", "1");

	return `https://www.youtube.com/embed/${videoId}?${queryParams}`;
}

export function prepareVimeoUrl(target: string) {
	const asURL = new URL(target);

	if (!asURL.host.includes("vimeo.com")) {
		return target;
	}

	const queryParams = asURL.searchParams || {};
	let videoId = asURL.pathname;

	videoId = videoId.split("/").slice(-1).join() ?? "";

	// Vimeo video ids are all numeric
	if (!/^\d+$/.test(videoId)) {
		return target;
	}

	queryParams.set("autoplay", "1");

	return `https://player.vimeo.com/video/${videoId}?${queryParams}`;
}

export function prepareDailyMotionUrl(target: string) {
	const normalized = target.replace(/^http(s)?:\/\/dai\.ly\//, "http://www.dailymotion.com/video/");

	const asURL = new URL(normalized);
	if (!asURL.host.includes("dailymotion.com") || !asURL.pathname.includes("/video")) {
		return target;
	}

	const videoId = asURL.pathname.replace(/\/video\//g, "");
	if (!videoId) {
		return target;
	}

	return `http://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
}
