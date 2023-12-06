import React, { useState, useRef, HTMLAttributes } from "react";

import { FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

import {
	Box,
	Button,
	Card,
	DragHandle,
	Flex,
	IconButton,
	Text,
	TextInput,
} from "@contentful/f36-components";
import {
	PlusIcon,
	DeleteIcon,
	EditIcon,
	DoneIcon,
} from "@contentful/f36-icons";

import { css } from "emotion";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	verticalListSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TItem {
	id: number;
	label: string;
	url: string;
	edit?: boolean;
}

type TSortableCardsProps = {
	item: TItem;
	enabled: boolean;
	actions: {
		items: TItem[];
		setItems: React.Dispatch<React.SetStateAction<TItem[]>>;
		newItem: TItem;
		setNewItem: React.Dispatch<React.SetStateAction<TItem>>;
		setActiveCard: React.Dispatch<React.SetStateAction<TItem | undefined>>;
	};
} & HTMLAttributes<HTMLDivElement>;

export const SortableCtaList = () => {
	// init sdk
	const sdk = useSDK<FieldAppSDK>();

	// init state for items, newItem, activeCard
	const [items, setItems] = useState<TItem[]>(sdk.field.getValue().ctas || []);
	const [newItem, setNewItem] = useState<TItem>({
		id: new Date().getTime(),
		label: "",
		url: "",
		edit: true,
	});
	const [activeCard, setActiveCard] = useState<TItem>();

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
			const sorted = arrayMove<TItem>(items, activeIndex, overIndex);
			setItems(sorted);

			sdk.field.setValue({ ctas: sorted });
		}
	};

	// Create new item
	const createItem = () => {
		const created = [...items, newItem];

		setActiveCard(newItem);
		setItems(created);
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
						onClick={() => createItem()}
					>
						Add
					</Button>
				</Flex>
			</Box>
			<DndContext onDragEnd={handleDragEnd}>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					<Flex flexDirection="column" gap="spacingS">
						{items.map((item) => {
							const enabled = !activeCard ? true : activeCard?.id === item.id;

							return (
								<CtaListItem
									key={item.id}
									item={item}
									enabled={enabled}
									actions={{
										items,
										setItems,
										newItem,
										setNewItem,
										setActiveCard,
									}}
								/>
							);
						})}
					</Flex>
				</SortableContext>
			</DndContext>
		</>
	);
};

function CtaListItem({ item, enabled, actions }: TSortableCardsProps) {
	// init sdk
	const sdk = useSDK<FieldAppSDK>();

	// init state for input
	const [inputState, setInputState] = useState({
		label: item.label,
		url: item.url,
	});

	const inputLabelRef = useRef<HTMLInputElement>(null);
	const inputUrlRef = useRef<HTMLInputElement>(null);

	//desctructure props
	const { id } = item;
	const { items, setItems, setNewItem, setActiveCard } = actions;

	const styles = {
		card: css({
			// This lets us change z-index when dragging
			position: "relative",
		}),
		dragHandle: css({
			alignSelf: "stretch",
		}),
	};

	const { attributes, listeners, setNodeRef, transform, transition, active } =
		useSortable({
			id,
		});
	const zIndex = active && active.id === id ? 1 : 0;
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex,
	};

	const editItem = (i: TItem) => {
		const edited = items.map((item: TItem) => {
			if (item.id === i.id) {
				const active = { ...item, edit: true };
				setActiveCard(active);
				return active;
			}

			return item;
		});
		setItems(edited);
	};

	const saveItem = (i: TItem) => {
		const updated = items.map((item: TItem) => {
			if (item.id === i.id) {
				return {
					...item,
					label: inputLabelRef?.current ? inputLabelRef.current.value : "",
					url: inputUrlRef?.current ? inputUrlRef.current.value : "",
					edit: false,
				};
			}

			return item;
		});
		setItems(updated);

		sdk.field.setValue({ ctas: updated });
		setNewItem({ id: new Date().getTime(), label: "", url: "", edit: true });
		setActiveCard(undefined);
	};

	const deleteItem = (i: TItem) => {
		const deleted = items.filter((item: TItem) => item.id !== i.id);
		setItems(deleted);
		sdk.field.setValue({ ctas: deleted });
		setActiveCard(undefined);
	};

	return (
		<Card
			className={styles.card}
			dragHandleRender={() => (
				<DragHandle
					as="button"
					className={styles.dragHandle}
					label="Move card"
					{...attributes}
					{...listeners}
				/>
			)}
			padding="none"
			withDragHandle
			ref={setNodeRef}
			style={style}
		>
			<Box padding="spacingS">
				<Flex
					flexDirection="row"
					justifyContent="between"
					alignItems="end"
					gap="spacingS"
				>
					<Flex flexDirection="column" flexGrow={1}>
						<Text
							fontColor="blue800"
							fontWeight="fontWeightMedium"
							marginBottom="spacingXs"
						>
							Label
						</Text>
						{!item.edit ? (
							<Text>{item.label}</Text>
						) : (
							<TextInput
								name="label"
								ref={inputLabelRef}
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Label"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, label: e.target.value });
								}}
								value={inputState.label}
							/>
						)}
					</Flex>
					<Flex flexDirection="column" flexGrow={1}>
						<Text
							fontColor="blue800"
							fontWeight="fontWeightMedium"
							marginBottom="spacingXs"
						>
							Url
						</Text>
						{!item.edit ? (
							<Text>{item.url}</Text>
						) : (
							<TextInput
								name="url"
								ref={inputUrlRef}
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Url"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, url: e.target.value });
								}}
								value={inputState.url}
							/>
						)}
					</Flex>
					<Flex flexDirection="column" flexGrow={0} alignSelf="center">
						{!item.edit ? (
							<IconButton
								variant="transparent"
								aria-label="Select the date"
								icon={<EditIcon />}
								onClick={() => editItem(item)}
								isDisabled={!enabled}
							/>
						) : (
							<IconButton
								variant="transparent"
								aria-label="Select the date"
								icon={<DoneIcon />}
								onClick={() => saveItem(item)}
							/>
						)}
						<IconButton
							variant="transparent"
							aria-label="Select the date"
							icon={<DeleteIcon />}
							onClick={() => deleteItem(item)}
							isDisabled={!enabled}
						/>
					</Flex>
				</Flex>
			</Box>
		</Card>
	);
}
