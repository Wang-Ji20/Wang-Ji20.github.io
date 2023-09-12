---
title: Programming Language Theory - 1 PLs (WIP)
date: 2023-09-07 22:04:36
tags:
- plt
- notes
categories:
- CS
---

PLT concerns me less than anything in the world in the past. I hate logic and I hate compilers. They are typically too boring to me. So I am very surprised to witness myself charmed by this subject. This realm is quite new and unfamiliar to me(not to the world, however; there are generally too few PLT education resources in China here). So I will start from the very beginning and try to record what I learnt in this blog series. They may miss every points and abuse every bad writing practice in English prose, but just forgive a terrible college student now.

## Motivation

How do we write codes and how do we write comments? My first motivation to learn PLT cames from this seemingly obvious problem. why, look at some my old codes:

```cpp
// visit the root node is the entry method
void CodegenVisitor::visit(std::shared_ptr<AST> ast) {
  // we create a new basic block here.
  BasicBlock *BB = BasicBlock::Create(*TheContext, "ee");
  // insert my item here.
  Builder->SetInsertPoint(BB);
  for (auto &&i : ast->children) {
    // codegen every child.
    i->codegen(*this);
  }
  return;
}
```

This code is from my first compiler project: C to LLVM IR. These domain knowledge can be ignored. We can just look at the code.

Of course, the current I recognize these comment bad. They just repeats what the real C++ code does, so they are just redundency. Not only redundent, but also harmful. If I changed the code and the comment remain unchanged, then the comment obsoletes and mislead readers. I know I should delete them.

This is just a simple example, but the problem is not such simple, especially when we think codes as "comments" for humans. Really, why only comments are comments? We all know that computer does not reads C++ programs. They are read by us. So they *are* comments. They should be as clear as possible.

I am not just saying that we should write clean codes, however. That's software engineering practitioner's work. More work should focus on the language itself. We express our idea in languages, and their semantics impacts us a lot. It's difficult to do something in MASM, while expressing our idea in Python(or, let's say, Haskell) pleases us more. That's not just practice, theory inhibits as well. PLT discovers how we can *compose* our programs in an elegant and maintainable way. So motivation 1: I want to know what affects my programming experience and how can we express our ideas with more pleasant. We only live so long, so we ought to live happier.

---

Several days ago I watched a talk about how to write *Software that can not be hacked*, which is just a terrible publicity for a random company... But the idea is important, though. We as programmers always want to write correct and efficent code, but how can we achieve this? We all know tests are not enough. They just show that in some cases the result of the program is acceptable, but cannot prove the program is correct.

I wrote test for many programs. But as a notorius *bad* programmer, even I tried so hard, there still are corner cases where my software fails and segfault(In particular, when I say segfault, I do mean I'm writing C++). So I am always struggling for finding ways to write right programs. But how can I do this? FP came to rescue. I write less and less imperative commands, turns to recursive and minimizes the program states. What impresses me most is the haskell code below, a quicksort:

```haskell
quicksort :: Ord a => [a] -> [a]
quicksort [] = []
quicksort (x:xs) = quicksort [y | y <- xs, y < x] ++ [x] ++ quicksort [y | y <- xs, y >= x]
```

Its implementation is simple. It's terse and elegant. But the most importantly, its correctness is trival to see. we can use induction to prove that in no time. Remembering all the fuzz and pain I suffered from C++ loops, I'm totally fascinated by this.



## bibliography

- books
    - The Little Schemer (Scheme)
    - Structure and Interpretation of Computer Programs (Scheme)
    - Programming Language Pragmatics (PLT & Compiler)
    - Type and Programming Languages (PLT)
    - Software Foundations (Coq, Logic)
- course
    - UW Coursera Programming Languages (PLT)
    - Stanford CS242 Programming Languages (PLT)

tools & PLs:
- Scheme
- Racket
- Haskell
- OCaml
- Standard ML
- Emacs
- Rust
- Webassembly
- lua
