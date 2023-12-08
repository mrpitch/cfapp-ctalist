import { FieldAppSDK } from "@contentful/app-sdk";

import { create } from "zustand";

export type TItem = {
	id: number;
	label: string;
	url: string;
};

type State = {
	sdk: FieldAppSDK;
	items: TItem[];
	newItem: TItem;
	editId: number | undefined;
};

type Actions = {
	setSDK: (sdk: FieldAppSDK) => void;
	setItems: (items: TItem[]) => void;
	createItem: (timestamp: number) => void;
	editItem: (id: number | undefined) => void;
	updateItem: (id: number, label: string, url: string) => void;
	deleteItem: (id: number) => void;
};

type TCtaListStore = State & Actions;

// business logic: create, edit, update, delete
const createItem = (
	items: TItem[],
	item: TItem,
	sdk: FieldAppSDK,
	timestamp: number
) => {
	const created = [...items, { ...item, id: timestamp }];
	if (created.length > sdk.parameters.instance.maxItems) {
		sdk.notifier.error(
			`Max number (${sdk.parameters.instance.maxItems}) of items reached`
		);
		return items;
	}
	console.log("created: ", created);
	return created;
};

const editItem = (items: TItem[], id: number | undefined) => {
	if (!id) {
		return undefined;
	}
	const edited = items.filter((item: TItem) => id === item.id);
	console.log("edited: ", id, edited[0].id);
	return edited[0].id;
};

const updateItem = (
	items: TItem[],
	id: number,
	label: string,
	url: string,
	sdk: FieldAppSDK
): TItem[] => {
	const updated = items.map((item) => ({
		...item,
		label: item.id === id ? label : item.label,
		url: item.id === id ? url : item.url,
	}));
	console.log("updated: ", updated);
	sdk.field.setValue({ [sdk.field.id]: updated });

	return updated;
};

const deleteItem = (items: TItem[], id: number, sdk: FieldAppSDK) => {
	const deleted = items.filter((item: TItem) => id !== item.id);
	console.log("deleted: ", deleted);
	sdk.field.setValue({ [sdk.parameters.instance.fieldName]: deleted });
	return deleted;
};

// Zustand store
export const useCtaListStore = create<TCtaListStore>((set) => ({
	sdk: {} as FieldAppSDK,
	items: [],
	newItem: {
		id: new Date().getTime(),
		label: "",
		url: "",
	},
	editId: undefined,
	setSDK: (sdk: FieldAppSDK) => set((state) => ({ ...state, sdk })),
	setItems: (items: TItem[]) =>
		set((state) => ({
			...state,
			items,
		})),
	createItem: (timestamp: number) =>
		set((state) => ({
			...state,
			items: createItem(state.items, state.newItem, state.sdk, timestamp),
			editId:
				state.items.length < state.sdk.parameters.instance.maxItems
					? timestamp
					: undefined,
		})),
	editItem: (id: number | undefined) =>
		set((state) => ({ ...state, editId: editItem(state.items, id) })),
	updateItem: (id: number, label: string, url: string) =>
		set((state) => ({
			...state,
			items: updateItem(state.items, id, label, url, state.sdk),
			editId: undefined,
		})),
	deleteItem: (id: number) =>
		set((state) => ({
			...state,
			items: deleteItem(state.items, id, state.sdk),
		})),
}));
