'use client';
import { useQuery } from '@tanstack/react-query';
// import dynamic from 'next/dynamic';
import * as NewsService from '@/api/news.service';
import useMutationHooks from '@/hooks/useMutationHooks';
import { INewsItem } from '@/interface';
import {
    faArrowLeft,
    faCirclePlus,
    faEllipsisVertical,
    faPen,
    faPenNib,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message, Modal, Popover } from 'antd';
import HTMLReactParser from 'html-react-parser';
import React, { createContext, Dispatch, useContext, useEffect, useReducer, useState } from 'react';
import Masonry from 'react-masonry-css';

const action_type = {
    SET_NEWS: 'SET_NEWS',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
};
const NewsReducer = (state: any, action: any) => {
    console.log(state);
    switch (action.type) {
        case action_type.SET_NEWS:
            return [...action.payload];
        case action_type.UPDATE: {
            const updatedNews = state.map((news: INewsItem) =>
                news._id === action.payload._id ? action.payload : news,
            );
            return updatedNews;
        }
        case action_type.DELETE: {
            const updatedNews = state.filter((news: INewsItem) => news._id !== action.payload.id);
            return updatedNews;
        }
        default:
            return state;
    }
};
export type NewsAction = {
    type: string;
    payload?: any;
};
export type NewsContextType = {
    news: any;
    dispatchNews: Dispatch<NewsAction>;
};
const NewsContext = createContext<NewsContextType | null>(null);
const NewsProvider = ({ children }: { children: React.ReactNode }) => {
    const newsQuery = useQuery({ queryKey: ['news'], queryFn: () => NewsService.getNews() });
    const [news, dispatchNews] = useReducer(NewsReducer, []);
    useEffect(() => {
        if (newsQuery.data) {
            dispatchNews({
                type: action_type.SET_NEWS,
                payload: newsQuery.data,
            });
        }
    }, [newsQuery.data]);
    return <NewsContext.Provider value={{ news, dispatchNews }}>{children}</NewsContext.Provider>;
};
const NewsCard = ({ news, isOpenModal, currentId }: any) => {
    const newsContext = useContext(NewsContext);
    const dispatchNews = newsContext?.dispatchNews;
    const [openPopover, setOpenPopover] = useState<boolean>(false);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const handleClickUpdate = () => {
        setOpenPopover(false);
        setTitle(news.title);
        setContent(news.content);
        setIsOpenForm(true);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setOpenPopover(newOpen);
    };
    const handleBack = () => {
        setIsOpenForm(false);
        setOpenPopover(false);
        setTitle('');
        setContent('');
    };
    const updateNewsMutation = useMutationHooks((data: INewsItem) => NewsService.updateNews(data));
    const handleUpdate = () => {
        if (!content) return message.warning('Nhập tiêu đề và nội dung hộ cái🙂🙂🙂🙂');
        updateNewsMutation.mutate({ id: news._id, title, content } as any);
        setTitle('');
        setContent('');
        setIsOpenForm(false);
    };
    useEffect(() => {
        if (updateNewsMutation.isSuccess) {
            message.success('Cập nhật bài viết thành công');
            if (!dispatchNews) {
                message.error('Cập nhật bài viết không thành công');
                return;
            }
            dispatchNews({
                type: action_type.UPDATE,
                payload: updateNewsMutation.data,
            });
            updateNewsMutation.reset();
        }
    }, [updateNewsMutation.isSuccess, updateNewsMutation.data]);
    const handleOpenModal = () => {
        setOpenPopover(false);
        isOpenModal(true);
        currentId(news._id);
    };
    return (
        <div className="border-2 rounded-lg px-2 py-2 mb-4 overflow-scroll max-h-[500px]">
            <Popover
                content={
                    <div className="flex flex-col gap-2">
                        {!isOpenForm ? (
                            <>
                                <button className="text-yellow-400" onClick={handleClickUpdate}>
                                    <FontAwesomeIcon className="mr-1" icon={faPen} />
                                    Sửa
                                </button>
                                <button className="text-red-400" onClick={handleOpenModal}>
                                    <FontAwesomeIcon className="mr-1" icon={faTrash} />
                                    Xóa
                                </button>
                            </>
                        ) : (
                            <button className="text-yellow-400" onClick={handleBack}>
                                <FontAwesomeIcon className="mr-1" icon={faArrowLeft} />
                                Quay lại
                            </button>
                        )}
                    </div>
                }
                trigger="click"
                open={openPopover}
                onOpenChange={handleOpenChange}
                placement="left"
                className=" float-right top-2 right-2 px-2 py-2 hover:cursor-pointer"
            >
                <FontAwesomeIcon className="text-primary" icon={faEllipsisVertical} />
            </Popover>
            {!isOpenForm ? (
                <>
                    {news.title && <h4>{news?.title}</h4>}
                    {news.content && <div>{HTMLReactParser(news?.content)}</div>}
                </>
            ) : (
                <div className="flex flex-col gap-2 w-11/12 py-3">
                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-2 rounded-lg px-2 py-1"
                    />

                    <button onClick={handleUpdate} className="bg-primary text-white px-4 py-2 rounded-lg">
                        <FontAwesomeIcon icon={faPenNib} className="mr-1" />
                        Sửa
                    </button>
                </div>
            )}
        </div>
    );
};
const NewsPageMain = () => {
    const context = useContext(NewsContext);
    // { news, dispatchNews }
    const news = context?.news;
    const dispatchNews = context?.dispatchNews;
    const [isOpenForm, setIsOpenForm] = useState(false);
    const IsOpenFormContainer = isOpenForm ? 'div' : 'button';
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentId, setCurrentId] = useState('');
    // const editorRef = useRef<Jodit | null>(null);
    const handleOpenForm = () => {
        if (isOpenForm) return;
        setIsOpenForm(true);
    };
    const createNewsMutation = useMutationHooks((data: any) => NewsService.createNews(data));
    const handleSubmit = () => {
        if (!content) return message.warning('Nhập tiêu đề và nội dung 🙂🙂🙂🙂');
        createNewsMutation.mutate({ title, content } as any);
        setTitle('');
        setContent('');
        setIsOpenForm(false);
    };
    useEffect(() => {
        if (createNewsMutation.isSuccess) {
            message.success('Tạo bài viết thành công');
            if (!dispatchNews) {
                message.error('Cập nhật bài viết không thành công');
                return;
            }
            dispatchNews({
                type: action_type.SET_NEWS,
                payload: [...news, createNewsMutation.data],
            });
            createNewsMutation.reset();
        }
    }, [createNewsMutation.isSuccess]);
    const deleteNewsMutation = useMutationHooks((id: string) => NewsService.deleteNews(id));
    const handleOK = () => {
        deleteNewsMutation.mutate(currentId);
        setIsOpenModal(false);
    };
    useEffect(() => {
        if (deleteNewsMutation.isSuccess) {
            message.success('Xóa bài viết thành công');
            if (!dispatchNews) {
                message.error('Xóa bài viết không thành công');
                return;
            }
            dispatchNews({
                type: action_type.DELETE,
                payload: { id: currentId },
            });
            deleteNewsMutation.reset();
        }
    }, [deleteNewsMutation.isSuccess, deleteNewsMutation.data]);
    return (
        <>
            <Masonry
                breakpointCols={{ default: 3, 1100: 3, 700: 2 }}
                className="my-masonry-grid flex gap-4 py-5"
                columnClassName="my-masonry-grid_column"
            >
                <IsOpenFormContainer
                    onClick={handleOpenForm}
                    className="border-2 rounded-lg flex w-full justify-center min-h-[230px] items-center bg-white mb-4"
                >
                    {isOpenForm ? (
                        <>
                            <div className="flex flex-col gap-2 w-11/12 py-3">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border-2 rounded-lg px-2 py-1"
                                />
                                <button onClick={handleSubmit} className="bg-primary text-white px-4 py-2 rounded-lg">
                                    <FontAwesomeIcon icon={faPenNib} className="mr-1" />
                                    Tạo
                                </button>
                            </div>
                        </>
                    ) : (
                        <FontAwesomeIcon icon={faCirclePlus} className="text-5xl text-yellow-400" />
                    )}
                </IsOpenFormContainer>
                {news.map((item: INewsItem, index: number) => (
                    <NewsCard news={item} key={index} isOpenModal={setIsOpenModal} currentId={setCurrentId} />
                ))}
            </Masonry>
            <Modal
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                cancelText="Hủy"
                okText="Xóa"
                okType="danger"
                onOk={handleOK}
                title="Xóa bài này?"
            >
                <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
            </Modal>
        </>
    );
};
const NewsPage = () => {
    return (
        <NewsProvider>
            <NewsPageMain />
        </NewsProvider>
    );
};
export default NewsPage;
