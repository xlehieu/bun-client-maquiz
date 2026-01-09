import UploadExam from '@/features/classExam/components/UploadExam';
import UploadPost from '@/features/posts/components/UploadPost';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Radio } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
type PostOrExam = 'post' | 'exam';
const UploadPostOrExam = () => {
    const router = useRouter();
    const { userProfile } = useAppSelector((state) => state.user);
    const { classroomDetail } = useAppSelector((state) => state.classroom);
    const dispatch = useAppDispatch();
    const [postOrExam, setPostOrExam] = useState<PostOrExam>('post');
    return (
        <section>
            {userProfile?._id === classroomDetail?.teacher._id && (
                <Radio.Group className="my-4" value={postOrExam} onChange={(e) => setPostOrExam(e.target.value)}>
                    <Radio value="post">Đăng bài lớp học</Radio>
                    <Radio value="exam">Thêm bài kiểm tra</Radio>
                </Radio.Group>
            )}
            {postOrExam === 'post' && <UploadPost />}
            {postOrExam === 'exam' && <UploadExam />}
        </section>
    );
};

export default UploadPostOrExam;
