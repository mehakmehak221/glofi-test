import { useGetKycStatusQuery } from '@/store/api/kycApi';


export const useKycStatus = (options: Record<string, any> = {}) => {
  return useGetKycStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
    ...options,
  });
};
