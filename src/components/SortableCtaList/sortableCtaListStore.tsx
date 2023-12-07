import { FieldAppSDK } from "@contentful/app-sdk";

import { create } from "zustand";

export type TItem = {
	id: number;
	label: string;
	url: string;
	edit: boolean;
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
	createItem: () => void;
	editItem: (id: number | undefined) => void;
	updateItem: (id: number, label: string, url: string) => void;
	deleteItem: (id: number) => void;
};

type TCtaListStore = State & Actions;

// business logic: create, edit, update, delete
const createItem = (items: TItem[], item: TItem, sdk: FieldAppSDK) => {
	console.log("created");
	const created = [...items, item];
	console.log(created);
	sdk.field.setValue({ ctas: created });
	return created;
};

const editItem = (items: TItem[], id: number | undefined) => {
	if (!id) {
		return undefined;
	}
	console.log("edited");
	const edited = items.filter((item: TItem) => id === item.id);
	console.log(edited);
	return edited[0].id;
};

const updateItem = (
	items: TItem[],
	id: number,
	label: string,
	url: string,
	sdk: FieldAppSDK
): TItem[] => {
	console.log("updated");
	const updated = items.map((item) => ({
		...item,
		label: item.id === id ? label : item.label,
		url: item.id === id ? url : item.url,
	}));
	console.log(updated);
	sdk.field.setValue({ ctas: updated });

	return updated;
};

const deleteItem = (items: TItem[], id: number, sdk: FieldAppSDK) => {
	console.log("deleted");
	const deleted = items.filter((item: TItem) => id !== item.id);
	console.log(deleted);
	sdk.field.setValue({ ctas: deleted });
	return deleted;
};

// Zustand store
export const useCtaListStore = create<TCtaListStore>((set, get) => ({
	sdk: {} as FieldAppSDK,
	items: [],
	newItem: {
		id: new Date().getTime(),
		label: "",
		url: "",
		edit: true,
	},
	editId: undefined,
	setSDK: (sdk: FieldAppSDK) => set((state) => ({ ...state, sdk })),
	setItems: (items: TItem[]) =>
		set((state) => ({
			...state,
			items,
		})),
	createItem: () =>
		set((state) => ({
			...state,
			items: createItem(state.items, state.newItem, state.sdk),
		})),
	editItem: (id: number | undefined) =>
		set((state) => ({ ...state, editId: editItem(state.items, id) })),
	updateItem: (id: number, label: string, url: string) =>
		set((state) => ({
			...state,
			items: updateItem(state.items, id, label, url, state.sdk),
		})),
	deleteItem: (id: number) =>
		set((state) => ({
			...state,
			items: deleteItem(state.items, id, state.sdk),
		})),
}));
