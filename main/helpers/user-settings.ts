import Store from "electron-store";

interface UserSettings {
	focusVideo: boolean;
}

export default () => {
	const name = `user-settings`;
	const defaultState: UserSettings = {
		focusVideo: false,
	};
	const store = new Store<UserSettings>({
		name,
		defaults: { ...defaultState },
	});

	return store;
};
