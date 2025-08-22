import { Suspense } from 'react';
import LoadingComponent from '@/components/UI/LoadingComponent';
import ResetPasswordForm from './ResetPasswordForm';
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
                {/* <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <button
                type="submit"
                onClick={handleSubmit}
                className="bg-green-500 text-white p-2 rounded mt-2 hover:cursor-pointer"
            >
                {resetPasswordMutation?.isPending ? <LoadingOutlined /> : 'Xác nhận'}
            </button> */}
                <ResetPasswordForm />
                <form className="mx-auto w-full md:max-w-96 space-y-6" method="post"></form>
            </div>
        </Suspense>
    );
}
