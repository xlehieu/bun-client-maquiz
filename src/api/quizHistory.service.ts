import axiosCredentials from '../config/axios.credential';

export const saveQuizHistory = async (data: any) => {
    const { score, quizId, answerChoices } = data;
    if (!score || !quizId || !answerChoices) throw new Error('Lỗi');
    const res = await axiosCredentials.post('/quiz-history', JSON.stringify(data));
    if (res.status === 200) return res?.data?.data;
};

export const getMyExamHistory = async (data: any) => {
    const { score, quizId, answerChoices } = data;
    if (!score || !quizId || !answerChoices) throw new Error('Lỗi');
    const res = await axiosCredentials.get('/quiz-history/mine');
    if (res.status === 200) return res?.data?.message;
};
