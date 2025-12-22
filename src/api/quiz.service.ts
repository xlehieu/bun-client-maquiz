import { ApiResponse } from "@/types/api.type";
import axiosCredentials from "../config/axios.credential";
import axiosApplicationJson from "../config/axios.default";
import { IQuerySkipLimit, IQuiz } from "@/interface";
import {
  BodyCreateGeneralInformationQuiz,
  BodyUpsertQuestionQuiz,
  QuizDetailRecord,
} from "@/types/quiz.type";

export const getMyQuizzes = async (params?: Partial<IQuerySkipLimit>) => {
  const res = await axiosCredentials.get<
    ApiResponse<{
      total: number;
      currentPage: number;
      totalPages: number;
      quizzes: QuizDetailRecord[];
    }>
  >(`/quizzes/mine`, { params });
  return res.data.data;
};
export const getQuizDetailAPI = async (id: string) => {
  if (!id) null;
  const res = await axiosCredentials.get<ApiResponse<QuizDetailRecord>>(
    `/quizzes/detail/${id}`
  );
  return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const createGeneralInformationQuiz = async (
  body: BodyCreateGeneralInformationQuiz
) => {
  const res = await axiosCredentials.post(`/quizzes/create`, body);
  return res.data.data;
};
export const createQuestion = async (data: BodyUpsertQuestionQuiz) => {
  const res = await axiosCredentials.put(
    `/quizzes/createQuestion`,
    JSON.stringify(data)
  );
  return res.data.data;
};
// region Update
export const updateQuizGeneralInfo = async (
  id: string,
  data: BodyCreateGeneralInformationQuiz
) => {
  const res = await axiosCredentials.put(
    `/quizzes/updateGeneralInfo/${id}`,
    data
  );
  return res.data.data;
};
export const updateQuizQuestion = async (data: BodyUpsertQuestionQuiz) => {
  const res = await axiosCredentials.put<ApiResponse<QuizDetailRecord>>(
    `/quizzes/updateQuestion`,
    data
  );
  return res.data.data;
};
export const getQuizPreviewBySlug = async (slug: string) => {
  return axiosCredentials.get<ApiResponse<QuizDetailRecord>>(
    `/quizzes/preview/${slug}`
  );
};
export const getQuizForExamBySlug = async (slug: string) => {
  if (!slug) {
    return null;
  }
  const res = await axiosCredentials.get(`/quizzes/forExam/${slug}`);
  return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
};
export const deleteQuiz = async (id: string) => {
  if (!id) {
    return null;
  }
  const res = await axiosCredentials.delete(`/quizzes/${id}/deleteQuiz`);
  return res.data.data;
};
export const getDiscoveryQuizzes = async (data: any) => {
  const {
    name,
    page,
    limit,
    skip,
    subject,
    topic,
    schoolYear,
    educationLevel,
  } = data;
  const params = new URLSearchParams();
  Object.entries({
    name,
    page,
    limit,
    skip,
    subject,
    topic,
    schoolYear,
    educationLevel,
  }).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  const res = await axiosApplicationJson.get(`/quizzes/discovery?${params}`);

  return res.data.data;
};
export const getQuizzesBySlugs = async (data: any) => {
  const { slugs } = data;
  if (!slugs || slugs.length === 0) return null;
  const query = encodeURIComponent(JSON.stringify(slugs));
  const res = await axiosCredentials.get(
    `/quizzes/getQuizzesBySlugs?slugs=${query}`
  );

  return res.data.data;
};
