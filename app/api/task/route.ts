import { task } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new task
 */
const AddTaskSchema = z.object({
	task_activity: z.string(),
	task_uid: z.string(),
	task_order: z.number(),
	have_subtask: z.boolean(),
	description: z.string().optional(),
	remarks: z.string().optional(),
	issue: z.string().optional(),
	deadline: z.date().optional(),
	checklist_uid: z.string(),
});

/**
 * @description Type for adding a new task
 */
type AddTask = z.infer<typeof AddTaskSchema> & {
	uid: string;
	is_complete: boolean;
	completed_by: string | null;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const tasks: task[] = await prisma.task.findMany();

		if (tasks.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${tasks.length} tasks`,
						tasks
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(204, `No tasks found`)),
				{
					status: 204,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify(ResponseMessage(500, error.message ?? error)),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * This asynchronous function handles POST requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {task}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddTaskSchema.safeParse(json);
		if (result.success) {
			const request: AddTask = {
				...result.data,
				uid: `CL-${moment().format("YYMMDDHHmmssSSS")}`,
				is_complete: false,
				completed_by: null,
			};

			const task: task = await prisma.task.create({
				data: request,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Task ${task.uid} has been successfully created`,
						task
					)
				),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						400,
						result.error.issues.map((issue) => issue.message).join(", "),
						null,
						result.error.issues.map((issue) => issue.code.toString()).join("")
					)
				),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(
				JSON.stringify(ResponseMessage(409, `Task already existed`)),
				{
					status: 409,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new NextResponse(
			JSON.stringify(ResponseMessage(500, error.message)),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
