'use client'
import { classroomImageFallback } from '@/common/constants';
import LazyImage from '../LazyImage';
import Link from 'next/link';
import { userDashboardRouter } from '@/config';

const ClassroomCard = ({ classroom, isMyClassroom = false }: any) => {
    return (
        <div className="w-full bg-white transition-all block duration-300 border-2 border-gray-200 rounded-lg overflow-hidden pb-3 hover:drop-shadow-lg relative h-56">
            {classroom?.thumb ? (
                <LazyImage
                    alt={classroom?.name ?? 'classroom image'}
                    src={classroom?.thumb}
                    className="w-full h-20 opacity-60"
                />
            ) : (
                <LazyImage
                    alt={classroom?.name ?? 'classroom image'}
                    src={classroomImageFallback}
                    className="w-full h-20 opacity-60"
                />
            )}
            <div className="relative h-12">
                {classroom?.teacher?.avatar && (
                    <LazyImage
                        alt={classroom?.teacher?.name ?? 'teacher image'}
                        src={classroom?.teacher?.avatar}
                        className="w-12 h-full rounded-full overflow-hidden absolute z-0 -top-1/2 right-3"
                    />
                )}
                {classroom?.name && (
                    <Link
                        href={`${userDashboardRouter.classroom}/${classroom?.classCode}`}
                        className="z-10 text-2xl text-gray-700 font-normal ml-3 line-clamp-1 hover:underline"
                    >
                        {classroom?.name}
                    </Link>
                )}
            </div>
            {!isMyClassroom && classroom?.teacher?.name && (
                <div className="z-10 text-xl md:text-lg absolute bottom-2 text-black font-light ml-3 line-clamp-1">
                    {classroom?.teacher?.name}
                </div>
            )}
        </div>
    );
};
export default ClassroomCard;
