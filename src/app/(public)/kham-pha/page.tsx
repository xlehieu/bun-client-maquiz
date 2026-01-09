'use client';
import { faCalendarDays, faFilter, faSchool, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, useContext, useEffect, useState } from 'react';
import QuizCard from '@/features/quiz/components/QuizCard';
import useDebounce from '@/hooks/useDebounce';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as QuizService from '@/api/quiz.service';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { Pagination, Select, Slider } from 'antd';
import { educationLevels, PAGE_SIZE, SUBJECTS, UNIVERSITIES } from '@/common/constants';
let count = 0;
const QuizzesContext = createContext<any>({});
const marks = {
    2000: '2000',
};
const nowYear = new Date().getFullYear();
const QuizzesProvider = ({ children }: any) => {
    count++;
    console.log(count);
    const [quizzes, setQuizzes] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [searchName, setSearchName] = useState('');
    const [schoolYear, setSchoolYear] = useState([2000, nowYear]);
    const [educationLevel, setEducationLevel] = useState([]);
    const [schools, setSchools] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isPending, setIsPending] = useState(false);
    // const findQuizMutation = useMutationHooks((data: any) => QuizService.getDiscoveryQuizzes(data));
    // schoolYear
    const schoolYearDebounce = useDebounce(schoolYear);
    const debouncedValueSearch = useDebounce(searchName);
    const educationLevelDebounce = useDebounce(educationLevel);
    // useEffect(() => {
    //     if (schoolYearDebounce.length === 2) {
    //         findQuizMutation.mutate({
    //             schoolYear: schoolYearDebounce, //main
    //             name: searchName,
    //             educationLevel,
    //         });
    //     }
    // }, [schoolYearDebounce]);
    //end
    //education level
    const buildQuery = () => {
        const params: string[] = [];
        if (page) {
            params.push(`skip=${page}`);
        }
        if (limit) {
            params.push(`limit=${limit}`);
        }
        if (searchName) {
            params.push(`name=${encodeURIComponent(searchName)}`);
        }

        if (schoolYear && schoolYear.length === 2) {
            params.push(`schoolYear=${schoolYear.map(encodeURIComponent).join(',')}`);
        }

        if (educationLevel && educationLevel.length > 0) {
            params.push(`educationLevel=${educationLevel.map(encodeURIComponent).join(',')}`);
        }

        if (schools && schools.length > 0) {
            params.push(`school=${schools.map(encodeURIComponent).join(',')}`);
        }

        if (subjects && subjects.length > 0) {
            params.push(`topic=${subjects.map(encodeURIComponent).join(',')}`);
        }

        return params.length > 0 ? `?${params.join('&')}` : '';
    };

    // Ví dụ dùng
    const query = buildQuery();
    console.log(query);
    const handleGetQuizzesDiscovery = async () => {
        try {
            setIsPending(true);
            const res = await QuizService.getDiscoveryQuizzes(query);
            console.log(res);
            if (res?.quizzes) {
                setQuizzes(res?.quizzes);
            }
        } catch (err) {
        } finally {
            setIsPending(false);
        }
    };
    useEffect(() => {
        (async () => handleGetQuizzesDiscovery())();
    }, [query]);
    // output ví dụ: "?searchName=math&schoolYearStart=2020&schoolYearEnd=2025&subjects=Toán học,Vật lý"

    // useEffect(() => {
    //     if (Array.isArray(educationLevelDebounce))
    //         findQuizMutation.mutate({
    //             schoolYear: schoolYear,
    //             name: searchName,
    //             educationLevel: educationLevelDebounce, //main
    //         });
    // }, [educationLevelDebounce]);
    //end
    // useEffect(() => {
    //     setQuizzes(findQuizMutation.data ?? []);
    // }, [findQuizMutation.data]);
    return (
        <QuizzesContext.Provider
            value={{
                quizzes,
                setQuizzes,
                setPage,
                setLimit,
                searchName,
                setSearchName,
                schoolYear,
                setSchoolYear,
                educationLevel,
                setEducationLevel,
                schools,
                setSchools,
                subjects,
                setSubjects,
                isPending,
            }}
        >
            {children}
        </QuizzesContext.Provider>
    );
};
const SideBar = () => {
    const { schoolYear, setSchoolYear, educationLevel, setEducationLevel, subjects, setSubjects, schools, setSchools } =
        useContext(QuizzesContext);

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
                            value={schoolYear}
                            range
                            marks={marks}
                            onChange={(value) => setSchoolYear(value)}
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
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e)}
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
                        value={subjects}
                        onChange={(e) => setSubjects(e)}
                        className="w-full custom-select-filter"
                    >
                        {SUBJECTS?.map((sub: any, index: any) => (
                            <Select.Option value={sub} key={index}>
                                {sub}
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
                        value={schools}
                        onChange={(e) => setSchools(e)}
                        className="w-full custom-select-filter"
                    >
                        {UNIVERSITIES?.map((uni: any, index: any) => (
                            <Select.Option value={uni} key={index}>
                                {uni}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </aside>
    );
};
const MainResult = () => {
    const { quizzes, searchName, setSearchName, isPending, setPage, setLimit } = useContext(QuizzesContext);

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
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-2xl outline-none transition-all font-medium text-slate-600"
                        placeholder="Tìm kiếm tên đề thi..."
                    />
                </div>

                <div className="px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-slate-500 text-sm font-bold">Số đề thi: </span>
                    <span className="text-primary font-black">{quizzes?.total || 0}</span>
                </div>
            </div>

            {/* Quizzes Grid */}
            <div className="relative min-h-[400px]">
                {isPending ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-[2rem]">
                        <LoadingComponent />
                    </div>
                ) : (
                    <>
                        {quizzes?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
                                {quizzes.map((quiz: any, index: any) => (
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
                <Pagination
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setLimit(pageSize);
                    }}
                    defaultCurrent={1}
                    pageSize={PAGE_SIZE}
                    total={quizzes?.total || 0}
                    showSizeChanger={false}
                />
            </div>
        </section>
    );
};
const DiscoverPage = () => {
    return (
        <QuizzesProvider>
            <div className="max-w-[1600px] mx-auto px-6">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
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
        </QuizzesProvider>
    );
};

export default DiscoverPage;
