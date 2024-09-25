"use client";
import DrawRoute from '@/components/ui/DrawRoute';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AddPath = () => {
    const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>([]);
    const searchParams = useSearchParams();
    const routeColor = searchParams.get('routeColor') || '';

    return (
        <div className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]">
            <Link
                href={`/routes/create`}
                className='bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200'>
                Add
            </Link>
        </div>
    );
}

export default AddPath;
