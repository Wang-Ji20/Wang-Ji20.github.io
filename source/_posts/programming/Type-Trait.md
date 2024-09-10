---
title: Type Trait
date: 2023-09-06 18:54:59
tags:
- c++
- programming
categories:
- CS
---

在模板元编程中, 我们常常要储存一些元信息. 例如类型 `T` 是否是整数, 类型 `T` 是否为指针等等. 这些信息存储在类型特质(type_trait)中.

为了方便理解, 我要用一个序列化器的例子来说明. 假设我们需要写一个序列化器, 它至少有以下两个功能:

- 直接序列化值类型 `T`
- 序列化指针 `T* p`, 相当于序列化 `*p`

因此, 我们写一个 `template <typename T>`, 要实例化的就有两种情况, 一种指针类型, 一种普通类型.

对这两种不同的情形要分别判断. 如何做到呢?

## 模板实例化的选择

我们需要定义一个谓词 `is_pointer<T>`, 用于判断类型 `T` 是否为指针类型. 我们可以这样定义:

```c++
template <typename T>
struct is_pointer {
    static constexpr bool value = false;
};

template <typename T>
struct is_pointer<T*> {
    static constexpr bool value = true;
};
```

在这里, 我们实例化 `is_pointer<int *>` 的时候, 会实例化出两个模板, 分别为:

```cpp
template <>
struct is_pointer<int *> {
    static constexpr bool value = false;
};

template <>
struct is_pointer<int *> {
    static constexpr bool value = true;
};
```

但是, 因为第二个实例化的模板更加准确, 所以编译器会选择第二个模板. 这样, `is_pointer<T>::value` 就为 `true`.
同时, `is_pointer<int>` 因为只有上面那种可能的代换结果, 所以它的 `is_pointer<int>::value` 为 `false`.

`is_pointer` 就是一个类型特质. 没有什么魔法, 只不过是一个结构而已.

## 简单选择实例化

上面的例子很容易, 因为只有两种情况, 而且是不是指针, 只要看看有没有 `*` 就知道了. 这个信息蕴涵在模板的输入参数中. 所以, 不用类型特质, 我们也可以这样写:

```cpp

template <typename T>
void
serialize(T value) {
    throw std::runtime_exception("not implemented");
}

template <typename T>
void
serialize(T *value) {
    serialize(*value);
}

```

编译器会自己推测出应该选择哪一个实例化的模板函数.

但情况也许会很复杂. 例如, 我们只能序列化含有 `void serialize(Serializer &ser)` 方法的类. 这个时候, 我们就需要类型特质了.

## SFINAE

试试定义这个类型特质:

```cpp
template <typename T, typename V = T>
struct has_serialize_sfaine : std::false_type {};

template <typename T>
struct has_serialize_sfaine<
    T,
    typename std::enable_if<
        std::is_same<decltype(T::serialize), void(Serializer &)>::value,
        T>::type> : std::true_type {};
```

这个类型特质的意思是, 如果 `T` 有一个 `serialize` 方法, 并且这个方法接受一个 `Serializer &` 类型的参数, 那么 `has_serialize<T>::value` 就为 `true`.

这里用到了 `std::enable_if` 和 `std::is_same` 两个模板结构. `std::enable_if` 的作用是, 如果它的第一个参数为 `true`, 那么这个结构中的 `type` 就为第二个参数, 否则, 这个结构中没有 `type` 这个成员. `std::is_same` 的作用是, 如果它的两个参数类型相同, 那么它的 `value` 就为 `true`, 否则为 `false`.

这样, 当 `T` 没有 `serialize` 方法的时候, 第二个模板就会实例化失败, 所以编译器会选择第一个模板. 否则, 编译器会选择第二个模板.

为什么可以这样做? 因为 SFAINE(替换失败不是错误). 编译器在实例化模板的时候, 会从上到下依次执行所有的模板实例化可能, 在每次执行中, 遇到编译错误就停下, 换另一个可选的模板. 一次代换失败, 编译器不会报错. 报错只在两种情况下发生:

- 所有的模板都代换失败
- 模板都代换成功, 但是编译器发现有两个模板都可以选择, 而且没有一个更加准确

所以, 我们可以通过刻意触发编译错误, 来选择模板.

## 替代方案: `static_assert`

我们可以用 `static_assert` 来刻意触发编译错误. 例如:

```cpp
template <typename T>
void
serialize(T value) {
    static_assert(has_serialize<T>::value, "T does not have serialize method");
    value.serialize(*this);
}

template <typename T>
void
serialize(T *value) {
    serialize(*value);
}
```

好处是可以输出一些额外的诊断信息.

## 替代方案: `if constexpr`

SFINAE 风格的代码很难写, 也不可读. 我们可以干掉它, 用 C++17 的 `if constexpr`. 它的作用是在编译期根据条件选择性的编译代码. 例如:

```cpp

template <typename T>
void
serialize(T value) {
    if constexpr (std::is_pointer<T>::value) {
        serialize(*value);
    } else {
        throw std::runtime_exception("not implemented");
    }
}

```

这样, 当 `T` 是指针类型的时候, 编译器就会选择 `if` 语句中的代码, 否则就会选择 `else` 语句中的代码.

## 最终方案: `concept`

C++20 引入了 `concept` 的概念. 它的作用类似于一个类型特质, 但是比类型特质更加强大. 例如, 我们可以这样定义:

```cpp
template <typename T>
concept has_serialize_concept = requires(T t, Serializer &serializer) {
  t.serialize(serializer);
};
```

这样, 我们就可以在模板定义的时候指定 `has_serialize` 来要求 `T` 必须有 `serialize` 方法. 例如:

```cpp

template<typename T, typename = T>
struct has_serialize_concept_t : std::false_type {};

template <has_serialize_concept T>
struct has_serialize_concept_t<T, T> : std::true_type {};

```
