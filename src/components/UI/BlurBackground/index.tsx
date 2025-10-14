'use client'
const BlurBackground = ({ isActive, onClick = () => {}, ...props }: any) => {
    return (
        <div
            onClick={() => onClick()}
            className={`${
                isActive ? 'block' : 'hidden'
            } fixed z-[999] inset-0 opacity-55 min-w-full min-h-screen bg-black`}
            {...props}
        ></div>
    );
};

export default BlurBackground;
