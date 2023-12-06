import { useEffect } from "react";
import { FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

import CtaList from "../components/SortableCtaList";

const Field = () => {
	const sdk = useSDK<FieldAppSDK>();

	useEffect(() => {
		sdk.window.startAutoResizer();
	}, [sdk.window]);

	return <CtaList />;
};

export default Field;
