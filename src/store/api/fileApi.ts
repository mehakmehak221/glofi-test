import { baseApi } from './baseApi';

export const fileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<any, { file: File; folder: string }>({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `upload/file?folder=${folder}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileApi;
