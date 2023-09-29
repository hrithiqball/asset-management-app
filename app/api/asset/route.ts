import { Prisma, asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new asset
 */
const AddAssetSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.string().nullable(),
	created_by: z.string(),
	last_maintenance: z.date().nullable(),
	next_maintenance: z.date().nullable(),
	last_maintainee: z.array(z.string()),
	location: z.string().nullable(),
	status_uid: z.string().nullable(),
	person_in_charge: z.string().nullable(),
});

/**
 * @description Type for adding a new asset
 */
type AddAsset = z.infer<typeof AddAssetSchema> & {
	uid: string;
	updated_on: Date;
	created_on: Date;
	updated_by: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param params - Available params: `page`, `limit`, `type`, `location`, `sort_by`, `is_ascending`, `upcoming_maintenance`
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		// filter params (all optional)
		const page_str = nextRequest.nextUrl.searchParams.get("page");
		const limit_str = nextRequest.nextUrl.searchParams.get("limit");
		const type = nextRequest.nextUrl.searchParams.get("type");
		const location = nextRequest.nextUrl.searchParams.get("location");
		const sort_by = nextRequest.nextUrl.searchParams.get("sort_by");
		const is_ascending = nextRequest.nextUrl.searchParams.get("is_ascending");
		const upcoming_maintenance = nextRequest.nextUrl.searchParams.get(
			"upcoming_maintenance"
		);

		const filters: Prisma.assetWhereInput[] = [];
		const orderBy: Prisma.assetOrderByWithRelationInput[] = [];

		if (type) {
			filters.push({ type });
		}
		if (location) {
			filters.push({ location });
		}
		if (upcoming_maintenance) {
			filters.push({
				next_maintenance: {
					gte: new Date(upcoming_maintenance),
				},
			});
		}

		const page = page_str ? parseInt(page_str, 10) : 1;
		const limit = limit_str ? parseInt(limit_str, 10) : 10;
		const isAscending = !!is_ascending;
		const sortBy = sort_by || "updated_on";
		const skip = (page - 1) * limit;

		if (sortBy) {
			if (isAscending) {
				orderBy.push({
					[sortBy]: "asc",
				});
			} else {
				orderBy.push({
					[sortBy]: "desc",
				});
			}
		} else {
			orderBy.push({
				updated_on: "desc",
			});
		}

		const assets: asset[] = await prisma.asset.findMany({
			skip,
			take: limit,
			orderBy: {
				updated_on: "desc",
			},
		});

		if (assets.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${assets.length} assets`,
						assets
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(404, `No assets found`)),
				{
					status: 404,
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {asset}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddAssetSchema.safeParse(json);
		if (result.success) {
			const req: AddAsset = {
				...result.data,
				uid: `ASSET-${moment().format("YYMMDDHHmmssSSS")}`,
				updated_on: new Date(),
				created_on: new Date(),
				updated_by: result.data.created_by,
			};

			const asset: asset = await prisma.asset.create({
				data: req,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Asset ${req.uid} has been successfully created`,
						asset
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
				JSON.stringify(ResponseMessage(409, `Asset already existed`)),
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
