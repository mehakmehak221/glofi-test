import { baseApi } from './baseApi';

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
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
