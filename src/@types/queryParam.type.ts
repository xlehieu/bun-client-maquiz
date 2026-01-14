export type QueryListParams<TQuery> = {
    limit?: number;
    skip?: number;
} & TQuery;
