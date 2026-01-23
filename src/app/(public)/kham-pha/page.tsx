'use client';
import { educationLevels, PAGE_SIZE } from '@/common/constants';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { COLLECTION_NAME, useCollection } from '@/features/admin/tai-nguyen-he-thong/subject/collection.tanstack';
import { useListDiscovery } from '@/features/discovery/discovery.query';
import QuizCard from '@/features/quiz/components/QuizCard';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFilterDiscovery } from '@/redux/slices/discover.slice';
import { faCalendarDays, faFilter, faSchool, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination, Select, Slider } from 'antd';
import { useContext, useEffect, useState } from 'react';

const marks = {
    2000: '2000',
};
const nowYear = new Date().getFullYear();
const SideBar = () => {
    const dispatch = useAppDispatch();
    const { data: listSchool } = useCollection(COLLECTION_NAME.SCHOOL, [COLLECTION_NAME.SCHOOL]);
    const { data: listSubject } = useCollection(COLLECTION_NAME.SUBJECT, [COLLECTION_NAME.SUBJECT]);
    const FilterTitle = ({ icon, label }: any) => (
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={icon} className="text-blue-500" />
            {label}
        </p>
    );

    return (
        <aside className="sticky top-24 z-10 bg-white w-64 hidden lg:block rounded-[2rem] p-6 shadow-sm border border-slate-100 h-fit">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faFilter} />
                </div>
                <span className="font-black text-slate-700">BỘ LỌC</span>
            </div>

            <div className="space-y-8">
                {/* Năm học */}
                <div className="flex flex-col">
                    <FilterTitle icon={faCalendarDays} label="Năm học" />
                    <div className="px-2">
                        <Slider
                            range
                            marks={marks}
                            onChange={(value) =>
                                dispatch(
                                    setFilterDiscovery({
                                        schoolYear: value,
                                    }),
                                )
                            }
                            min={2000}
                            max={nowYear}
                            className="custom-slider"
                        />
                    </div>
                </div>

                {/* Trình độ */}
                <div className="flex flex-col">
                    <FilterTitle icon={faSchool} label="Trình độ" />
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn trình độ"
                        onChange={(e) =>
                            dispatch(
                                setFilterDiscovery({
                                    educationLevel: e,
                                }),
                            )
                        }
                        className="w-full custom-select-filter"
                        maxTagCount="responsive"
                    >
                        {educationLevels?.map((level: any, index: any) => (
                            <Select.Option value={level} key={index}>
                                {level}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {/* Môn học */}
                <div className="flex flex-col">
                    <FilterTitle icon={faSchool} label="Môn học" />
                    <Select
                        mode="tags"
                        placeholder="Chọn môn học"
                        onChange={(e) =>
                            dispatch(
                                setFilterDiscovery({
                                    subject: e,
                                }),
                            )
                        }
                        className="w-full custom-select-filter"
                    >
                        {listSubject?.map((subject) => (
                            <Select.Option value={subject.TenMuc} key={subject._id}>
                                {subject.TenMuc}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {/* Trường học */}
                <div className="flex flex-col">
                    <FilterTitle icon={faSchool} label="Trường học" />
                    <Select
                        mode="tags"
                        showSearch
                        placeholder="Tìm trường"
                        onChange={(e) =>
                            dispatch(
                                setFilterDiscovery({
                                    school: e,
                                }),
                            )
                        }
                        className="w-full custom-select-filter"
                    >
                        {listSchool?.map((school) => (
                            <Select.Option value={school.TenMuc} key={school._id}>
                                {school.TenMuc}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </aside>
    );
};
const MainResult = () => {
    // const { quizzes, searchName, setSearchName, isPending, setPage, setLimit } = useContext(QuizzesContext);
    const { filter } = useAppSelector((state) => state.discovery);
    const { data, isFetching } = useListDiscovery(filter);
    const dispatch = useAppDispatch();
    const [searchName, setSearchName] = useState('');
    const searchNameDebounce = useDebounce(searchName, 600);
    useEffect(() => {
        dispatch(
            setFilterDiscovery({
                name: searchNameDebounce,
            }),
        );
    }, [searchNameDebounce]);
    return (
        <section className="flex-1 min-h-[600px]">
            {/* Search Bar & Stats */}
            <div className="bg-white rounded-[2rem] p-4 mb-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96 group">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    />
                    <input
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-2xl outline-none transition-all font-medium text-slate-600"
                        placeholder="Tìm kiếm tên đề thi..."
                    />
                </div>

                <div className="px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-slate-500 text-sm font-bold">Số đề thi: </span>
                    <span className="text-primary font-black">{data?.total || 0}</span>
                </div>
            </div>

            {/* Quizzes Grid */}
            <div className="relative min-h-[400px]">
                {isFetching ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-[2rem]">
                        <LoadingComponent />
                    </div>
                ) : (
                    <>
                        {data?.quizzes?.length && data?.quizzes?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
                                {data?.quizzes?.map((quiz: any, index: any) => (
                                    <QuizCard key={index} quizDetail={quiz} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest">
                                    Không tìm thấy đề thi nào
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Pagination Center */}
            <div className="flex justify-center mt-8 bg-white p-4 rounded-2xl shadow-sm w-fit mx-auto border border-slate-100">
                {/* <Pagination
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setLimit(pageSize);
                    }}
                    defaultCurrent={1}
                    pageSize={PAGE_SIZE}
                    total={quizzes?.total || 0}
                    showSizeChanger={false}
                /> */}
            </div>
        </section>
    );
};
const DiscoverPage = () => {
    return (
        <div className="max-w-[1600px] mx-auto px-6">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mr-1">
                    KHÁM PHÁ
                    <span className="text-primary underline decoration-blue-100 underline-offset-8">ĐỀ THI</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                    Tìm kiếm hàng nghìn đề thi chất lượng từ cộng đồng Maquiz.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SideBar />
                <MainResult />
            </div>
        </div>
    );
};

export default DiscoverPage;
