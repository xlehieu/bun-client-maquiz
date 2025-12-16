import axiosCredentials from '@/config/axios.credential';
import { File } from 'buffer';
export const ExportPdf = async (data: any) => {
    const { id, collection } = data;
    const res = await axiosCredentials.post('/file/exportPdf', JSON.stringify(data));
    console.log(res);
    if (!res?.data?.data?.data) {
        throw 'Lỗi';
    }
    const byteArray = new Uint8Array(res?.data?.data?.data);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
};
export const ImportData = async (data: any) => {
    const { id, file, collection } = data;
    // const buffer = await (file as File).arrayBuffer();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);
    formData.append('collection', collection);
    const res = await axiosCredentials.post('/file/importData', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log(res);
    return res;
};
