import axiosCredentials from '../../config/axios.credential';

export const getUserList = async (data) => {
    console.log('ASDKALSJDL');
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });
    console.log('OKKKKKKK');
    const response = await axiosCredentials.get(`/admin/user-management/userList?${params}`);
    if (response.data) {
        return response.data.data;
    }
    return null;
};
export const changeActiveUser = async (data) => {
    const { id } = data;
    if (!id) return null;
    const res = await axiosCredentials.patch(`/admin/user-management/activeUser/${id}`);
    if (res.data) {
        return res.data;
    }
};
export const getUserDetail = async (data) => {
    try {
        const { id } = data;
        if (!id) return null;
        const res = await axiosCredentials.get(`/admin/user-management/detail/${id}`);
        if (res.data) {
            return res.data.data;
        }
    } catch (err) {
        if (err.response) throw err.response.data.message;
    }
};
