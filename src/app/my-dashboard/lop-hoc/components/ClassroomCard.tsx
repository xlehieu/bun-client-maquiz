'use client';
import { classroomImageFallback } from '@/common/constants';
import Link from 'next/link';
import { userDashboardRouter } from '@/config/routes';
import LazyImage from '@/components/UI/LazyImage';
import { Button } from 'antd';
import { ClassroomDetailRecord } from '@/types/classroom.type';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { setClassroomDetail } from '@/redux/slices/classrooms.slice';

const ClassroomCard = ({
    classroom,
    isMyClassroom = false,
}: {
    classroom: ClassroomDetailRecord;
    isMyClassroom?: boolean;
}) => {
    // const dispatch = useAppDispatch();
    const router = useRouter();
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
                    <Button
                        type="text"
                        onClick={() => {
                            // dispatch(setClassroomDetail(classroom));
                            router.push(`${userDashboardRouter.CLASSROOM}/${classroom?.classCode}`);
                        }}
                        className="z-10 text-2xl text-gray-700 font-normal ml-3 line-clamp-1 hover:underline"
                    >
                        {classroom?.name}
                    </Button>
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
