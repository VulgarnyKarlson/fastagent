import Benchmark from "benchmark";
import coreModels from "./core";
import undici from "./undici";

const suite = new Benchmark.Suite();

const models = [
    ... undici,
    ... coreModels,
];

models.forEach((model) => {
    suite.add(model.target, {
        defer: true,
        minSamples: 10,
        fn: model.fn,
    });
});

suite
    .on("cycle", (event: Event) => {
        console.log(event.target.toString());
    })
    .on("complete", () => {
        console.log(`Benchmark done`);
    })
    .run({ async: true });
