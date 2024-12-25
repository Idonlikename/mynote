# Socket

本文件中的内容主要用于记录学习Socket实验过程中一些不常见的标准库函数，可以看作是一个函数的集合。

### 函数

#### `strstr`

`strstr(char1,char2)`，`strstr`用于在字符串中查询子串，查询`char2`在`char1`中的指针位置。

```Cpp
char *strstr(const char *haystack, const char *needle); //原型

char *char1 = "Hello, world!";
char *char2 = "world";

char *found = strstr(char1, char2);
if (found != NULL) {
    printf("Found '%s' at position %ld\n", char2, found - char1);
} else {
    printf("Sub-string not found.\n");
}
//output：Found 'world' at position 7     
```



#### `fputs`

`fputs`是C语言标准库中的一个函数，用于将字符串写入到指定的输出流中。这个函数的名称来源于 "file put string"，即向文件中放置字符串。

```cpp
int fputs(const char *str, FILE *stream);  //str是要写入的字符, stream是指向FILE结构的指针，表示写入数据的目标流。

FILE *fp = fopen("example.txt", "w");
if (fp != NULL) {
    fputs("Hello, world!\n", fp); // 写入字符串并添加换行符
    fclose(fp); // 关闭文件
}
//output：fputs 将字符串 "Hello, world!\n" 写入到文件 example.txt 中。

```

如果文件写入成功，`fputs` 返回一个非负值，然后使用 `fclose` 函数关闭文件。如果 `fputs` 失败，它将返回 `EOF`



#### `sprintf`

`sprintf` 函数在C语言中是一个用于**格式化输出的函数**，它与 `printf` 函数类似，但是 `sprintf` 将格式化后的字符串写入到一个字符数组（通常是字符数组或字符指针）中，**而不是直接输出到标准输出**（通常是屏幕）。

函数原型如下：

```c++
int sprintf(char *str, const char *format, ...);
```

- `str`：这是指向字符数组的指针，`sprintf` 将把格式化后的字符串存储在这个数组中。
- `format`：这是格式化字符串，它指定了如何解释后续参数，以及如何格式化它们。它与 `printf` 函数中的格式化字符串相同。
- `...`：这是函数参数的列表，可以是任意数量和类型的参数，它们将按照 `format` 字符串中的指示被格式化。

`sprintf` 函数返回写入到 `str` 中的字符数量，但不包括结尾的空字符 `\0`。

例如：

```c++
char buffer[100];
sprintf(buffer, "The value is: %d", 42);
//将格式化字符串 "The value is: 42" 并存储在 `buffer` 数组中。
```

使用 `sprintf` 时需要特别注意的是，如果格式化后的字符串长度超过了 `str` 数组的大小，将会导致缓冲区溢出，这是一个常见的安全问题。因此，在使用 `sprintf` 时，应该总是**确保目标数组足够大以容纳结果字符串**。



#### `meset`

`memset` 是C语言中的一个标准库函数，用于将一块**内存中的所有字节设置为特定的值**。这个函数定义在 `<string.h>` 头文件中。

函数原型如下：
```c
void *memset(void *s, int c, size_t n);
```

- `s`：指向要填充的内存块的指针。
- `c`：要设置的值，对每个字节进行类型转换（通常转换为 `unsigned char`）。
- `n`：要设置的字节数。

`memset` 函数的作用是将 `n` 个字节的内存区域，从地址 `s` 开始，全部设置为值 `c`。如果 `c` 是 `0`，`memset` 就可以用来将内存区域清零。

例如：
```cpp
char buffer[100];
memset(buffer, 0, sizeof(buffer)); // 将buffer数组的所有字节清零
```

在这个例子中，`memset` 将 `buffer` 数组的前 100 个字节全部设置为 `0`。这通常用于初始化数组或结构体，确保它们在使用前没有未定义的数据。

`memset` 函数返回一个 `void*` 类型的指针，指向被设置内存的起始地址，这通常与传入的 `s` 相同。





### 结构体

#### FILE

`FILE` 结构是标准输入输出库（stdio）定义的一个**结构体**，用于**表示输入输出流**。这个结构体定义在 `<stdio.h>` 头文件中，是实现文件操作和标准I/O的基础。尽管 `FILE` 结构的具体实现细节依赖于编译器和操作系统，但它通常包含以下类型的成员：

1. 指向缓冲区的指针：用于存储从文件读取的数据或待写入文件的数据。
2. 缓冲区的大小：表示缓冲区可以存储多少字节的数据。
3. 文件位置指示器：一个用于跟踪当前文件读写位置的值。
4. 错误指示器：用于指示流中是否发生了错误。
5. EOF（文件结束）指示器：用于标记是否已到达文件的末尾。
6. 文件模式：指示文件是以读、写或追加模式打开的。
7. 操作系统文件描述符：一个整数值，用于在操作系统层面标识打开的文件。

```cpp
typedef struct {
    char *buffer;          // 指向缓冲区的指针
    size_t buffer_size;    // 缓冲区大小
    long position;         // 文件位置指示器
    int error_flag;        // 错误指示器
    int eof_flag;          // EOF指示器
    const char *mode;      // 文件模式（如 "r", "w", "a" 等）
    int fd;                // 操作系统文件描述符
    // ... 可能还有其他成员 ...
} FILE;
```



### 类型

#### `size_t`

`size_t` 是C语言中定义的一个无符号整数类型，通常在 `<stddef.h>` 或 `<sys/types.h>` 等头文件中定义。这个类型用于表示大小和长度，其大小足以存储任何数据类型的大小，包括数组的最大可能大小。

`size_t` 主要用于以下几个方面：

1. 作为函数参数，表示数据的大小或长度。例如，`sizeof` 运算符返回类型就是 `size_t`。
2. 作为返回类型，表示函数返回的大小或长度。例如，`strlen` 函数返回字符串的长度，类型为 `size_t`。
3. 用于循环和数组索引，尤其是在处理缓冲区和内存分配时。

由于 `size_t` 是无符号类型，它可以表示非常大的数值，但不允许表示负数。在不同的平台上，`size_t` 的具体大小可能会有所不同，但至少是 16 位。在32位系统中，`size_t` 通常是 32 位宽；在64位系统中，`size_t` 通常是 64 位宽。

以下是一些使用 `size_t` 的示例：

```cpp
#include <stddef.h>

size_t arraySize = sizeof(array) / sizeof(array[0]); // 计算数组元素数量
size_t strLen = strlen("Hello, world!"); // 获取字符串长度
```

在这个例子中，`arraySize` 用来存储数组中元素的数量，`strLen` 用来存储字符串 "Hello, world!" 的长度。两者都使用 `size_t` 类型，因为它们表示的是大小或长度。



#### `ssize_t`

`ssize_t` 是C语言中的一个类型定义，通常在 `<sys/types.h>` 或其他类似的头文件中定义。

它代表“signed size type”，即“有符号的大小类型”。`ssize_t` 是用**来存储可能为负的整数的类型**，其大小足以容纳系统上任何数据类型的大小，包括 `size_t`。

`ssize_t` 主要用于系统调用和库函数，这些函数需要返回一个**可能超出标准 `int` 类型范围的大小值**，或者**需要表示错误情况**。例如，当一个函数需要返回从文件中读取或写入的字节数时，如果操作成功，它可能会返回一个正值；如果发生错误，它可能会返回 `-1` 或其他负值来指示特定的错误。

在64位系统上，`ssize_t` 通常是 `int64_t` 的别名，而在32位系统上，它可能是 `int32_t` 的别名。这意味着 `ssize_t` 能够存储至少 32 位的整数，足以表示大多数系统上的文件大小和缓冲区大小。

例如，`read` 和 `write` 系统调用都使用 `ssize_t` 类型作为返回值：
```cpp
ssize_t read(int fd, void *buf, size_t count);
ssize_t write(int fd, const void *buf, size_t count);
```
这里，`read` 函数尝试从文件描述符 `fd` 读取 `count` 字节到缓冲区 `buf` 中，并返回实际读取的字节数。如果成功，返回值是0到 `count` 之间的一个正值；如果到达文件末尾，返回0；如果发生错误，返回 `-1`。

使用 `ssize_t` 而不是 `size_t` 可以确保函数调用者能够区分正常返回值和错误情况，因为 `size_t` 是一个无符号类型，它不能表示负数。

### 转义符

#### `\r`

在 C++（以及 C 和其他许多编程语言中）`\r` 是一个特殊的转义序列，代表回车（Carriage Return，简称 CR）字符。在不同的操作系统和环境中，`\r` 的作用可能有所不同

**Mac OS 系统中**：`\r` 被用作行结束符。

**Windows 系统中**：行结束符是 `\r\n`，其中 `\r` 表示回车，`\n` 表示换行（Line Feed，简称 LF）。这个组合表示光标先回到行首，然后移动到下一行的开始位置。

**Unix和Linux 系统中**：行结束符仅仅是 `\n`，表示换行，光标移动到下一行的开始位置，而不会回到行首。

在网络协议和数据交换格式中，如 HTTP 协议，`\r\n` 经常用来表示**头部字段的结束**。

例如，在 HTTP 请求或响应中，请求头和正文之间用 **`\r\n\r\n`** 来分隔。