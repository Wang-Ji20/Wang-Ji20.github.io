---
title: rust-notes
date: 2023-09-08 16:05:43
tags:
- programming
- rust
- notes
categories:
- CS
---

## let `_` = .. is not a binding

When you are writing

```rust
let _ = some_function();
// returning value is dropped here.
```

The return value is dropped immediately, because you cannot gave a value to `_` as well as you cannot read it. `_` is not a variable so this statement is not a variable binding.

When using RAII in rust, don't forget this, use `_{ident}` to denote the return value. That thing is a variable so it follows correct scoping rules.

## impl trait vs. dyn trait

We can write these two functions:

```rust
fn print_this(s: impl ToString) {
    println!("{}", s.to_string());
}

fn print_this_dyn(s: &dyn ToString) {
    println!("{}", s.to_string())
}
```

`impl ToString` is static dispatch. The compiler specialize the function in compile-time, like a C++ template function.

`dyn ToString` is a dynamic dispatch, requiring a trait object which has a virtual function table. Here I use a reference because I didn't require s binding by `Size`.
