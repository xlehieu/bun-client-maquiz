'use client';
import { faEnvelope, faPhone, faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactItem = ({ icon, label, value, href }: any) => (
    <a
        href={href}
        target="_blank"
        className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-1"
    >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-12">
            <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
        <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
                {label}
            </span>
            <span className="text-sm font-bold text-slate-700">{value}</span>
        </div>
    </a>
);

export default function Info() {
    return (
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <ContactItem icon={faUser} label="Đại diện" value="Lê Xuân Hiếu" />
            <ContactItem icon={faPhone} label="Điện thoại" value="0355 055 556" href="tel:0355055556" />
            <ContactItem icon={faEnvelope} label="Email" value="xlehieu@gmail.com" href="mailto:xlehieu@gmail.com" />
            <ContactItem icon={faLocationDot} label="Địa chỉ" value="Hà Nội, Việt Nam" />
        </div>
    );
}
