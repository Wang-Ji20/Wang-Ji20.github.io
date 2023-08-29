---
title: C++ Test
date: 2023-08-29 15:18:32
tags:
- C++
- programming
categories:
- CS
---

这篇文章记录一下我现在在 `C++` 中使用的测试框架和测试流程(可比 `Go`, `Rust` 复杂多了...). 我用 `GoogleTest` 做单元测试, 用 `CMake` 构建和运行单元测试, 用 `Clang` 和 `llvm-cov` 做覆盖率的报告.

## CMake 测试模块

`CMake` 有一个测试模块, 叫做 `CTest`. 在根 `CMakeLists.txt` 用以下代码可以把这个模块加入进来.

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR MYPROJECT_BUILD_TESTING)
    include(CTest)
endif()
```

有时候我们把当前代码作为其他代码库的依赖库. 这个情况下, 不需要测试. 所以我们用 `CMAKE_PROJECT_NAME` 和 `PROJECT_NAME` 来判断当前代码是否是一个独立的项目. 如果是, 才加入 `CTest`.

同样, 我们需要加入测试代码所在的文件夹.

```cmake
if( BUILD_TESTING
    AND (CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME
         OR MYPROJECT_BUILD_TESTING)
)
    add_subdirectory(tests)
endif()

```

这里需要开一个后门. 也许最后还是需要运行子项目的测试. 这个时候就用 `MYPROJECT_BUILD_TESTING` 来判断是否需要测试. 另外, 上面加入 `CTest` 的时候没有加入 `BUILD_TESTING`, 是因为 `CTest` 中已经包含了这个功能.

使用 `CTest` 可以让你在进入构建好的测试程序之后, 输入 `ctest` 命令就完成测试.

## 加入 GoogleTest

首先需要加入 `GoogleTest` 这个库. 推荐使用两种方法引入它: `git submodule` 或者 `CMake FetchContent`.

用 `git submodule` :

```bash
# 用 ssh 因为 ssh 更稳定, 网络条件更好.
git submodule add git@github.com:google/googletest.git ./third_party/googletest
```

用 `FetchContent`:

```cmake
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
```

另外就是, 不要忘了用 `target_include_directories` 或者 `include_directories()` (好像前者更推荐使用一些.) 把  `GoogleTest` 纳入头文件查找目录.

## 编写单元测试

这部分不是我的重点, 所以只是略加介绍. 一个最简单的单元测试长这样.

```C++
#include "gtest/gtest.h"
#include <iostream>

TEST(Suite1, Test1) {
    EXPECT_EQ(1, 1);
}
```

不需要写主函数. 没主函数, 链接上 `gtest_main` 就会白送一个. 我反正懒得写了.

## 构建测试可执行文件

使用 `CMake` 构建可执行文件:

```cmake
add_executable(${测试的名字} EXCLUDE_FROM_ALL ${测试源代码})
target_link_libraries(${测试的名字}  gtest gtest_main)
```

之后, 需要利用 `GoogleTest` 提供的指令, 把测试加入到 `CTest` 中. 这个指令是:

```cmake
gtest_discover_tests(target
                     [EXTRA_ARGS arg1...] # 运行测试的参数.
                     [WORKING_DIRECTORY dir] # 运行测试的工作路径.
                     [TEST_PREFIX prefix]
                     [TEST_SUFFIX suffix]
                     [TEST_FILTER expr]
                     [NO_PRETTY_TYPES] [NO_PRETTY_VALUES]
                     [PROPERTIES name1 value1...]
                     [TEST_LIST var]
                     [DISCOVERY_TIMEOUT seconds]
                     [XML_OUTPUT_DIR dir] # 保存测试报告的地址.
                     [DISCOVERY_MODE <POST_BUILD|PRE_TEST>]
)
```

然后在测试可执行程序的文件夹下面运行 `ctest` 就可以测试了.

我一般使用以下的指令自动寻找测试文件, 自动构建测试目标.

```cmake
file(GLOB_RECURSE TEST_SOURCES "${PROJECT_SOURCE_DIR}/test/*/*test.cc")
message(STATUS "Found ${TEST_SOURCES} test sources: ${PROJECT_SOURCE_DIR}/test/")
foreach (test_source ${TEST_SOURCES})
    # ......
    # 处理测试源代码. 用 gtest_discover_tests 加入到 CTest 中.
endforeach ()
```

## 覆盖率

我[写了一个](https://github.com/Wang-Ji20/pigskinjelly/blob/main/build_support/cmake/LCOV.cmake) Cmake Module 来做这件事. 用法是:

```cmake
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/build_support/cmake)
set(TEST_SOURCES_PATTERN ....) # 测试源代码的匹配模式.
include(LCOV)
include(tests)
```

它基本上需要和我的 `Googletest` 用 Cmake 文件一起使用, 我没试过其他的用法.

需要在电脑上有 `llvm-cov` `llvm-profdata`. 运行构建指令 `coverage-report` 之后, 会在 `build` 文件夹下面生成 `report.html` 文件. 用浏览器打开就可以看到覆盖率报告了. 具体原理就不详细介绍了. 效果大概是这样:

![覆盖率报告](/images/lcov-report.png)

## 参考资料

[1] [Modern CMake](https://cliutils.gitlab.io/modern-cmake)

[2] [GoogleTest User's Guide](https://google.github.io/googletest)

[3] [Cmake Document](https://cmake.org/cmake/help/latest/module/GoogleTest.html)

[4] [Clang document: Source-based code cooverage](https://clang.llvm.org/docs/SourceBasedCodeCoverage.html)

[5] [llvm-cov document](https://llvm.org/docs/CommandGuide/llvm-cov.html)
