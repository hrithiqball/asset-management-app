'use client';

import React, { useEffect, useState } from 'react';
import { LuPackagePlus } from 'react-icons/lu';
import Loading from '@/components/client/Loading';
import Link from 'next/link';
import { asset } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AssetList({ assetList }: { assetList: asset[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Card className="rounded-md p-4 m-4 flex-grow">
      <div className="flex justify-between">
        <span>Asset List</span>
        <Button variant="ghost" size="sm">
          Add Asset
          <LuPackagePlus />
        </Button>
      </div>
      <div className="flex flex-row justify-between h-full">
        <div className="flex-1">
          <Table color="primary" className="mt-4" aria-label="Asset List">
            <TableHeader>
              <TableHead key="name">Name</TableHead>
              <TableHead key="description">Description</TableHead>
              <TableHead key="type">Type</TableHead>
              <TableHead key="location">Location</TableHead>
              <TableHead key="person_in_charge">Person In Charge</TableHead>
            </TableHeader>
            <TableBody>
              {assetList.map(asset => (
                <TableRow key={asset.uid}>
                  <TableCell>
                    <Link
                      className="hover:underline hover:text-blue-400"
                      href={{
                        pathname: `/asset/${asset.uid}`,
                        query: {
                          name: asset.name,
                          description: asset.description,
                          type: asset.type,
                          created_by: asset.created_by,
                          created_on: asset.created_on.toString(),
                          updated_by: asset.updated_by,
                          updated_on: asset.updated_on.toString(),
                          last_maintenance: asset.last_maintenance?.toString(),
                          last_maintainee: asset.last_maintainee,
                          location: asset.location,
                          next_maintenance: asset.next_maintenance?.toString(),
                          status_uid: asset.status_uid,
                          person_in_charge: asset.person_in_charge,
                        },
                      }}
                    >
                      {asset.name}
                    </Link>
                  </TableCell>
                  <TableCell>{asset.description}</TableCell>
                  <TableCell>
                    {asset.type === null || asset.type === ''
                      ? 'Not Specified'
                      : asset.type}
                  </TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.person_in_charge}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
