import { useEffect } from "react";

import { FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	verticalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";

import { useCtaListStore } from "./sortableCtaListStore";

import { Box, Button, Flex } from "@contentful/f36-components";
import { PlusIcon } from "@contentful/f36-icons";

import { CtaListItem } from "./SortableCtaListItem";

export const SortableCtaList = () => {
	const { items, setItems, createItem, setSDK } = useCtaListStore(
		(state) => state
	);
	// init sdk
	const sdk = useSDK<FieldAppSDK>();
	const fieldName = sdk.field.id;

	useEffect(() => {
		// need to set sdk in store, to use sdk in store
		setSDK(sdk);
		setItems(sdk.field.getValue() ? sdk.field.getValue()[fieldName] : []);
	}, [sdk, sdk.field, setItems, setSDK, fieldName]);

	// DnD handler
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeItem = items.find((item) => item.id === active.id);
		const overItem = items.find((item) => item.id === over.id);

		if (!activeItem || !overItem) {
			return;
		}

		const activeIndex = items.findIndex((item) => item.id === active.id);
		const overIndex = items.findIndex((item) => item.id === over.id);

		if (activeIndex !== overIndex) {
			const sorted = arrayMove(items, activeIndex, overIndex);
			setItems(sorted);

			sdk.field.setValue({ [fieldName]: sorted });
		}
	};

	return (
		<>
			<Box marginBottom="spacingL">
				<Flex
					flexDirection="row"
					justifyContent="between"
					alignItems="end"
					gap="spacingS"
				>
					{" "}
					<Button
						variant="secondary"
						aria-label="Add Item"
						startIcon={<PlusIcon />}
						onClick={() => createItem(new Date().getTime())}
					>
						Add cta
					</Button>
				</Flex>
			</Box>
			<DndContext onDragEnd={handleDragEnd}>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					<Flex flexDirection="column" gap="spacingS">
						{items.map((item, index) => {
							return <CtaListItem key={item.id} item={item} />;
						})}
					</Flex>
				</SortableContext>
			</DndContext>
		</>
	);
};
