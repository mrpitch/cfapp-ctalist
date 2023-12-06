import React from "react";
import { Box, Card, DragHandle, Flex } from "@contentful/f36-components";
import { css } from "emotion";
import { DndContext } from "@dnd-kit/core";
import {
	arrayMove,
	verticalListSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type IItem = {
	id: number;
	label: string;
	url: string;
};

export interface ISortableCardsProps {
	item: IItem;
}

export const SortableCtas = () => {
	const styles = {
		card: css({
			// This lets us change z-index when dragging
			position: "relative",
		}),
		dragHandle: css({
			alignSelf: "stretch",
		}),
	};
	const [items, setItems] = React.useState([
		{ id: 1, label: "abc", url: "https://www.google.com" },
		{ id: 2, label: "def", url: "https://www.google.com" },
	]);

	function SortableCard({ item }: ISortableCardsProps) {
		const { id, label, url } = item;
		const { attributes, listeners, setNodeRef, transform, transition, active } =
			useSortable({
				id: item.label,
			});
		const zIndex = active && active.id === id ? 1 : 0;
		const style = {
			transform: CSS.Translate.toString(transform),
			transition,
			zIndex,
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
				<Box padding="spacingM">
					{label}, {url}
				</Box>
			</Card>
		);
	}

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<Flex flexDirection="column" gap="spacingS">
					{items.map((item) => (
						<SortableCard key={item.label} item={item} />
					))}
				</Flex>
			</SortableContext>
		</DndContext>
	);
};
