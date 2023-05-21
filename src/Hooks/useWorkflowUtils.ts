const UUID = "UUID";

function newUUID(): string {
	const newUUID = crypto.randomUUID();
	localStorage.setItem(UUID, newUUID);
	return newUUID;
}

export function getUUID() {
	return localStorage.getItem(UUID) ?? newUUID();
}
