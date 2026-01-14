'use client';
import { getAdminClassroomDetail } from '@/api/admin/classroommanagement.service';
import ButtonBack from '@/components/UI/ButtonBack';
import LazyImage from '@/components/UI/LazyImage';
import ClassExamCard from '@/features/classExam/components/ClassExamCard';
import TabNewFeeds from '@/features/classroom/components/TabNewFeeds';
import ClassPostCard from '@/features/posts/components/ClassPostCard';
import {
    faChalkboardTeacher,
    faEnvelope,
    faIdBadge,
    faNewspaper,
    faPeopleGroup,
    faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { Dropdown, Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import { useParams } from 'next/navigation';

const ClassroomDetail = () => {
    const { classId } = useParams();
    // const router = useRouter();
    // const queryClient = useQueryClient();
    const { data: classroomDetail } = useQuery({
        queryKey: ['ADMIN_CLASS_DETAIL', classId],
        queryFn: () => getAdminClassroomDetail(classId as string),
        select(dataQuery) {
            return dataQuery.data.data;
        },
    });
    const items: TabsProps['items'] = [
        {
            key: 'newfeeds',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faNewspaper} />
                    <span className="font-bold text-base">Bảng tin</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full">
                        <div className="md:rounded-[32px] overflow-hidden w-full h-64 relative group shadow-2xl shadow-slate-200/50">
                            {/* 1. Image Layer với Overlay Gradient */}
                            <div className="absolute inset-0 z-0">
                                <LazyImage
                                    src={classroomDetail?.thumb}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt="Class Thumb"
                                />
                                {/* Lớp phủ gradient để text trắng luôn nổi bật */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            {/* 2. Content Layer */}
                            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                <div className="flex flex-col gap-2">
                                    {/* Tag nhỏ phía trên tên lớp */}

                                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-normal line-clamp-1 leading-20 drop-shadow-md">
                                        {classroomDetail?.name}
                                    </h3>

                                    <p className="text-white/70 text-sm font-medium flex items-center gap-2">
                                        <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 uppercase tracking-wider">
                                            Mã lớp: {classroomDetail?.classCode}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            {classroomDetail?.posts && classroomDetail?.posts?.length > 0 && (
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">📢</span>
                                    <h2 className="text-2xl font-bold text-gray-800">Bài thi và bài đăng</h2>
                                </div>
                            )}

                            {classroomDetail?.posts?.map((postOrExam, index: number) => (
                                <ClassPostCard post={postOrExam} key={postOrExam._id} viewByAdmin />
                            ))}
                            {classroomDetail?.classExams.map((exam) => (
                                <ClassExamCard exam={exam} key={exam._id} viewByAdmin />
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'everyone',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faPeopleGroup} />
                    <span className="font-bold text-base">Mọi người</span>
                </div>
            ),
            children: (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 md:p-8 bg-[#fdfdfd] min-h-screen space-y-12">
                        {/* PHẦN GIÁO VIÊN */}
                        <section className="">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-yellow-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-primary text-lg" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-primary-bold">
                                    Giáo viên
                                </h2>
                            </div>

                            <div className="max-w-md">
                                <div className="bg-white border-[3px] border-black rounded-[2rem] p-6 flex items-center gap-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="w-20 h-20 rounded-2xl border-[3px] border-black overflow-hidden bg-blue-100 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <img
                                            src={
                                                (classroomDetail?.teacher as any)?.avatar ||
                                                'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
                                            }
                                            alt={(classroomDetail?.teacher as any)?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                            Teacher
                                        </span>
                                        <p className="font-black text-2xl uppercase italic text-slate-800 leading-tight">
                                            {(classroomDetail?.teacher as any)?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold bg-yellow-400 border-2 border-black px-3 py-0.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                CHỦ NHIỆM
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* PHẦN HỌC SINH */}
                        <section>
                            <div className="flex items-center justify-between mb-8 border-b-[3px] border-black pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <FontAwesomeIcon icon={faUserGraduate} className="text-white text-lg" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                                        Danh sách học viên
                                    </h2>
                                </div>
                                <div className="bg-primary text-white px-4 py-1 rounded-full font-black text-sm shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                                    {classroomDetail?.students?.length || 0} THÀNH VIÊN
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {classroomDetail?.students?.map((student: any) => (
                                    <div
                                        key={student._id}
                                        className="bg-white border-[3px] border-black rounded-[2.5rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center"
                                    >
                                        {/* Avatar student */}
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 rounded-[2rem] border-[3px] border-black overflow-hidden bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                {student.avatar ? (
                                                    <img
                                                        src={student.avatar}
                                                        alt={student.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-2xl font-black text-blue-300 uppercase">
                                                        {student?.name?.charAt(0) || 'S'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-white border-2 border-black w-8 h-8 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <FontAwesomeIcon icon={faIdBadge} className="text-xs" />
                                            </div>
                                        </div>

                                        {/* Thông tin học viên */}
                                        <div className="w-full text-center space-y-3">
                                            <p className="font-black text-lg uppercase tracking-tight text-slate-800 truncate px-2">
                                                {student.name || 'Học sinh'}
                                            </p>

                                            <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-50 border-2 border-black/5 rounded-xl py-2">
                                                <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                                                <p className="text-[13px] font-bold truncate max-w-[150px]">
                                                    {student?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <section className="mt-5">
            <div>
                <ButtonBack>Quay lại danh sách lớp học</ButtonBack>
            </div>
            <div className="w-full mt-2 md:mt-0 min-h-screen px-8 py-4 flex flex-col">
                {/* <Tabs defaultActiveKey="newfeeds">
                    <TabPane tab="Bảng tin" key="newfeeds">
                        <TabNewFeeds />
                    </TabPane>
                    <TabPane tab="Mọi người" key="everyone">
                        <TabEveryone />
                    </TabPane>
                </Tabs> */}
                <Tabs
                    defaultActiveKey="newfeeds"
                    items={items}
                    className="custom-antd-tabs"
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </div>
        </section>
    );
};
export default ClassroomDetail;
