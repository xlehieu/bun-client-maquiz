import axiosCredentials from '../config/axios.credential';

export const verify = async () => {
    const res = await axiosCredentials.get('/admin/verify');
    if (res.data) return res?.data?.isAdmin;
    return false;
};
