'use client';
import React from 'react';
import MaquizLogoImage from '@/asset/image/Maquiz-rm-bg.png';
const MaquizLogo = ({ ...props }) => {
    return <img {...props} src={MaquizLogoImage.src} alt="logo" />;
};

export default MaquizLogo;
