import { HTMLAttributes } from "react";

import { css } from "emotion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useForm, SubmitHandler } from "react-hook-form";

import { TItem, useCtaListStore } from "./sortableCtaListStore";

import {
	Box,
	Card,
	DragHandle,
	Flex,
	IconButton,
	Text,
	Form,
	FormControl,
	TextInput,
} from "@contentful/f36-components";
import { DeleteIcon, EditIcon, DoneIcon } from "@contentful/f36-icons";

type TSortableCardsProps = {
	item: TItem;
} & HTMLAttributes<HTMLDivElement>;

interface IFormInput {
	label: string;
	url: string;
}

export const CtaListItem = ({ item }: TSortableCardsProps) => {
	// init sdk
	const { updateItem, deleteItem, editId, editItem } = useCtaListStore(
		(state) => state
	);

	//destructure props & init form
	const { id, label, url } = item;
	const disabled = !editId ? true : editId === id;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			label: label,
			url: url,
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		updateItem(id, data.label, data.url);
	};

	//styles for DnD & & destructure DnD props
	const styles = {
		card: css({
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
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Flex
						flexDirection="row"
						justifyContent="between"
						alignItems="start"
						gap="spacingS"
					>
						<Flex flexDirection="column" flexGrow={1}>
							<FormControl isInvalid={Boolean(errors.label)}>
								<FormControl.Label isRequired>Label</FormControl.Label>

								{editId === id ? (
									<>
										<TextInput
											onKeyDown={function noRefCheck() {}}
											placeholder="Enter Label"
											size="medium"
											{...register("label", {
												required: { value: true, message: "Label is required" },
												maxLength: { value: 45, message: "Max length is 45" },
											})}
										/>
										<Text></Text>
										{errors.label && (
											<FormControl.ValidationMessage>
												{errors.label.message}
											</FormControl.ValidationMessage>
										)}
									</>
								) : (
									<Box>
										<Text>{label}</Text>
									</Box>
								)}
							</FormControl>
						</Flex>
						<Flex flexDirection="column" flexGrow={1}>
							<FormControl isInvalid={Boolean(errors.url)}>
								<FormControl.Label isRequired>Url</FormControl.Label>

								{editId === id ? (
									<>
										<TextInput
											onKeyDown={function noRefCheck() {}}
											placeholder="Enter Url"
											size="medium"
											{...register("url", {
												required: { value: true, message: "Url is required" },
												pattern: {
													value: /^(http|https)?:\/\/(.*)/,
													message: "Url need to start with http:// or https://",
												},
											})}
										/>
										{errors.url && (
											<FormControl.ValidationMessage>
												{errors.url.message}
											</FormControl.ValidationMessage>
										)}
									</>
								) : (
									<Box>
										<Text>{url}</Text>
									</Box>
								)}
							</FormControl>
						</Flex>
						<Flex flexDirection="column" flexGrow={0} alignSelf="center">
							{editId === id ? (
								<IconButton
									variant="transparent"
									aria-label="update item"
									icon={<DoneIcon />}
									type="submit"
									isDisabled={!disabled}
								/>
							) : null}
							{!(editId === id) ? (
								<IconButton
									variant="transparent"
									aria-label="edit item"
									icon={<EditIcon />}
									onClick={() => editItem(id)}
									isDisabled={!disabled}
								/>
							) : null}
							<IconButton
								variant="transparent"
								aria-label="delete item"
								icon={<DeleteIcon />}
								onClick={() => deleteItem(id)}
								isDisabled={!disabled}
							/>
						</Flex>
					</Flex>
				</Form>
			</Box>
		</Card>
	);
};
