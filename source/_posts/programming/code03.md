---
title: array, linked list, hash - revisited
date: 2023-12-31 14:09:47
categories:
    - CS
tags:
    - Data Structures
---

We often say that designing data structures dominates the programming process. That's a critical belief in data-oriented programming. So a revisit of common data structures is helpful.

## dequeue, the jewelry of array-based data structure

A dequeue is a double-ended queue. It is nice because push/pop on the front and back is O(1) so it can be used as both stack and queue. It also inherits the nice property of array-based structures. Accessing its elements cost O(1) regardless the size of the dequeue. (exclude the double linked list case...)

Many programming languages offer this data structure in their stdlib. In C++ we can explicitly `#include <deque>`, but it appears more. In fact, C++ uses dequeue to back its stack and queue implementations. Rust provides `std::VecDeque` as their counterpart. [Here](https://en.wikipedia.org/wiki/Double-ended_queue#Language_support)'s a more comprehensive survey.

We can implement this data structure in many ways, here are few of the choices:

- Use a ring buffer, record (start, end) or (start, size). The Rust `std::VecDeque` uses this approach.

- Use double stacks. The first one supports the stack interface and they cooperate to mimic a queue. When the user inserting an element, however, the dequeue must balance their elements.

- Use doubled linked lists. This approach loses the nice O(1) random access cost property.

- Use linked small continuous spaces. C++ STL uses this [approach](https://devblogs.microsoft.com/oldnewthing/20230810-00/?p=108587).

## Linked List, how we hated and loved you

Many people don't like linked lists because it is not efficient in modern hardwares. It uses pointers to reference the next object, which is hard to optimize by caching. The bigger problem concerns the safety. Linked lists are notoriously difficult to write right. Maybe that's why it is often presented as interview questions. Alas, to get a job, one may still need to look at it, closely.

### Intrusive linked list

We can embed our linked list into a structure by adding a pointer, that's called a intrusive linked list. We can extract these part to a dedicated structure, `linked_list_node`. It only contains where's the next and where's the former(if doubled linked list).

In linux kernel, intrusive linked lists are ubiquitous. Definition is in `include/linux/list.h`.

### Recursive functions in recursive data structure

### Malformed linked lists

## Swiss table

## Skip-list


