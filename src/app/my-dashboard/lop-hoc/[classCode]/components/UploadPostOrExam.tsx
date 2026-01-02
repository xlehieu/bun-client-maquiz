import { createPost } from "@/api/posts.service";
import useMutationHooks from "@/hooks/useMutationHooks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchClassroomDetail } from "@/redux/slices/classrooms.slice";
import { BodyCreateClassExam } from "@/@types/classExam.type";
import { BodyCreatePost } from "@/@types/post.type";
import { hasValidTextInHTML } from "@/utils";
import { Form, Radio } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadPost from "./UploadPost";
import UploadExam from "./UploadExam";
type PostOrExam = "post" | "exam";
const UploadPostOrExam = () => {
  const router = useRouter();
  const { userProfile } = useAppSelector((state) => state.user);
  const { classroomDetail } = useAppSelector((state) => state.classroom);
  const dispatch = useAppDispatch();
  const [postOrExam, setPostOrExam] = useState<PostOrExam>("post");
  return (
    <section>
      {userProfile?._id === classroomDetail?.teacher._id && (
        <Radio.Group
          className="my-4"
          value={postOrExam}
          onChange={(e) => setPostOrExam(e.target.value)}
        >
          <Radio value="post">Đăng bài lớp học</Radio>
          <Radio value="exam">Thêm bài kiểm tra</Radio>
        </Radio.Group>
      )}
      {postOrExam === "post" && <UploadPost />}
      {postOrExam === "exam" && <UploadExam />}
    </section>
  );
};

export default UploadPostOrExam;
