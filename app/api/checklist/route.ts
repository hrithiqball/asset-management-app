import { Prisma, checklist } from '@prisma/client';
import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/utils/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';

/**
 * @description Validate the request body for adding a new checklist
 */
const AddChecklistSchema = z.object({
  title: z.string(),
  maintenance_uid: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  created_by: z.string(),
});

/**
 * @description Type for adding a new checklist
 */
type AddChecklist = z.infer<typeof AddChecklistSchema> & {
  uid: string;
  updated_on: Date;
  created_on: Date;
  updated_by: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    // filter params (all optional)
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');
    const sort_by = nextRequest.nextUrl.searchParams.get('sort_by');
    const is_ascending = nextRequest.nextUrl.searchParams.get('is_ascending');

    const maintenance_uid =
      nextRequest.nextUrl.searchParams.get('maintenance_uid');

    const filters: Prisma.checklistWhereInput[] = [];
    const orderBy: Prisma.checklistOrderByWithRelationInput[] = [];

    if (maintenance_uid) {
      filters.push({
        maintenance_uid,
      });
    }

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const isAscending = !!is_ascending;
    const sortBy = sort_by || 'title';
    const skip = (page - 1) * limit;

    orderBy.push({
      [sortBy]: isAscending ? 'asc' : 'desc',
    });

    const checklists: checklist[] = await prisma.checklist.findMany({
      skip,
      take: limit,
      orderBy,
      where: {
        AND: filters,
      },
    });

    if (checklists.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${checklists.length} checklist`,
            checklists,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No checklists found`)),
        {
          status: 204,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message ?? error)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * This asynchronous function handles POST requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {checklist}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddChecklistSchema.safeParse(json);
    if (result.success) {
      const request: AddChecklist = {
        ...result.data,
        uid: `CL-${moment().format('YYMMDDHHmmssSSS')}`,
        updated_on: new Date(),
        created_on: new Date(),
        updated_by: result.data.created_by,
      };

      const checklist: checklist = await prisma.checklist.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Checklist ${checklist.uid} has been successfully created`,
            checklist,
          ),
        ),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            400,
            result.error.issues.map(issue => issue.message).join(', '),
            null,
            result.error.issues.map(issue => issue.code.toString()).join(''),
          ),
        ),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify(ResponseMessage(409, `Checklist already existed`)),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
