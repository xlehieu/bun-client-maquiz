import Info from './info';

const ContactPage = () => {
    return (
        <section className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-4xl my-5">LIÊN HỆ</h1>
            <Info />
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13771.631935991!2d105.75408247058199!3d21.02629819895223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134550a1216d58b%3A0x907e9b89ffe640be!2zQ8ahIFPhu58gQ2FpIE5naGnhu4duIE1hIFTDunkgU-G7kSA1IC0gSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1741078758336!5m2!1svi!2s"
                className="w-full h-[450px]"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </section>
    );
};

export default ContactPage;
