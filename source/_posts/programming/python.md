---
title: python programming pearls
tags:
- python
- programming
---

## Dictionary comprehension

This feature is in [PEP 247](https://peps.python.org/pep-0274/). I only know about
list comprehensions before. The basic usage is like:

```python3
{ k:v for k, v in enumerate(range(3))}

{0: 0, 1: 1, 2: 2}
```
