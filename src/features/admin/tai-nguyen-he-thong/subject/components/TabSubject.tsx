'use client';
import React from 'react';
import { useCollection } from '../collection.tanstack';
const QUERY_KEY_SUBJECT = {
    LIST: 'SUBJECT_LIST',
};
const TabSubject = () => {
    const { data } = useCollection('subject', [QUERY_KEY_SUBJECT.LIST]);
    return <div></div>;
};

export default TabSubject;
