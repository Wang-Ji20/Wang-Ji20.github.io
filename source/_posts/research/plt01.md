---
title: why study programming languages
date: 2023-09-07 22:04:36
tags:
- plt
- notes
categories:
- CS
---

PLT concerns me less than anything in the world in the past. I hate logic and I hate compilers. They are typically too boring to me. So I am very surprised to witness myself charmed by this subject. This realm is quite new and unfamiliar to me(not to the world, however; there are generally too few PLT education resources in China here). So I will start from the very beginning and try to record what I learnt in this blog series. They may miss every points and abuse every bad writing practice in English prose, but just forgive a terrible college student now.

## Motivation

### Make Computer Programs Writeable and Readable

How do we write codes and how do we write comments? My first motivation to learn PLT came from this seemingly obvious problem. why, look at some my old codes:

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

Of course, the current I recognize these comment bad. They just repeats what the real C++ code does, so they are just redundancy. Not only redundant, but also harmful. If I changed the code and the comment remain unchanged, then the comment obsoletes and mislead readers. I know I should delete them.

This is a simple example, but the problem is not such simple, especially when we think codes as "comments" for humans. Really, why only comments are comments? We all know that computer does not reads C++ programs. They are read by us. So they *are* comments. They should be as clear as possible.

I am not just saying that we should write clean codes, however. That's software engineering practitioner's work. More work should focus on the language itself. We express our idea in languages, and their semantics impacts us a lot. It's difficult to do something in MASM, while expressing our idea in Python(or, let's say, Haskell) pleases us more. That's not just practice, theory inhibits as well. PLT discovers how we can *compose* our programs in an elegant and maintainable way. That's my first motivation.

### Make Computer Programs Correct

Several days ago I watched a talk about how to write *Software that can not be hacked*, which is just a terrible publicity for a random company... But the idea is important, though. We as programmers always want to write correct and efficient code, but how can we achieve this? We all know tests are not enough. They just show that in some cases the result of the program is acceptable, but cannot prove the program is correct.

I wrote test for many programs. But as a notorious *bad* programmer, even I tried so hard, there still are corner cases where my software fails and segfault(In particular, when I say segfault, I do mean I'm writing C++). So I am always struggling for ways to write right programs. But how can I do this? Difficult. For a typical verification attempt, I need to calculate postconditions of procedures, and prove some theorems about the program. When the program is written by imperative languages, that's no easy work. Because we make commands to the runtime, produces side effects, the property of our program is hard to sketch.

Declarative programming paradigm is the way around. Besides simple language like SQL or UNIX shell scripts, the general purpose declarative programming languages are also called functional programming languages, for they treat functions as first-class citizens. FP is about describe what you want your program do, rather than how to do it. By this method you don't specify about registers, memory allocation or loops. Instead, you ask questions about your system's behavior and logic. On these realms mathematicians have developed a great range of tools that we can utilize, from induction to the theory of categories.

When I first discover functional programming, the haskell code below impressed me the most, a quicksort:

```haskell
quicksort :: Ord a => [a] -> [a]
quicksort [] = []
quicksort (x:xs) = quicksort [y | y <- xs, y < x] ++ [x] ++ quicksort [y | y <- xs, y >= x]
```

Its implementation is simple. It's terse and elegant. But the most importantly, its correctness is trivial to see. we can use induction to prove that in little time. That's the power of declarative programming. And with PLT we can even do more.

### Computer Programs And Languages

Then I want to talk about why there are so many programming languages. Why can't there be just one giant do-everything-language and everyone just stick to it?

Well, let's imagine there is one, and every programmer use this ULang(Ultimate Language). We can use the ULang to write a RPG game system. We created our characters, items and plots. When we came to the gameplay system, we realize that we need to encode some logic in our system. What should you do if you opened that door in game? We cannot hard-code them in the compiled-code, because that would be very inflexible to change. So we need to describe game logic outside our main program. But.. When you are writing logics about something, aren't you writing computer programs by some language?

The same situation occurs in nearly every computer programs. Text processing, for example, conceives the regular languages and BNF. And transaction processing gives birth to the SQL language.

For every new application let there be a new language. Language is the way everything interacts. It is not only describing logics, it **is** logic.

So in order to build large, reliable and extensible system, it's vital to have a valid and versatile language of it.

### About Efficiency

Efficiency is not my concern right now. As someone(maybe Bjarne Stroustrup) said, we prefer a extensible system that can be tuned, rather than a tuned system that cannot be modified.

I will come to investigate and talk about it later, however(I wish).

## Content

This series will cover a wide range of topics, about the design and implementation of programming languages in general. But I don't know how far could I go. Let's see.

- type system
- runtime environment
- pl and category theory
- compiler & interpreter impl (VM, SSA in particular)
- dispatchers
- concurrency model
- reason about programs

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
