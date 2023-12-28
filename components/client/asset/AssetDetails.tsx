'use client';

import React from 'react';
import { asset, checklist_use } from '@prisma/client';
import Image from 'next/image';
import moment from 'moment';
import { LuWrench } from 'react-icons/lu';
import {
  BsFillPersonBadgeFill,
  BsPassFill,
  BsClockFill,
  BsClockHistory,
} from 'react-icons/bs';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AssetDetails({
  asset,
  checklistUse,
}: {
  asset: asset;
  checklistUse: checklist_use[];
}) {
  return (
    <div className="flex flex-col sm:flex-row h-full p-4">
      <div className="flex-shrink-0 w-full mb-4 sm:mb-0 sm:w-3/4 mr-4">
        <Card className="p-4 flex-1 h-full">
          <div className="h-30 min-w-min">
            <div className="flex flex-row">
              <Image
                alt={asset.name}
                src={
                  'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                }
                width={500}
                height={800}
                className="object-cover rounded-md"
              />
              <Table className="mb-4 mx-4" aria-label="Asset Details">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Description</span>
                    </TableCell>
                    <TableCell>{asset.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Type</span>
                    </TableCell>
                    <TableCell>
                      {asset.type === null || asset.type === ''
                        ? 'Not Specified'
                        : asset.type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Created By</span>
                    </TableCell>
                    <TableCell>
                      {asset.created_by} on{' '}
                      {moment(asset.created_on).format('DD/MM/yyyy hh:mmA')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Location</span>
                    </TableCell>
                    <TableCell>
                      {asset.location === null || asset.location === ''
                        ? 'Not Specified'
                        : asset.location}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
      <div className="sm:flex flex-col w-full sm:w-1/4">
        <Card className="mb-4 p-4 flex-2 overflow-y-auto">
          <div className="flex flex-row items-center">
            <BsFillPersonBadgeFill />
            <span className="font-bold ml-4">Team</span>
          </div>
          <Table aria-label="Team" color="primary">
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">
                  Person In Charge
                </TableCell>
                <TableCell className="justify-center">
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                      alt="Jane Doe"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="semi-bold">Maintainer</TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                      alt="Jane Doe"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                      alt="Jane Doe"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                      alt="Jane Doe"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card className="mb-4 p-4 flex-2 overflow-y-auto">
          <div className="flex flex-row items-center">
            <BsPassFill />
            <span className="font-bold ml-4">Checklist</span>
          </div>
          <div className="">
            {checklistUse.map(checklist => (
              <div key={checklist.uid} className="flex flex-row items-center">
                <Badge variant="default">{checklist.title}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 flex-1 overflow-y-auto">
          <div className="flex flex-row items-center">
            <LuWrench />
            <span className="font-bold ml-4">Maintenance</span>
          </div>
          <Table className="mt-4" aria-label="Maintenance">
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">
                  Next Maintenance
                </TableCell>
                <TableCell className="justify-center">
                  <Badge>
                    <BsClockFill size={18} />
                    {asset.next_maintenance !== null
                      ? moment(asset.next_maintenance).format('DD/MM/yyyy')
                      : 'No Scheduled Maintenance'}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="semi-bold">Last Maintenance</TableCell>
                <TableCell>
                  <Badge>
                    <BsClockHistory size={18} />
                    {asset.last_maintenance !== null
                      ? moment(asset.last_maintenance).format('DD/MM/yyyy')
                      : 'No Maintenance Completed'}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button className="my-4">Create Maintenance Request</Button>
        </Card>
      </div>
    </div>
  );
}
