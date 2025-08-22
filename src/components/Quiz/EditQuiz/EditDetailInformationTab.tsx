import { QuizDetailContext } from '@/context/QuizContext';
import { useContext, useState } from 'react';

const EditDetailInformationTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const [topic, setTopic] = useState('');
    const [schoolYear, setSchoolYear] = useState(new Date().getFullYear());
    const [educationLevel, setEducationLevel] = useState('');
    return (
        <section className="w-full bg-white shadow px-3">
            <div className="col-span-7 flex flex-col gap-4 px-6 py-4 bg-white"></div>
        </section>
    );
};

export default EditDetailInformationTab;
