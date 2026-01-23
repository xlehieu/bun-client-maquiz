import { UseQueryOptionsCustom } from '@/@types/common.type';
import { ExamAttemptRecord } from '@/@types/examAttempt.type';
import { getDiscoveryQuizzes } from '@/api/quiz.service';
import { DiscoverFilterState } from '@/redux/slices/discover.slice';
import { useQuery } from '@tanstack/react-query';

export const useListDiscovery = (filter: DiscoverFilterState['filter']) => {
    return useQuery({
        queryKey: ['LIST_DISCOVERY', JSON.stringify(filter)],
        queryFn: () => getDiscoveryQuizzes(filter),
    });
};
