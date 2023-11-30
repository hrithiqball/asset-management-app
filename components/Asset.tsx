"use client";

import {
	Avatar,
	AvatarGroup,
	Button,
	Card,
	Chip,
	Divider,
	Link,
	Tab,
	Tabs,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Key, ReactNode, useEffect, useState } from "react";
import Loading from "./Loading";
import { asset, checklist_use, maintenance } from "@prisma/client";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlinePlusSquare } from "react-icons/ai";
import Image from "next/image";
import moment from "moment";
import AssetDetails from "./AssetDetails";
import AssetMaintenance from "./AssetMaintenance";
import AssetAttachment from "./AssetAttachment";

export default function Asset({
	asset,
	maintenanceList,
	checklistUse,
}: {
	asset: asset;
	maintenanceList: maintenance[];
	checklistUse: checklist_use[];
}) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [selectedTab, setSelectedTab] = useState("details");

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	return (
		<Card
			className={`rounded-md p-4 m-4 flex-grow ${
				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
			}`}
		>
			<div className="flex flex-row">
				<Button
					className="max-w-min"
					as={Link}
					href="/asset"
					startContent={<IoIosArrowBack />}
					variant="faded"
					size="md"
				>
					Back
				</Button>
				<Tabs
					aria-label="Asset Attribute"
					size="md"
					className="ml-4"
					selectedKey={selectedTab}
					onSelectionChange={(key: Key) => setSelectedTab(key as string)}
				>
					<Tab
						key="details"
						title={
							<div className="flex items-center space-x-2">
								<span>Details</span>
							</div>
						}
					/>
					<Tab
						key="maintenance"
						title={
							<div className="flex items-center space-x-2">
								<span>Maintenance</span>
								<Chip size="sm" variant="faded">
									{maintenanceList.length}
								</Chip>
							</div>
						}
					/>
					<Tab
						key="attachment"
						title={
							<div className="flex items-center space-x-2">
								<span>Attachment</span>
							</div>
						}
					/>
				</Tabs>
			</div>
			<div className="flex flex-row justify-between items-center my-4">
				<h2 className="text-xl font-semibold">{asset.name}</h2>
				<div className="flex flex-row">
					<div className="flex flex-row">
						<Button isIconOnly variant="faded">
							<BsFillPersonBadgeFill />
						</Button>
						<Button isIconOnly className="ml-1" variant="faded">
							<AiOutlineEdit />
						</Button>
						<Button isIconOnly className="ml-1" variant="faded">
							<AiOutlinePlusSquare />
						</Button>
					</div>
				</div>
			</div>
			<Divider />
			<Card className="rounded-md overflow-hidden my-4">
				{selectedTab === "details" && (
					<AssetDetails asset={asset} checklistUse={checklistUse} />
				)}
				{selectedTab === "maintenance" && (
					<AssetMaintenance maintenanceList={maintenanceList} />
				)}
				{selectedTab === "attachment" && <AssetAttachment />}
			</Card>
		</Card>
	);
}
