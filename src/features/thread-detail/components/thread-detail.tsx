import CardReply from '@/features/home/components/card-reply';
import CardThreadDetail from '@/features/home/components/card-thread-detail';
import CreateReply from '@/features/home/components/create-reply';
import { Thread } from '@/features/thread/types/thread';
import { api } from '@/libs/api';
import { Box, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function ThreadDetail() {
  const { threadId } = useParams();
  const { data, isLoading } = useQuery<Thread>({
    queryKey: [`threads/${threadId}`],
    queryFn: async () => {
      const response = await api.get(`/threads/${threadId}`);

      return response.data;
    },
  });

  return (
    <Box>
      {isLoading ? (
        <Box display={'flex'} justifyContent={'center'} paddingY={50}>
          <Spinner />
        </Box>
      ) : (
        <>
          {data && (
            <>
              <CardThreadDetail {...data} />
              <CreateReply />
              {data.replies?.length ? (
                <>{data?.replies?.map((reply) => <CardReply {...reply} />)}</>
              ) : undefined}
            </>
          )}
        </>
      )}
    </Box>
  );
}
