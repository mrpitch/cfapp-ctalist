import { useState, HTMLAttributes } from "react";

import { css } from "emotion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TItem, useCtaListStore } from "./sortableCtaListStore";

import {
	Box,
	Card,
	DragHandle,
	Flex,
	IconButton,
	Text,
	TextInput,
} from "@contentful/f36-components";
import { DeleteIcon, EditIcon, DoneIcon } from "@contentful/f36-icons";

type TSortableCardsProps = {
	item: TItem;
} & HTMLAttributes<HTMLDivElement>;

export const CtaListItem = ({ item }: TSortableCardsProps) => {
	const { updateItem, deleteItem, editId, editItem } = useCtaListStore(
		(state) => state
	);

	// init state for input & destructure props
	const [inputState, setInputState] = useState({
		label: item.label,
		url: item.url,
	});
	const { id, label, url } = item;
	const disabled = !editId ? true : editId === id;

	//styles for DnD & & destructure DnD props
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
						{editId === id ? (
							<TextInput
								name="label"
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Label"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, label: e.target.value });
								}}
								value={inputState.label}
							/>
						) : (
							<Text>{label}</Text>
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
						{editId === id ? (
							<TextInput
								name="url"
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Url"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, url: e.target.value });
								}}
								value={inputState.url}
							/>
						) : (
							<Text>{url}</Text>
						)}
					</Flex>
					<Flex flexDirection="column" flexGrow={0} alignSelf="center">
						{editId === id ? (
							<>
								<IconButton
									variant="transparent"
									aria-label="Update"
									icon={<DoneIcon />}
									onClick={() => {
										updateItem(id, inputState.label, inputState.url);
									}}
									isDisabled={!disabled}
								/>
							</>
						) : (
							<>
								<IconButton
									variant="transparent"
									aria-label="edit"
									icon={<EditIcon />}
									onClick={() => editItem(id)}
									isDisabled={!disabled}
								/>
							</>
						)}
						<IconButton
							variant="transparent"
							aria-label="Select the date"
							icon={<DeleteIcon />}
							onClick={() => deleteItem(id)}
							isDisabled={!disabled}
						/>
					</Flex>
				</Flex>
			</Box>
		</Card>
	);
};
