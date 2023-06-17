import { apiRequest } from "@src/utils/api";
import { useCallback, useState } from "react";
import useSWRInfinite from "swr/infinite";

interface Props {
  apiPath?: string;
  handleError: (error: Error) => void;
}

export const LIMIT = 50;

export const useInfiniteScroll = <Response>(props: Props) => {
  const [hasMore, setHasMore] = useState(true);

  const getKey = useCallback(
    (index: number) =>
      props.apiPath
        ? props.apiPath.replace("{offset}", (index * LIMIT).toString())
        : undefined,
    [props.apiPath]
  );

  const fetcher = useCallback(async (key: string) => {
    const result = (await apiRequest<Response>("get", key)).data;
    !result || (result as any).length < LIMIT
      ? setHasMore(false)
      : setHasMore(true);

    return result;
  }, []);

  const { data, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    onError: props.handleError,
  });

  const nextFetcher = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  return { data: data?.flat(), isLoading, nextFetcher, hasMore };
};
