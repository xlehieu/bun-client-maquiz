import axiosCredentials from "@/config/axios.credential";
import { ApiResponse } from "@/@types/api.type";
import { CollectionDefault } from "@/@types/common.type";

export const getListCollectionByName = async (collection: string) => {
  return axiosCredentials.get<ApiResponse<CollectionDefault[]>>(
    `/collection/${collection}`
  );
};
