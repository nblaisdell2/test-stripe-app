import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

// TODO: Fix ReactQuery defaults
//   - https://medium.com/in-the-weeds/fetch-a-query-only-once-until-page-refresh-using-react-query-a333d00b86ff

export function useSQLQuery<T>(
  queryKeys: any[],
  queryFn: (context: QueryFunctionContext) => Promise<T>,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys,
    enabled,
    queryFn,
  });
}
