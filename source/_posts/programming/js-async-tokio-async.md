---
title: Tokio async is lazy
date: 2024-09-16
tags:
- Rust
- programming
categories:
- CS
---

Asynchronous programming is hard because its execution flow is different from normal flows. Async functions does not run from the start to the `return` clause. It returns many many times. For every `await`, it yields control back to its caller, and its caller yields control back to its own caller, etc. At last, the control flow propagates back to the runtime scheduler, which is invisible to the user. When the scheduler took control of the program, it first saves the "remaining" code and runtime context between `await` and `return`. These data are called `continuations(or tasks or future or promise)`. The scheduler looks at all continuations, `poll` them. When one continuation is ready to run, the scheduler give control to it, running the code from `await` to the next yielding point.

Initially, the continuation pool only has one element: the async main function. So actually if you have one async main function, and this main function awaits other async functions, the code is not async at all. Because the pool has only one continuation, it must wait until main is ready to execute anyway. It cannot do other useful business at this time. So it is equivalent to a synchronized main function.

If we want our code to do some other things when our main function is blocked, we must spawn a new task. After that, the pool will have lots of tasks for the scheduler to schedule. It can see which task is ready and choose ready task to execute.

This makes async programming looks like threading. If we use multithread programming, we spawn a lot of threads as well. The difference lay in the behavior of scheduler. A multithread scheduler is preemptive. It can stop our thread task at anytime during its execution. But asynchronous scheduler does not do this thing. It can not interfere our execution unless we `await` in code. Any code between `await`s are blocked. In fact, we can think of multi-threading as an "everywhere" async-await because the scheduler potentially are present in between every statements / expressions.

So a trivial example of rust tokio async is as follows:

```rust
#[tokio::main]
async fn main() {
    let aa = task::spawn(async {asFunc().await});
    let bb = task::spawn(async {
        print!("before 1000");
        sleep(Duration::from_millis(1000)).await;
        print!("1000")
    });
    let cc = task::spawn(async {
        print!("before 1");
        sleep(Duration::from_millis(1)).await;
        print!("1")
    });
    println!("Hello, world!");
    println!("Bye, world!");
    bb.await.unwrap();
}

async fn asFunc() {
    println!("async");
    let dd = fs::read_to_string("Cargo.toml");
    let hh = dd.await.unwrap();
    println!("out {}", hh);
    return;
}
```

We are interpreting the output result here:

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

In this code, we spawned three tasks. Adding the main task, the async pool has four tasks in sum.

```text
Main
aa
bb
cc
```

When the first `.await` is executed, the main task polls the bb task. Then when bb reaches the await inside bb, it yield the control back to tokio scheduler. That's why the third line only has `before 1000`.

Tokio then looks which of the remaining two tasks is ready for execution(note that because main awaits bb, these two tasks must be ready at the same time). So the `async` in the third line is printed by task aa. When task aa reaches `.await`, it yields the control back to the scheduler, then scheduler execute cc until the first `await`. The remaining output are printed by the continuation of the three tasks.

## JS async and Rust async

JavaScript async-await is different from tokio's, for two properties:

```javascript
const main = async () => {
    const aa = asFunc();
    console.log('main');
    await aa;
};

const asFunc = async () => {
    console.log('async');
    const dd = await fs.readFile('a.cs', 'ascii')
    console.log(dd);
    return;
};

main();
```

### lazy first await

JavaScript async functions execute its code before first `await` when called, while rust execute these code after the first `await`. So this code in js outputs this:

```text
async
main
async void main () {
    Console.Write("hello");
}
```

We can see the async is first, then main. Because it first execute `console.log('async')`. It did not yield until the first `await`. But the equivalent tokio code:

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

The output is

```text
main
async
[package]
name = "rusty"
version = "0.1.0"
edition = "2021"

[[bin]]
path = "src/main2.rs"
name = "alltuples"

[dependencies]
tokio = { version = "1.40.0", features = ["full"] }
```

we can see, the line `async` is executed in `aa.await`, rather than when `asFunc()` is called.

### task spawn

JS automatically spawn new task to its event loop, but in rust we must spawn new tasks explicitly. This is because many js async functions are part of runtime library, they insert the task to event loop automatically. For example, in the first rust example, its js equivalent only need to call function `setTimeOut` to insert a timed task to its event loop. But in tokio we must `task::spawn` it manually.
