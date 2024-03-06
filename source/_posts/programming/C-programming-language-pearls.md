---
title: C programming pearls
date: 2023-09-02 22:49:41
tags:
- C
- programming
categories:
- CS
---

这里写一些 C 语言相关的小知识. 因为我已经使用 C 很久了, 所以不会有特别基础的内容. 除了基础的语法语义之外, 还有可能会提到其标准库, 工具链, 运行环境(OS 相关), 设计模式, 命令式编程习语等等.

这里的东西有一些是 C 语言和 C++ 共享的, 一些不是. 第一条常识: C 和 C++ 之间的区别很大, 它们不是同一种语言. 最重要的区别是 ABI 上的区别, C++ 的名字修饰和 C 很不一样(似乎 C 就根本没有名字修饰, 所以 ABI 就是底层操作系统/硬件的 ABI).

## `memmove()`

`ANSI` 定义了两个拷贝内存的函数, 分别是 `memcpy()` 和 `memmove()`. 区别是 `memcpy()` 不能处理重叠的内存区域, 而 `memmove()` 可以. 但是 `memmove()` 的实现比 `memcpy()` 要慢.

只应该使用 `memmove()`. 假装只有这一个函数. [1] 这是标准库的一个失败设计, 不应该让客户程序员来考虑内存别名的事情. 正确的设计是: 只有一个拷贝内存的函数, 它应该永远是对的, 但尽可能优化, 例如在内存不重叠的时候加快速度.

## VLA

`VLA` 是 `Variable Length Array` 的缩写. `C99` 引入了这个特性. 这个特性允许我们写出这样的代码:

```c
int
some_function(int n)
{
    int array[n];
    ...
}
```

看上去有些令人诧异. 按道理说, 声明动态数组都在堆上, 怎么能这样就声明一个动态数组呢? 其实, 本来栈上就可以动态分配内存的, 我们不用栈只是因为它太小了. 从汇编的角度考虑, 栈分配内存无非就是让 `%rsp` 往下移动一些字节, 这些字节的数量可以是立即数, 当然也可以是一个变量. `Linux` 中提供了一个系统调用 `alloca()` 来实现在栈上分配动态内存. 可以调那个来在栈上分配内存.

另外, 我们不熟悉这种写法还有一个原因, 就是 `C++` 不支持这种写法. 因为在 `C` 引入这个特性的时候, `C++` 已经有很多特性依赖于固定长度数组, 所以不太可能兼容 `C` 的这个特性.

[许多人](https://stackoverflow.com/questions/1887097/why-arent-variable-length-arrays-part-of-the-c-standard)认为这[不是]((https://nullprogram.com/blog/2019/10/27/))一个好写法. `Bjarne Stroustrup` 本人也提出了[替代方案](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3810.pdf).

## `restrict`

这又是一个在 `C++` 里没有的关键字, 但这个关键字在 C 语言的很多地方都可以看到, 例如:

```c

extern long int strtol (const char *__restrict __nptr,
			char **__restrict __endptr, int __base)
     __THROW __nonnull ((1));

```

这个关键字告诉编译器, 这个指针是唯一指向这个内存区域的指针. 也就是说, 不存在指针别名的情况, 因此编译器可以利用这个信息生成更快的代码. 不过, 作为程序员来说, 我认为可都用不到这个关键字就是了.


## `const` 修饰谁?

通常来说, `const` 修饰左边的东西. 左边没有的时候, 修饰右边的东西. 比如:

```c
const int *p;
```

这里 `const` 修饰的是 `int`, 所以意味着这个地方的值不会改变. 但是 `p` 这个指针可以指向别的地方. 这个指针自己是可以改变的.

```c
int * const p;
```

这里 `const` 修饰的是指针. 所以这个指针不可以指向别的地方. 但是这个指针指向的地方的值是可以改变的.

## 柔性数组

我们可以在结构体中声明一个 0 长度的数组, 像这样:

```c
struct foo {
    int len;
    int signal[0];
    int bbb;
};
```

这个 `signal` 完全不会占用任何空间. 它只是一个占位符. 但我们可以访问它, 可以知道它的地址, 甚至还可以用下标来访问后面的 `bbb`. 这可以用来标注结构体中一些特殊的位置.

如果我们把这样的元素放到最后, 我们就有了一个柔性的数组. 在 `malloc()` 的时候给 `foo` 结构体多于 `sizeof(foo)` 的内存, 这些内存就可以用最后的指针来访问了.

## 数组和指针

数组不是指针, 它们的大小都不同. 不过, 数组和指针可以隐式地相互转换. 这种转换带来了许多一眼看上去奇怪的代码:

```c
int a[10] = {0};
int b = 2[a]; // b = a[2] = *(2 + a) = *(a + 2)
```

一个应用是:

```c
for (int i = 0; i < n; i++) {
    // "\n" == {'\n', '\0'}
    //
    // case i == n - 1 of 1  -> '\0'
    //                    0  -> '\n'
    printf("%d%c", i, "\n"[i == n - 1]);
}

```

## 结构体赋值指定域

良好的习惯: 给结构体赋值的时候指定域. 例如:

```c
struct foo {
    int a;
    int b;
};

struct foo f = {
    .a = 1,
    .b = 2,
};
```

## 数组赋值的扩展 Designated Initializers

数组赋值的时候, 可以指定某些位置的值. 例如:

```c
enum someenum {
    APPLE = 1,
    BANANA = 2,
}

int a[10] = {[APPLE] = 1, [BANANA] = 2};
```

同时大部分编译器还允许 `...`, 也就是可以这样写

```c
int widths[] = { [0 ... 9] = 1, [10 ... 99] = 2, [100] = 3 };
```

这个例子来自 [2].

这同时可以用在 `switch ... case` 语句块中:

```c
switch (i) {
case 1 ... 127:
    break;
default:
    break;
}
```

## 带有值的语句块

可以给语句块加上圆括号, 那么这个语句块就会有值, 就像 `Rust`:

```c
int a = ({1; 2;});
// a = 2 afterwards
```

这个功能似乎是 GCC 扩展.

## 嵌套函数

可以在函数中定义函数:

```c
int foo(void)
{
    int bar(void)
    {

    }
}
```

内层函数可以捕获外层的值.

这个功能似乎是 GCC 扩展.

## `%` 操作符

`%` 操作符, 就是取模. 在 C / C++ 中, 正数的情况就不说了. 负数的情况下结果也会是负数.

所以这并不是取模运算符, 而是余数运算符.

```C
a == (a / b) * b + a % b
```

## 参考资料

[1] *The Practice of Programming. Brian W. Kernighan, Rob Pike.* Addison-Wesley. 1999.

[2] [gcc docs](https://gcc.gnu.org/onlinedocs/gcc/Designated-Inits.html)
