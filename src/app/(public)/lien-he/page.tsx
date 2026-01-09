import Info from './info';

const ContactPage = () => {
    return (
        <section className="min-h-screen pt-28 pb-12 bg-slate-50/50">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
                        LIÊN HỆ <span className="text-primary">CHÚNG TÔI</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Bạn có thắc mắc hay cần hỗ trợ về Maquiz? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và phản
                        hồi bạn sớm nhất có thể.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Side: Info cards */}
                    <div className="w-full lg:w-1/3 space-y-8 flex flex-col items-center lg:items-start">
                        <div className="w-full bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                            <h3 className="text-xl font-bold mb-2 relative z-10">Kết nối trực tiếp</h3>
                            <p className="text-blue-100 text-sm mb-6 relative z-10">
                                Chọn phương thức liên hệ thuận tiện nhất cho bạn.
                            </p>
                            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
                        </div>

                        <Info />
                    </div>

                    {/* Right Side: Map */}
                    <div className="w-full lg:w-2/3 h-[550px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white relative group">
                        {/* Overlay giả lập cho đẹp */}
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                Vị trí văn phòng
                            </p>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13771.631935991!2d105.75408247058199!3d21.02629819895223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134550a1216d58b%3A0x907e9b89ffe640be!2zQ8ahIFPhu58gQ2FpIE5naGnhu4duIE1hIFTDunkgU-G7kSA1IC0gSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1741078758336!5m2!1svi!2s"
                            className="w-full h-[450px]"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
