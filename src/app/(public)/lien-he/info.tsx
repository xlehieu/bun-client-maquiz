'use client';
import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Info() {
    return (
        <div className="flex flex-col gap-3 text-center my-3">
            <p>
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                Lê Xuân Hiếu
            </p>
            <p>
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                0355055556
            </p>
            <p>
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                xlehieu@gmail.com
            </p>
        </div>
    );
}
