---
title: wasm-bindgen, A rust compiler to webassembly
date: 2023-12-23 23:51:07
catagories:
    - CS
tags:
    - Rust
    - Webassembly
---

I have always wanted to use web technology to present my projects. It's portable, beautiful and fast. Who want to download a huge application and install them while they can click a link in the browser and everything settles down within a second? And whoever developer wants to tirelessly adapt their app to tens of platforms, it's not me.

But my attempts are often hindered by a demon, [Javascript](https://james-iry.blogspot.com/2009/05/brief-incomplete-and-mostly-wrong.html). It has terrible syntax and mostly wrong semantics, yet it has been the lingua franca of the world wide web. How can no one notice that? There must be a way to bypass that. I want to write Rust in web!

And there it is, the [webassembly](https://webassembly.org/)(acc. wasm) project. It introduces a intermediate language between high-level programming languages and the web browser. Compilers can compile their code into a form which is later interpreted by the browser. To satisfy the contract, three parts of work must be done:

- the standard: the compiler and the browser must agree on some assumptions.

- compiler: it can turns the code to webassembly

- browser: it should provide runtime environment for wasm to run.

The browser side is not discussed here. I want to explore the second part. To understand it, however, I must survey on the standard first.

## wasm runtime


