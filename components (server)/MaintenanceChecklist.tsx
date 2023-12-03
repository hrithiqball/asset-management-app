import React, { Fragment } from "react";
import { fetchTaskListByChecklistUid } from "@/utils/actions/route";
import { checklist, maintenance } from "@prisma/client";
import TaskMaintenanceChecklist from "@/components/TaskMaintenanceChecklist";
import TaskList from "./TaskList";

export default async function MaintenanceChecklist({
	maintenance,
	checklist,
}: {
	maintenance: maintenance;
	checklist: checklist;
}) {
	const taskListResult = await fetchTaskListByChecklistUid(checklist.uid);
	const taskListData = taskListResult.data ?? [];

	return (
		<Fragment>
			<TaskMaintenanceChecklist maintenance={maintenance} checklist={checklist}>
				<TaskList taskList={taskListData} />
			</TaskMaintenanceChecklist>
		</Fragment>
	);
}
