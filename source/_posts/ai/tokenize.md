---
title: tokenize
date: 2024-10-12 13:52:23
tags:
- AI
---

## word embedding

Because deep neural network models cannot process raw text directly, we need to represent
our word as continuous valued vectors. This process is called *embedding*. embedding is
to convert non-numeric data into a format that neural networks can process.

Embedding ways:

- use specific models like Word2Vec

- use LLM itself

## Tiktoken

[Tiktoken](https://github.com/openai/tiktoken) is a rust implemented BPE algorithm.
