import { asset } from "@prisma/client";
import Navigation from "@/components/Navigation";
import AssetComponent from "@/components/AssetList";
import { Result } from "@/lib/result";
import SignOutItem from "@/components/SignOutItem";
import { ReadUserInfo } from "@/lib/actions/route";
import { fetchAssetList } from "./actions";

export default async function AssetPage() {
	const assetResult: Result<asset[]> = await fetchAssetList();
	const assetListData = assetResult.data ?? [];
	const userInfo = await ReadUserInfo();

	return (
		<div className="flex flex-col h-screen">
			<Navigation user={userInfo}>
				<SignOutItem />
			</Navigation>
			<AssetComponent assetList={assetListData} />
		</div>
	);

	// const { theme } = useTheme();
	// const [mounted, setMounted] = useState(false);
	// const [extendedAssetList, setExtendedAssetList] = useState<ExtendedAsset[]>(
	// 	[]
	// );
	// const [currentAsset, setCurrentAsset] = useState<asset>();
	// const [currentChecklist, setCurrentChecklist] = useState<checklist>();
	// const [isLoading, setIsLoading] = useState(false);
	// const { isOpen, onOpen, onClose } = useDisclosure();
	// const [openChecklistModal, setOpenChecklistModal] = useState(false);
	// const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);
	// const [openEditAssetModal, setOpenEditAssetModal] = useState(false);
	// const [openDeleteAssetModal, setOpenDeleteAssetModal] = useState(false);
	// const [testRightSideBar, setTestRightSideBar] = useState(false);
	// const [newMaintenance, setNewMaintenance] = useState(false);

	// return (
	// 	<div className="flex flex-col h-screen">
	// 		<Navigation />
	// 		<Card
	// 			className={`rounded-md p-4 m-4 flex-grow ${
	// 				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
	// 			}`}
	// 		>
	// 			<div className="flex justify-between">
	// 				<span>Asset List</span>
	// 				<Button
	// 					variant="ghost"
	// 					size="sm"
	// 					endContent={<BiSolidBookAdd size={25} />}
	// 				>
	// 					Add Asset
	// 				</Button>
	// 			</div>
	// 			{extendedAssetList.length > 0 ? (
	// 				<Fragment></Fragment>
	// 			) : (
	// 				<Fragment></Fragment>
	// 			)}
	// 			<div className="flex flex-row justify-between h-screen">
	// 				<div className="flex-1">
	// 					<Button onClick={() => setTestRightSideBar(!testRightSideBar)}>
	// 						Manifold
	// 					</Button>
	// 					<Button onClick={() => console.log(extendedAssetList)}>
	// 						Click Me
	// 					</Button>
	// 				</div>
	// 				{testRightSideBar && (
	// 					<div className="bg-gray-300 p-4 flex-1 mt-4 border rounded-md overflow-x-auto">
	// 						<div className="flex flex-row justify-between items-center">
	// 							<span className="font-bold ml-4">Manifold</span>
	// 							<div className="flex flex-row">
	// 								<Button isIconOnly variant="faded">
	// 									<BsFillPersonBadgeFill />
	// 								</Button>
	// 								<Button className="ml-1" isIconOnly variant="faded">
	// 									<AiOutlineEdit />
	// 								</Button>
	// 								<Button className="ml-1" isIconOnly variant="faded">
	// 									<AiOutlinePlusSquare />
	// 								</Button>
	// 							</div>
	// 						</div>
	// 						<Divider className="mt-3" />
	// 						{/*
	// 						{newMaintenance && currentChecklist && (
	// 							<div className="p-4 h-80 mt-4">
	// 								<span className="font-bold text-lg">
	// 									{currentChecklist.title}
	// 								</span>
	// 								{taskList
	// 									.filter((t) => t.checklist_uid === currentChecklist.uid)
	// 									.map((task, index) => (
	// 										<div key={index} className="mt-2">
	// 											<span className="text-base">
	// 												{index + 1}. {task.task_activity}
	// 											</span>
	// 										</div>
	// 									))}

	// 								<div className="mt-4">
	// 									<LocalizationProvider
	// 										dateAdapter={AdapterMoment}
	// 										adapterLocale="en-gb"
	// 									>
	// 										<DatePicker label="Deadline" />
	// 									</LocalizationProvider>
	// 								</div>

	// 								<Button
	// 									className="mr-4 mt-4"
	// 									color="primary"
	// 									variant="bordered"
	// 									startContent={<LiaUserCogSolid />}
	// 								>
	// 									Assign Maintainer
	// 								</Button>

	// 								<Button
	// 									onClick={() => setNewMaintenance(!newMaintenance)}
	// 									color="primary"
	// 									variant="bordered"
	// 								>
	// 									Create
	// 								</Button>
	// 							</div>
	// 						)} */}

	// 						{/* {!newMaintenance && (
	// 							<div className="p-4">
	// 								<p>Description</p>
	// 								<p>This is the description of the asset</p>
	// 								<p className="mt-4">Checklist</p>
	// 								<div className="flex flex-row overflow-x-auto items-center">
	// 									{dummyData.map((checklist, index) => (
	// 										<Card
	// 											key={index}
	// 											radius="lg"
	// 											className={`border-none min-h-min min-w-min bg-red-400 mx-2 my-1`}
	// 										>
	// 											<div className="p-4 mb-12">
	// 												<h3 className="text-lg font-semibold">
	// 													{checklist.title}
	// 												</h3>
	// 												<p className="text-tiny text-white/80">
	// 													{checklist.description}
	// 												</p>
	// 											</div>
	// 											<CardFooter className="">
	// 												<Button
	// 													onClick={() => {
	// 														setCurrentChecklist(checklist);
	// 														setNewMaintenance(!newMaintenance);
	// 													}}
	// 													className="text-tiny text-white"
	// 													variant="flat"
	// 													color="default"
	// 													radius="lg"
	// 													size="sm"
	// 												>
	// 													New Maintenance
	// 												</Button>
	// 											</CardFooter>
	// 										</Card>
	// 									))}
	// 									<Button className="min-w-min">Add New Checklist</Button>
	// 								</div>
	// 								<div className="mt-4">
	// 									<p>Scheduled Maintenance</p>
	// 									TODO: Calendar here 12th October
	// 								</div>
	// 								<div className="mt-4">
	// 									<p>Maintenance History</p>
	// 									TODO: Card here
	// 								</div>
	// 							</div>
	// 						)} */}
	// 					</div>
	// 				)}
	// 			</div>

	// 			{currentAsset && (
	// 				<>
	// 					{/* Checklist Modal */}
	// 					<Modal
	// 						backdrop="blur"
	// 						isOpen={openChecklistModal}
	// 						onClose={() => {
	// 							setOpenChecklistModal(false);
	// 						}}
	// 					>
	// 						<ModalContent>
	// 							<ModalHeader>{currentAsset.name} Checklists</ModalHeader>
	// 							<ModalBody>
	// 								<AssetChecklistUse {...currentAsset} />
	// 							</ModalBody>
	// 						</ModalContent>
	// 					</Modal>

	// 					<Modal
	// 						backdrop="blur"
	// 						isOpen={openMaintenanceModal}
	// 						onClose={() => {
	// 							setOpenMaintenanceModal(false);
	// 						}}
	// 					>
	// 						<ModalContent>
	// 							<ModalHeader>{currentAsset.name} Maintenances</ModalHeader>
	// 							<ModalBody>
	// 								<AssetMaintenance {...currentAsset} />
	// 							</ModalBody>
	// 						</ModalContent>
	// 					</Modal>

	// 					<Modal
	// 						backdrop="blur"
	// 						isOpen={openEditAssetModal}
	// 						onClose={() => {
	// 							setOpenEditAssetModal(false);
	// 						}}
	// 					>
	// 						<ModalContent>
	// 							<ModalHeader>Edit {currentAsset.name}</ModalHeader>
	// 							<ModalBody>{/* TODO: edit asset content */}</ModalBody>
	// 						</ModalContent>
	// 					</Modal>

	// 					<Modal
	// 						backdrop="blur"
	// 						isOpen={openDeleteAssetModal}
	// 						onClose={() => {
	// 							setOpenDeleteAssetModal(false);
	// 						}}
	// 					>
	// 						<ModalContent>
	// 							<ModalHeader>Edit {currentAsset.name}</ModalHeader>
	// 							<ModalBody>{/* TODO: delete asset content */}</ModalBody>
	// 						</ModalContent>
	// 					</Modal>
	// 				</>
	// 			)}
	// 		</Card>
	// 	</div>
	// );
}

{
	/* <div className="min-h-400 max-h-400 overflow-y-auto grid grid-cols-1 gap-4">
									<div className=""></div>
									{dummyData.map((checklist, index) => (
										<Card
											key={index}
											isFooterBlurred
											radius="lg"
											className={`border-none min-h-400 bg-${checklist.color}-300`}
										>
											<div className="p-4 mb-12">
												<h3 className="text-lg font-semibold">
													{checklist.title}
												</h3>
												<p className="text-tiny text-white/80">
													{checklist.description}
												</p>
											</div>
											<CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
												<p className="text-tiny text-white/80">
													New Maintenance
												</p>
												<Button
													className="text-tiny text-white bg-black/20"
													variant="flat"
													color="default"
													radius="lg"
													size="sm"
												>
													Notify me
												</Button>
											</CardFooter>
										</Card>
									))}
								</div> */
}
