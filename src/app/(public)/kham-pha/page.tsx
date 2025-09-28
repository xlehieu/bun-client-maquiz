'use client';
import { faCalendarDays, faFilter, faSchool, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createContext, useContext, useEffect, useState } from 'react';
import QuizCard from '@/components/Quiz/QuizCard';
import useDebounce from '@/hooks/useDebounce';
import useMutationHooks from '@/hooks/useMutationHooks';
import * as QuizService from '@/services/quiz.service';
import LoadingComponent from '@/components/UI/LoadingComponent';
import { Pagination, Select, Slider } from 'antd';
import { educationLevels, PAGE_SIZE } from '@/common/constants';

const QuizzesContext = createContext<any>({});
const marks = {
    2000: '2000',
};
const nowYear = new Date().getFullYear();
const QuizzesProvider = ({ children }: any) => {
    const [quizzes, setQuizzes] = useState({});
    const [searchName, setSearchName] = useState('');
    const [schoolYear, setSchoolYear] = useState([2000, nowYear]);
    const [educationLevel, setEducationLevel] = useState([]);
    return (
        <QuizzesContext.Provider
            value={{
                quizzes,
                setQuizzes,
                searchName,
                setSearchName,
                schoolYear,
                setSchoolYear,
                educationLevel,
                setEducationLevel,
            }}
        >
            {children}
        </QuizzesContext.Provider>
    );
};
const SideBar = () => {
    const { setQuizzes, searchName, schoolYear, setSchoolYear, educationLevel, setEducationLevel } =
        useContext(QuizzesContext);
    const findQuizMutation = useMutationHooks((data: any) => QuizService.getDiscoveryQuizzes(data));
    // schoolYear
    const schoolYearDebounce = useDebounce(schoolYear);
    useEffect(() => {
        if (schoolYearDebounce.length === 2) {
            findQuizMutation.mutate({
                schoolYear: schoolYearDebounce, //main
                name: searchName,
                educationLevel,
            });
        }
    }, [schoolYearDebounce]);
    //end
    //education level
    const educationLevelDebounce = useDebounce(educationLevel);
    useEffect(() => {
        if (Array.isArray(educationLevelDebounce))
            findQuizMutation.mutate({
                schoolYear: schoolYear,
                name: searchName,
                educationLevel: educationLevelDebounce, //main
            });
    }, [educationLevelDebounce]);
    //end
    useEffect(() => {
        setQuizzes(findQuizMutation.data ?? []);
    }, [findQuizMutation.data]);

    return (
        <aside className="z-10 bg-white w-56 shadow-lg hidden md:block rounded py-5">
            <div>
                <FontAwesomeIcon icon={faFilter} className="ml-4 text-camdat text-xl" />
            </div>
            <div className="flex flex-col mx-4 mt-3 text-[#333]">
                <p>
                    <FontAwesomeIcon className="text-camdat" icon={faCalendarDays} /> Năm học
                </p>
                <Slider
                    value={schoolYear}
                    range
                    marks={marks}
                    defaultValue={schoolYear}
                    onChange={(value) => setSchoolYear(value)}
                    min={2000}
                    max={nowYear}
                />
            </div>
            <div className="flex flex-col mx-4 mt-3 text-[#333]">
                <p>
                    <FontAwesomeIcon className="text-camdat" icon={faSchool} /> Trình độ
                </p>
                <Select
                    className="mt-2"
                    mode="multiple"
                    allowClear
                    placeholder="Chọn trình độ"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e)}
                >
                    {educationLevels?.map((level, index) => (
                        <Select.Option value={level} key={index}>
                            {level}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </aside>
    );
};
const MainResult = () => {
    const { quizzes, setQuizzes, searchName, setSearchName, schoolYear } = useContext(QuizzesContext);

    const debouncedValueSearch = useDebounce(searchName);
    const findQuizMutation = useMutationHooks((data: any) => QuizService.getDiscoveryQuizzes(data));
    useEffect(() => {
        if (debouncedValueSearch.trim()) findQuizMutation.mutate({ name: debouncedValueSearch, schoolYear });
    }, [debouncedValueSearch]);
    useEffect(() => {
        setQuizzes(findQuizMutation.data ?? []);
    }, [findQuizMutation.data]);
    useEffect(() => {
        findQuizMutation.mutate({ skip: 0, limit: PAGE_SIZE });
    }, []);
    const handleChangePage = (e: any) => {
        findQuizMutation.mutate({ skip: e - 1, limit: PAGE_SIZE });
    };
    return (
        <section className="rounded-lg px-3 py-4 flex-1 bg-white shadow-xl">
            {findQuizMutation.isPending ? (
                <LoadingComponent />
            ) : (
                <>
                    <div className="flex justify-between border-b pb-2">
                        <div className="flex items-center rounded-md px-2 py-1 border border-gray-400 text-gray-700 focus-within:border-primary focus-within:shadow">
                            <FontAwesomeIcon icon={faSearch} className="text-camdat" />
                            <input
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="min-w-52 ml-2 outline-none caret-primary"
                                placeholder="Nhập từ khóa tìm kiếm"
                            />
                        </div>
                        <div>
                            <p className="text-[#333]">
                                Số đề thi: <span className="font-bold ">{quizzes?.total}</span>
                            </p>
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4 px-0 py-10 sm:grid-cols-3 md:grid-cols-4  2xl:grid-cols-5">
                        {quizzes?.quizzes?.length > 0 && (
                            <>
                                {quizzes?.quizzes?.map((quiz: any, index: any) => (
                                    <QuizCard
                                        key={index}
                                        name={quiz.name}
                                        accessCount={quiz.accessCount}
                                        examCount={quiz.examCount}
                                        imageSrc={quiz.thumb}
                                        id={quiz._id}
                                        slug={quiz.slug}
                                        questionCount={quiz.questionCount}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
            <Pagination
                onChange={(e) => handleChangePage(e)}
                defaultCurrent={1}
                defaultPageSize={PAGE_SIZE}
                total={quizzes?.total || PAGE_SIZE}
            />
        </section>
    );
};
const DiscoverPage = () => {
    return (
        <QuizzesProvider>
            <div className="relative">
                <h1 className="text-xl font-medium text-gray-700 pb-3">Khám phá đề thi</h1>
                <div className="flex flex-row space-x-4 items-start">
                    <SideBar />
                    <MainResult />
                </div>
            </div>
        </QuizzesProvider>
    );
};

export default DiscoverPage;
