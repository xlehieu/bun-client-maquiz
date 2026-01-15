import TabCollection from '@/features/admin/tai-nguyen-he-thong/subject/components/TabCollection';
import { faBook, faSchool } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tabs, TabsProps } from 'antd';
import React from 'react';

const page = () => {
    const items: TabsProps['items'] = [
        {
            key: 'subjects',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faBook} />
                    <span className="font-bold text-base">Môn học</span>
                </div>
            ),
            children: <TabCollection collection="subject" />,
        },
        {
            key: 'schools',
            label: (
                <div className="flex items-center gap-2 px-2 py-1">
                    <FontAwesomeIcon icon={faSchool} />
                    <span className="font-bold text-base">Trường học</span>
                </div>
            ),
            children: <TabCollection collection="schools" />,
        },
    ];
    return (
        <div>
            <Tabs
                defaultActiveKey="subjects"
                items={items}
                className="custom-antd-tabs"
                size="large"
                animated={{ inkBar: true, tabPane: true }}
            />
        </div>
    );
};

export default page;
