---
title: Functional C++ in 2023 (1)
tags:
- c++
- functional programming
---

在 2023 年实现一个 C++ 的函数式编程库.

## std::function, 何物?

C++ 从 C 走来, 一直都是命令式的编程语言. 它一直没有把函数作为头等对象. 作为弥补措施, 在 C++11 中引入了 `std::function` 类, 用于封装 "可以调用" 的物件.

它可以封装:
- 函数指针
- lambda 表达式
- 函数对象(重载了 `operator()`)


## 参考资料

[1] [Inside std::function, part 1: The basic idea](https://devblogs.microsoft.com/oldnewthing/20200513-00/?p=103745)

