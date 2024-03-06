---
title: haskell notes
date: 2023-09-08 16:05:52
tags:
- programming
- haskell
- notes
categories:
- CS
---

这里记录一些 Haskell 相关的笔记. 内容很杂, 除了最常规的 Haskell 语法语义, 标准库之外, 也可能会有一些函数式编程习语, 设计模式等内容.

## 运算符顺序

函数式编程语言似乎总是避免不了括号地狱(笑话: 苏联特工偷走了美国代码的最后一页, 发现都是`)`...). 不过我们可以在 Haskell 中妥善利用运算符顺序, 来减少括号的层数.

首先介绍一个概念: 结合性. 运算符的结合性决定了运算符在没有括号的情况下, 该如何结合. 例如, `+` 的结合性是左结合, 所以 `1 + 2 + 3` 等价于 `(1 + 2) + 3`. 而 `:` 的结合性是右结合, 所以 `1 : 2 : 3 : []` 等价于 `1 : (2 : (3 : []))`.

## `newtype` vs `data`

`newtype` 和 `data` 都可以用来定义新的类型. 但是它们有一些区别.

## `Functor`, `Applicative`, `Monad`

## `do` notation

## Monad Transformer
