---
title: Tokio async is lazy
date: 2024-09-16
tags:
- Rust
- programming
categories:
- CS
---

Asynchronous programming is hard because its execution flow differs from the normal sequential flow. An async function doesn’t run from start to finish in one go; instead, it returns control multiple times throughout its execution. Each time it hits an await, it yields control back to its caller, which may yield control to its own caller, and so on, until control eventually returns to the runtime scheduler. The scheduler, which operates behind the scenes, saves the remaining code and runtime context between await and return points, a process that involves handling "continuations" (also referred to as tasks, futures, or promises). The scheduler polls these continuations and, when one is ready to execute, transfers control back to it, allowing the code to run until the next await is encountered.

Initially, the continuation pool contains only one element: the async main function. If the main function awaits other async functions without additional tasks, the code doesn’t run asynchronously in the true sense because the pool has only one continuation. This means it must wait for the main function to finish executing before anything else can happen, making it essentially equivalent to synchronous code.

To enable true concurrency, we need to spawn new tasks. This increases the number of tasks in the pool, giving the scheduler more options to choose from and allowing it to execute whichever task is ready at a given moment.

This makes async programming look somewhat similar to multi-threading, where multiple threads can run concurrently. However, the key difference lies in the scheduler’s behavior: a multi-threaded scheduler is preemptive, meaning it can stop a thread at any time, whereas an async scheduler can only regain control when an await is encountered. As a result, the code between awaits runs uninterrupted. In a sense, multi-threading can be thought of as an "always-on" async-await model, where the scheduler is constantly present between every statement or expression.

Here is a simple example using Rust's Tokio async runtime:

```rust
#[tokio::main]
async fn main() {
    let aa = task::spawn(async { asFunc().await });
    let bb = task::spawn(async {
        print!("before 1000");
        sleep(Duration::from_millis(1000)).await;
        print!("1000");
    });
    let cc = task::spawn(async {
        print!("before 1");
        sleep(Duration::from_millis(1)).await;
        print!("1");
    });
    println!("Hello, world!");
    println!("Bye, world!");
    bb.await.unwrap();
}

async fn asFunc() {
    println!("async");
    let dd = fs::read_to_string("Cargo.toml").await.unwrap();
    println!("out {}", dd);
}
```

Let's interpret the output:

```text
Hello, world!
Bye, world!
before 1000async
before 1out [package]
name = "rusty"
version = "0.1.0"
edition = "2021"

[[bin]]
path = "src/main2.rs"
name = "alltuples"

[dependencies]
tokio = { version = "1.40.0", features = ["full"] }

11000
```

In this example, we spawn three tasks (aa, bb, cc). Along with the main function, the async pool contains four tasks in total.

```text
Main
aa
bb
cc
```

When the first .await is encountered, control returns to the Tokio scheduler, which polls the bb task. When bb reaches its own await, control is yielded back to the scheduler. This explains why the line before 1000 appears before any other output from the tasks.

The scheduler then looks for other tasks that are ready to run. Since the main task is awaiting bb, both aa and cc are ready. The scheduler runs aa, printing "async", then cc prints "before 1". The remaining output comes from the continuation of these tasks.

## JS async vs Rust async

JavaScript’s async-await model differs from Tokio’s in two significant ways:

### First await execution timing

In JavaScript, an async function executes everything before the first await immediately upon being called, while in Rust, code before the first await is deferred until explicitly awaited. Consider this JavaScript example:

```javascript
const main = async () => {
    const aa = asFunc();
    console.log('main');
    await aa;
};

const asFunc = async () => {
    console.log('async');
    const dd = await fs.readFile('a.cs', 'ascii');
    console.log(dd);
};

main();
```

The output is:

```text
async
main
```

Here, async is printed first because the code before the first await in asFunc executes immediately. However, the equivalent Rust code:

```rust
#[tokio::main]
async fn main() {
    let aa = asFunc();
    println!("main");
    aa.await;
}

async fn asFunc() {
    println!("async");
    let dd = fs::read_to_string("Cargo.toml").await.unwrap();
    println!("{}", dd);
}
```

produces this output:

```text
main
async
[package]
name = "rusty"
version = "0.1.0"
edition = "2021"
```

In Rust, the line "async" only executes after aa.await.

### Task spawning

In JavaScript, async functions are automatically added to the event loop as tasks, whereas in Rust, tasks must be manually spawned. This difference stems from JavaScript’s runtime environment, where many async functions are part of the standard library and insert tasks into the event loop automatically. In contrast, in Tokio, tasks need to be explicitly spawned using task::spawn.
