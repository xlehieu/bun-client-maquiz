'use client';
import React from 'react';
import { useParams } from 'react-router-dom';

const QuizDetail = () => {
    const { id } = useParams();
    return <div>{id}</div>;
};

export default QuizDetail;
