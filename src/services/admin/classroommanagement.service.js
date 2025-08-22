import axiosCredentials from '../../config/axios.credential';

export const getClassroomList = async (data) => {
    try {
        const { skip, limit } = data;
        const params = new URLSearchParams();
        Object.entries({ skip, limit }).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });
        const response = await axiosCredentials.get(`/admin/classroom-management/classroomList?${params}`);
        if (response.data) {
            return response.data.data;
        }
        return null;
    } catch (err) {
        if (err.response) throw new Error(err.response.data.message);
    }
};
export const changeClassroomDisabled = async (data) => {
    try {
        const { id } = data;
        if (!id) return null;
        const res = await axiosCredentials.patch(`/admin/classroom-management/disabledClassroom/${id}`);
        if (res.data) {
            return res.data;
        }
    } catch (err) {
        if (err.response) throw err.response.data.message;
    }
};
