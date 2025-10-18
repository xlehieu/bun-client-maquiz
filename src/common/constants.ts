export const INIT_STATE = {
    products: {
        isLoading: false,
        data: [],
    },
};
export const UNIVERSITIES = [
    'Trường Đại học Sư phạm Hà Nội 2',
    'Đại học Quốc gia Hà Nội',
    'Trường Đại học Công nghệ (ĐHQG Hà Nội)',
    'Trường ĐH Khoa học Tự nhiên (ĐHQG Hà Nội)',
    'Trường ĐH Khoa học Xã hội và Nhân văn (ĐHQG Hà Nội)',
    'Trường Đại học Kinh tế (ĐHQG Hà Nội)',
    'Trường Đại học Ngoại ngữ (ĐHQG Hà Nội)',
    'Khoa Luật (ĐHQG Hà Nội)',
    'Trường ĐH Giáo dục(ĐHQG Hà Nội)',
    'Khoa Y Dược (ĐHQG Hà Nội)',
    'Khoa Quốc tế (ĐHQG Hà Nội)',
    'Học viện Âm nhạc Quốc gia Việt Nam',
    'Học viện Báo chí Tuyên truyền',
    'Học viện Chính sách và Phát triển',
    'Học viện Công nghệ Bưu chính Viễn thông',
    'Học viện Hành chính Quốc gia',
    'Học viện Kỹ thuật Mật mã',
    'Học viện Ngân hàng',
    'Học viện Ngoại giao',
    'Học viện Nông nghiệp Việt Nam',
    'Học viện Phụ nữ Việt Nam',
    'Học viện Quản lý Giáo dục',
    'Học viện Tài chính',
    'Học viện Thanh Thiếu niên Việt Nam',
    'Học viện Y Dược học cổ truyền Việt Nam',
    'Trường Đại học Bách khoa Hà Nội',
    'Trường Đại học Công đoàn',
    'Trường Đại học Công nghệ Giao thông vận tải',
    'Trường Đại học Công nghiệp Hà Nội',
    'Trường Đại học Công nghiệp Việt Hung',
    'Trường Đại học Dược Hà Nội',
    'Trường Đại học Điện lực',
    'Trường Đại học Giao thông vận tải',
    'Trường Đại học Hà Nội',
    'Trường Đại học Khoa học và Công nghệ Hà Nội',
    'Trường Đại học Kinh tế Kỹ thuật Công nghiệp',
    'Trường Đại học Kinh tế Quốc dân',
    'Trường Đại học Kiểm sát Hà Nội',
    'Trường Đại học Kiến trúc Hà Nội',
    'Trường Đại học Lao động Xã hội',
    'Trường Đại học Lâm nghiệp',
    'Trường Đại học Luật Hà Nội',
    'Trường Đại học Mỏ Địa chất Hà Nội',
    'Trường Đại học Mỹ thuật Công nghiệp',
    'Trường Đại học Mỹ thuật Công nghiệp Á Châu',
    'Trường Đại học Mỹ thuật Việt Nam',
    'Trường Đại học Ngoại thương',
    'Trường Đại học Nội vụ Hà Nội',
    'Trường Đại học Sân khấu Điện ảnh',
    'Trường Đại học Sư phạm Hà Nội',
    'Trường Đại học Sư phạm Nghệ thuật Trung ương Hà Nội',
    'Trường Đại học Sư phạm Thể dục thể thao Hà nội',
    'Trường Đại học Tài nguyên và Môi trường Hà Nội',
    'Trường Đại học Thủ đô Hà Nội',
    'Trường Đại học Thủy lợi',
    'Trường Đại học Thương mại',
    'Trường Đại học Văn hóa Hà Nội',
    'Trường Đại học Xây dựng',
    'Trường Đại học Y Hà Nội',
    'Trường Đại học Y tế Công cộng',
    'Viện Đại học Mở Hà Nội',
    'Học viện cảnh sát',
];
export const productText = 'Sản phẩm';
export const formatsReactQuill = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'header',
    'blockquote',
    'code-block',
    'indent',
    'list',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'formula',
];
export const questionTypeContent: Record<number, string> = {
    1: 'Một đáp án',
    2: 'Nhiều đáp án',
    3: 'Nối đáp án',
};
export const imageQuizThumbDefault = [
    'https://firebasestorage.googleapis.com/v0/b/mah-auth.appspot.com/o/assets%2Fimages%2FquizThumbnail1.jpg?alt=media&token=e2b0919a-5142-4f9a-a12b-71234d1ebcb9',
    'https://firebasestorage.googleapis.com/v0/b/mah-auth.appspot.com/o/assets%2Fimages%2FquizThumbnail2.jpg?alt=media&token=6e816596-90a9-4e9a-b154-82b743a35749',
    'https://firebasestorage.googleapis.com/v0/b/mah-auth.appspot.com/o/assets%2Fimages%2FquizThumbnail3.jpg?alt=media&token=b14bf3aa-5cd8-4dba-a96e-f0af272bae92',
];
export const classroomImageFallback = `https://iteach.net/wp-content/uploads/new-teacher-classroom-setup.jpg`;
export const colors = {
    primary: '#0d99a6',
};
export const educationLevels = [
    'Tiểu học',
    'Trung học cơ sở',
    'Trung học phổ thông',
    'Trung cấp',
    'Cao đẳng',
    'Đại học',
    'Cao học',
    'Nghiên cứu sinh',
    'Trung tâm đào tạo',
    'Doanh nghiệp',
];
export const topics = [];

export const CONSTANTS_KEY_LOCAL_STORAGE = {
    quizzes_access_history: 'quiz_access_history',
};
export let PAGE_SIZE = 12;
export const ANSWER_CHOICE_ACTION = {
    ADD_ANSWER_QUESTION_TYPE_1: 'addAnswerQuestionType1',
    ADD_ANSWER_QUESTION_TYPE_2: 'addAnswerQuestionType2',
    ADD_ANSWER_QUESTION_TYPE_3: 'addAnswerQuestionType3',
};
export const SUBJECTS = [
    // Môn phổ thông
    "Toán học",
    "Ngữ văn",
    "Tiếng Anh",
    "Vật lý",
    "Hóa học",
    "Sinh học",
    "Lịch sử",
    "Địa lý",
    "Giáo dục công dân",
    "Tin học cơ bản",
    "Âm nhạc",
    "Mỹ thuật",
    "Thể dục",
    "Công nghệ",
    "Ngoại ngữ khác (Pháp, Nhật, Đức…)",
  
    // Môn trung học phổ thông nâng cao / bổ sung
    "Toán cao cấp (Đại số, Giải tích, Hình học)",
    "Vật lý nâng cao",
    "Hóa học nâng cao",
    "Sinh học nâng cao",
    "Tin học nâng cao / lập trình",
    "Kinh tế học cơ bản",
    "Tâm lý học cơ bản",
    "Triết học cơ bản",
  
    // Môn đại học / chuyên ngành
    // Khoa học tự nhiên
    "Toán cao cấp",
    "Vật lý lý thuyết",
    "Hóa phân tích",
    "Sinh học phân tử",
    "Khoa học môi trường",
  
    // Khoa học máy tính & công nghệ thông tin
    "Lập trình (Python, Java, C++)",
    "Cấu trúc dữ liệu & Thuật toán",
    "Hệ điều hành",
    "Cơ sở dữ liệu",
    "Trí tuệ nhân tạo",
    "Mạng máy tính",
    "An ninh mạng",
  
    // Kinh tế & Quản trị
    "Kinh tế vi mô / vĩ mô",
    "Quản trị học",
    "Marketing",
    "Tài chính – Ngân hàng",
    "Kế toán",
    "Thống kê kinh tế",
  
    // Khoa học xã hội & nhân văn
    "Tâm lý học",
    "Xã hội học",
    "Triết học nâng cao",
    "Ngôn ngữ học",
    "Lịch sử thế giới / Việt Nam",
    "Quan hệ quốc tế",
  
    // Kỹ thuật & công nghệ
    "Cơ học kỹ thuật",
    "Điện – Điện tử",
    "Cơ điện tử",
    "Kỹ thuật môi trường",
    "Xây dựng / Kiến trúc",
  
    // Y dược
    "Giải phẫu học",
    "Sinh lý học",
    "Dược lý học",
    "Khoa học điều dưỡng",
    "Y học lâm sàng",
  
    // Nghệ thuật & thiết kế
    "Mỹ thuật đại cương",
    "Thiết kế đồ họa",
    "Âm nhạc nâng cao",
    "Nhiếp ảnh",
    "Thiết kế thời trang"
  ];
  