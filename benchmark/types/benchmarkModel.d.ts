export interface BenchmarkModel {
    target: string;
    fn: (defer: { resolve: () => void }) => void;
    defer?: boolean;
}
