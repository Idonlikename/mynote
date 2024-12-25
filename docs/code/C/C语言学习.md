# C/Cpp语言学习

## 基础部分：

### 基本数据类型

可能感觉`int`，`float`，`char`在绝大多数场景已经可以应付自如了。但是长时间的学习之后（一定要注重代码的不断练习）还是发现略有不足，所以在此补充。

同时要注意内存的分配是在定义的时候就已经完成的。

**基本数据类型是 CPU 可以直接进行运算的类型**，在算法中直接被使用，主要包括以下几种。

- 整数类型 `byte`、`short`、`int`、`long` 。
- 浮点数类型 `float`、`double` ，用于表示小数。
- 字符类型 `char` ，用于表示各种语言的字母、标点符号甚至表情符号等。
- 布尔类型 `bool` ，用于表示“是”与“否”判断。

**基本数据类型以二进制的形式存储在计算机中**。一个二进制位即为 1 比特。在绝大多数现代操作系统中，1 字节（byte）由 8 比特（bit）组成。

1 Byte = 8 bit。要注意大小写的分别，在计算机中是存在GB和Gb的，所代表的实际含义是不同的

注意在计算机中，或者考虑符号位的二进制中，首位当作符号位考虑正负，所以会出现如下的占用空间和最大最小值的关系.

| 类型   | 符号        | 占用空间 | 最小值       | 最大值   | 默认值 |
| ------ | ----------- | -------- | ------------ | -------- | ------ |
| 整数   | `byte`      | 1 byte   | -2^7^        | 2^7^-1   | 0      |
|        | `short`     | 2 byte   | -2^15^       | 2^15^-1  | 0      |
|        | `int`       | 4 byte   | -2^31^       | 2^31^-1  | 0      |
|        | `long`      | 8 byte   | -2^63^       | 2^63^-1  | 0      |
|        | `long long` | 16 byte  | -2^127^      | 2^127^-1 | 0      |
| 浮点数 | `float`     | 4 byte   | 尚未找到关系 |          | 0.0f   |
|        | `double`    | 8 byte   |              |          | 0.0    |
| 字符   | `char`      | 2 byte   | 0            | 2^16^-1  | 0      |
| 布尔   | `bool`      | 1 byte   | false        | true     | false  |



### **输入与输出**

```c++
#include <iostream>

int main() {

​    int x, y;                          // 声明变量  

​    std::cin >> x >> y;                // 读入 x 和 y  

​    std::cout << y << std::endl << x;  // 输出 y，换行，再输出 x  

​    return 0;                          // 结束主函数 

}
```

`std`：`std`是一种标准 **命名空间**  ，即C++中可以定义与函数同名的变量，而通过 `std::function` 来使用函数。

#### 输入`cin`与输出`cout`：

`cout` 是C++中的 <u>**标准输出流**</u>  用于将数据输出到标准输出设备；

`cin`是C++中的<u>**标准输入流**</u>  用于从标准输入设备接收用户输入的数据。

<u>**插入运算符**</u> `<<` 用于将变量、内容 **插入到输出流**中；而**<u>提取运算符</u>** `>>` 用于**从输入流中提取**内容。 

便于理解可以这么想： `>>` 意味着赋值的方向。代码通过 `cin` 获得了输入的数据，又通过 `>>` 将其赋值到变量上；又通过变量 `x`  ， `y` 把数据的值赋值到 `cout` 上由其输出。

#### 换行`endl`：

`endl` 是C++中的一个特殊控制符，用于在输出流中**插入**一个换行符并**刷新输出缓冲区**。



**tips**: `scanf` 和`printf` 的运行速度比上述的输出流和输入流**更快**，且方便控制输入输出格式。                

### **宏定义**

```c++
#include <iostream> 

#define n 233 

// n 不是变量，而是编译器会将代码中所有 n 文本替换为 233，但是作为标识符一部分的 

// n 的就不会被替换，如 fn 不会被替换成 f233，同样，字符串内的也不会被替换

int main() {  

​    std::cout << n;  // 输出 233  

​    return 0; 

}
```

`#define` 是一种**预处理命令**，用于定义宏，本质上是文本替换。恰当使用可以提升程序的运行速度。

`#undef` :用于取消预定义的宏定义。它用于移除宏的定义，使其在代码中不再可用。

**预处理命令**：就是预处理器所接受的命令，用于对代码进行初步的文本变换，比如 文件包含操作 `#include` 和 处理宏 `#define` 等，对 GCC 而言，默认不会保留预处理阶段的输出 `.i` 文件。可以用 `-E` 选项保留输出文件。



**宏定义定义3函数**

```c++
#include <iostream> 

#define sum(x, y) ((x) + (y)) //类似于lambda函数，前面是函数名后面是具体操作方法。

#define square(x) ((x) * (x)) 

int main() {  

​    std::cout << sum(1, 2) << ' ' << 2 * sum(3, 5) << std::endl;  // 输出 3 16 

}
```

可见宏定义还可以定义函数。

`#define` 也有优点，比如结合 `#ifdef` 等预处理指令有奇效，比如：

```c++
#ifdef LINUX 

// code for linux 

#else

// code for other OS 

#endif
```

可以在编译的时候通过 `-DLINUX` 来控制编译出的代码，而无需修改源文件。这还有一个优点：通过 `-DLINUX` 编译出的可执行文件里并没有其他操作系统的代码，那些代码在预处理的时候就已经被删除了。

`#define` 还能使用 `#`、`##` 运算符，极大地方便调试。

**注意**：因为 `#define` 的本质是文本替换。所以使用 `#define` 是有风险的（由于 `#define` 作用域是整个程序，因此可能导致文本被意外地替换，需要使用 `#undef` 及时取消定义），因此应谨慎使用。较为推荐的做法是：使用 `const` 限定符声明常量，使用函数代替宏。

#### `const` :

`const`是一个**关键字**，用于**将某个变量定义成常量**。

`const`定义的变量或对象的值在程序执行期间不能被修改。它可以用于定义常量，函数参数，函数返回值等。

定义常量示例：

```c++
const int MAX = 100;
```

这里`MAX`**被定义为一个常量，它的值不能被修改，否则程序会报错**。对于整个程序而言`MAX`就是100。

另外，`const`**还可以用于函数的参数和返回值**。

例如：

```c++
int add(const int x, const int y) {
    return x + y;
}
```

在这个例子中，`add`函数的参数`x`和`y`被声明为`const`，这意味着函数内部不能修改它们的值。

同样地，如果函数返回值被声明为`const`，则它的值也不能被修改。

### 流程控制语句

#### 三元

C语言的三元（三目）可以归为如下的写法：

```c
condition ? result_1 : result_2;
```

判断 `codition`中的值是否正确，如果`condition`为真，则整体表达式会返回 `result_1`的值，反之则返回`result_2`的值。



#### 分支

##### if语句

```c++
if(condition1){
	code;
}else if(condition2){
	code;
}else{
	code;
}
```

##### switch

```c++
switch(object){
    case condition1:
    	code;
        break; //没有break会全部执行
    case condition2:
        code;
        break;
    default：//其余情况
        code;
}
```



#### 循环

##### for

```c++
for (initial;condition;update){
    code;
}
```



##### while

```c++
while(condition){
	code;
}
```

```c++
do{
	code;
}while(condition)
//相较于while。do···while是先执行一次再判断
```

##### continue和break

`continue`:跳过此次，进入下一次循环。

`break`:结束此循环

## 结构体

结构体可以对基本属性变量进行封装，包装多个数据类型的数据类型。

`结构体（struct）`是由一系列具有相同类型或不同类型的数据构成的数据集合，也叫结构。

**本身是一种待声明定义的数据类型。**

例：

```c++
#inculde<stdio.h>
struct    Structname{  //结构体声明 结构体的名字(结构体命名建议首字母大写)
    int digit;
    char alpha[100]; //或者char *name（指针更节省内存）
    float score;
    //.....  
};    //这里需要一个分号表示结构体声明结束
```

在此我们定义了一个名为`Structname`的结构体，类似于`int`。

注意：我们声明结构体不是在声明变量，而是在声明一种结构体类型：这个结构体由什么数据组成，其中数据的变量名是什么。

### 如何声明结构体类型

#### 空结构体

```c++
struct EmptyStruct {
    //TODO
};
```

空结构体的内容需要后续去定义

#### 匿名结构体

```c++
struct {
    int id;
    char *name;
    float score;
};
```

定义一个匿名结构体。但在后续没办法使用，所以一般匿名结构体使用在只使用一次的位置。

但是：

```c++
struct {
    int id;
    char *name;
    float score;
}stu1, stu2;
```

可以在后续补充声明为此结构体定义的变量名。

意味着`stu1`与`stu2`二者声明为此匿名结构体的结构的**结构体变量**。

而并非把这个结构体类型命名为`stu1`或者`stu2`。

#### Typedef

此节我们学习，如何用`typedef`（类型声明）**方便我们进行结构体变量的简单定义。

我们知道我们可以通过`typedef int i `将`int`类型改名为`i`类型。对于声明这个代码的程序而言，`int`和`i`都代表着**整型**。

而对变量进行结构体定义时会出现：

```c++
#include<stdio.h>
struct Structname{  
    int digit;
    char alpha[100]; 
    float score;  
};
int main(){
    int a;//对变量a进行了整型定义
    Structname stu;//对变量stu进行了错误的结构体定义
    struct Structname stu;//正确的定义，但十分繁琐，所以我们学习typedef来方便我们进行定义。
    return 0;
}
```

**使用typedef：**

```c++
#include<stdio.h>
//示例一：
struct Structname{  
    int digit;
    char alpha[100]; 
    float score;  
};
typedef struct Structname Structname;//typedef在此处的作用为，声明了前面的struct Structname类型改名为Structname

//实例二：
typedef struct Structname{  //在声明结构体时进行类型声明。改变结构体的类型名。
    int digit;
    char alpha[100]; 
    float score;  
}Strctname;//在末尾补上声明后的类型名，可以理解为前一个示例中对中间原来的结构体声明进行了全写，当然结构体原先在struct后的命名可以省略。

int main(){
    int a;
    Structname stu;
    return 0;
}
```

#### 结构体的嵌套定义

结构体嵌套很好理解，就是结构体里嵌套一个结构体。

先声明一个结构体类型的结构，在后续的结构体中使用这个先前的结构体。

即为结构体的嵌套定义。

```c++
#include<stdio.h>
typedef struct Birthday{ 
    int yaer;
    int month; 
    int day;
}Birthday;

typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
    Birthday birthday; 
}Student;

int main(){
    int year;
    Student stu;//对变量stu进行结构体定义
    year = stu.birthday.year;//访问类型为Student的stu变量当中的类型为Birthday的birthday变量当中的类型为int的year变量的数据。
    return 0;
}
```

### 结构体变量

#### 声明结构体变量

要注意**我们在声明定义一个结构体类型的结构的时候并不占用内存**，因为声明一个结构体类型的结构时我们**相当于在制造一个`int` `float`**<u>他们本身都是并不占用程序的内存的</u>。

所以自然而然声明定义结构体的时候也并不占用程序的内存。

只有当真正声明一个变量的类型为结构体时才会占用内存。

下面是几种声明结构体变量的方法

##### 方法一

在主代码段用`Strucname name`的格式进行声明

```c++
#include<stdio.h>

typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student;

int main(){
    Student stu;//对变量stu进行结构体变量声明
    return 0;
}
```

##### 方法二

在声明结构体类型时对变量进行声明

```c++
#include<stdio.h>

typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student,stu;//对变量stu进行结构体变量声明

int main(){

    return 0;
}
```

#### 结构体变量的赋值以及访问结构体成员

```c++
#include <stdio.h>

typedef struct Birthday{ 
    int yaer;
    int month; 
    int day;
}Birthday;

typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
    Birthday birthday; 
}Student;

int main(){
    Student stu={45,"yxl",78.65,{2000,12,31}};//这里既展示了单一的结构体变量的赋值，也展示了嵌套时结构体的赋值。
    printf("digit:%d\t alpha:%s\t score:%.2f\t %d %d %d", 
           stu.digit, stu.alpha, stu.score, stu.birthday.year, stu.birthday.month, stu.birthday.day);//输出方法
    return 0;
}
```

#### 结构体作为函数参数

```c++
#include<stdio.h>

typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student;

void printfstruct(Student stu){   //声明一个输出结构体的函数
    printf("digit:%d\t alpha:%s\t score:%.2f\t %d %d %d",
           stu.digit, stu.alpha, stu.score, stu.birthday.year, stu.birthday.month, stu.birthday.day);
}
int main(){
    Student stu={45,"yxl",78.65,{2000,12,31}};
    printfstruct(stu);
    return 0;
}
```

### 结构体指针

#### 声明结构体指针以及用结构体指针访问结构体成员

在上一个案例中，我们声明了**一个函数用于输出结构体变量的各个数据**。

但采用的方法是**复制结构体再进行打印输出**，**<u>这样会拷贝一份结构体的内存</u>**。

对于我们而言当这样拷贝的次数变多，或者结构体的内部结构的变量的数量增加，会极其**影响我们运行的效率**。所以我们这里学习声明结构体指针用指针（也就是结构体的地址），我们用一个指针来完成传递，来提升我们的运行效率以及减少我们运行时程序占据的空间。

而且**使用指针更加规范**。

```c++
#include<stdio.h>
typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student,stu;	//对变量stu进行结构体变量声明

void printfstruct(Student stu){   //声明一个输出结构体的函数，但是再拷贝一份影响效率以及空间
    printf("digit:%d\t alpha:%s\t score:%.2f\t %d %d %d",
           stu.digit, stu.alpha, stu.score, stu.birthday.year, stu.birthday.month, stu.birthday.day);
}

void printfpoint(Student *p){     //同样声明一个输出结构体的函数，但是采用的是指针作为参数。
    printf("digit:%d\t alpha:%s\t score:%.2f\t %d %d %d",
           p->digit, p->alpha, p->score, p->birthday.year, p->birthday.month, p->birthday.day);
}   //在这里我们用指针访问结构体内各个数据的时候不再使用“.”方法也就是p.digit，访问，而是使用->来使指针访问结构体中的成员。 

int main(){
    stu = {45,"yxl",78.65,{2000,12,31}};
    Student *pstu = &stu;	//声明一个结构体指针pstu作为指针指向stu（也就是获取了stu的地址）
     printfpoint(*pstu);
    return 0;
}
```

### 结构体内存计算

直接用`siezeof()`

```c++
#include<stdio.h>
typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student,stu;//对变量stu进行结构体变量声明

int main(){
    stu = {45,"yxl",78.65,{2000,12,31}};
    printf("结构体Student所占字节数:%d",sizeof(Student));
    return 0;
}
```

对于内部声明变量类型完全相同的结构体，我们可以用声明时结构体内所声明的几个同类变量的内存来计算结构体所占的字节数。
$$
struct\space byte=n*def\space size
$$
但是要注意声明内部变量类型不同的结构体。

因为其内部会发生**内存对齐**。

#### 内存对齐

内存对齐是什么呢？

**内存对齐（Memory Alignment）**是指在计算机中，数据在内存中存储时按照特定规则对齐的过程。计算机内存是按照字节来寻址的，每个数据类型在内存中占用的字节数是固定的。

<u>**内存对齐的目的是为了提高内存访问的效率和性能**</u>。

在内存中，每个数据类型都有一个对齐要求，<u>**即它在内存中存储时的起始地址必须是某个特定值的倍数**</u>。这个特定值称为对齐单位或对齐边界。常见的对齐单位有1字节、2字节、4字节、8字节等。

内存对齐的原因有两个主要方面：

1. 访问效率：当数据按照对齐要求存储时，处理器可以更快地读取和写入这些数据。如果数据没有对齐，处理器可能需要进行多次内存访问，从而降低了效率。
2. 缓存一致性：现代计算机通常具有多级缓存，缓存的数据是按照对齐要求存储的。如果数据没有对齐，可能会导致缓存不一致的问题，从而影响程序的正确性和性能。

对于数据结构中的内存对齐十分好理解：

在构造一个数据结构类型的时候，它的内部有若干个基础数据类型。我们以这些基础类型中**占据内存字节最大的类型为基本存储大小**，在分配的内存的时候我们都**以此基本存储单元来分配内存**。对于**小于基本存储大小的**，<u>我们可以将这些小于的拼凑在一起，来尽可能减少空内存的浪费</u>。而**对于实在没有办法拼凑的**，<u>我们直接给它分配基本存储大小的内存空间</u>。

```c++
typedef struct shiyan{
	int a;//4
	int b;//4
	int c;//4
	char d;//1  4为最大的内存大小，因而每个元素应该按照4分配，不足4的也要给它分配4。
}shiyan;//16

typedef struct sy{
	int a;//4
	float b;//4
	double d;//8   8为最大的内存大小，因而每个按照8分配，因恰好可以拼接，发现可以凑成4个8，一个char在外，独立分配8字节内存
	int e;//4
	shiyan c;//12	可以视作将这个结构体的3个int和一个char都放在里面区考虑 
}oo;//40
```

在出现结构体中定义一个外部结构体时，在计算内存的时候我们**可以视作：将这个外部结构体的内部结构引入这个结构体内**，从而去计算结构体所占的大小。

**提醒：char即使采用数组格式，可以存储多个单元，我们仍然视作定义了若干个char，每个分配字节为1的内存给每个char，所以其最大内存大小仍被视作1**

### 位域使用

没学，先空着

### 结构体数组

我们经常在实际中，会出现需要声明多个结构体变量的情况，如果单一地一个一个来会很浪费时间。所以我们使用结构体数组来帮助我们，批量地对一堆相同结构的结构体进行操作。

```c++
#include<stdio.h>
typedef struct Student{ 
    int digit;
    char alpha[100]; 
    float score;
}Student,stu;//对变量stu进行结构体变量声明

void printfstus(Student *p, int len){    //这里将指针改成Student p[]
    for(int i = 0; i<len; i++){
    printf("digit:%d\t alpha:%s\t score:%.2f\t",
           (p+i)->digit, (p+i)->alpha, (p+i)->score);//此处输出的话就可以将(p+i)改为p[i]
    }
}
int main(){
    stu = {45,"yxl",78.65,{2000,12,31}};
    Student stus = {
                    {45,"yxl",78.65,{2000,12,31}},//第一个学生信息
                    {45,"yxl",78.65,{2000,12,31}},//第二个
                    {45,"yxl",78.65,{2000,12,31}},//第三个
                    //......同样的方法。
    };
    printfstus(stus,sizeof(stus)/sizeof(stus[0]));//如果指针和数组学的较好可以知道，数组就是一类指针。数组指向数组中的第一个元素，也就是数组无下标的时候就是第一个元素的地址。
    return 0;
}
```



## 函数

| function | usage        | effects        |
| -------- | ------------ | -------------- |
| size()   | array.size() | 获取数组的长度 |
|          |              |                |
|          |              |                |



### `malloc()`

`malloc()` 是**动态内存分配函数**之一，它的作用是在程序运行时在**堆（heap）**中分配一块指定大小的内存空间，并返回该内存空间的首地址。

需要先引入头文件

`#include <malloc.h>` 或 `#include <alloc.h>`或者`#include<stdlib.h>`

```c++
#include<stdio.h>
#include<malloc.h>
int main(){
    char *p;
    p=(char *)malloc(100);
    if(p)
        printf("Memory Allocated at:%x\n",p);
    else
        printf("Not Enough Memory\n");
    free(p);
    return 0;
}
```





```c++
void *malloc(size_t size);
```

其中，`size_t`表示要**分配的内存空间大小**，**单位是字节（byte）**

函数返回一个指向已分配内存的指针，分配失败则返回NULL

使用`malloc`函数可以动态地为变量、数组等数据结构分配内存，避免了在程序编译时限制了内存大小。但是需要注意的是，在使用完毕后，需要通过调用`free`函数来释放已分配的内存，以避免内存泄漏的问题。

`void`表示类型，例如给char、int类型的指针进行分配内存，则把`void`改为`char`、`int`如：`（char*）malloc（）`    `(int*)malloc()`

### `Chatgpt`解释

C语言中的 `malloc` 函数用于动态分配内存空间。它的主要作用是在运行时（程序执行过程中）从堆（heap）中分配一块指定大小的内存区域，并返回一个指向该内存区域的指针。这个分配的内存区域在程序不再需要时可以手动释放，以防止内存泄漏。

`malloc` 函数的原型如下：



复制代码

```c
void* malloc(size_t size);
```

其中：

- `size` 参数表示要分配的内存空间的字节数。通常，你需要提供一个整数值，表示你希望分配的内存大小。

- `malloc` 返回一个 `void` 指针，因此你需要将其显式地转换为适当的类型，以便在分配的内存空间中存储特定类型的数据。



下面是一个示例，演示了如何使用 `malloc` 来动态分配内存以存储整数数组：

```c
#include <stdio.h>
#include <stdlib.h>
int main() {
    int *arr;
    int size = 5;
	// 使用 malloc 分配一个包含 5 个整数的数组空间
	arr = (int*)malloc(size * sizeof(int));

	if (arr == NULL) {
    	printf("内存分配失败\n");
    	return 1;
	}

	// 对分配的内存进行操作
	for (int i = 0; i < size; i++) {
    	arr[i] = i * 10;
	}

	// 使用完内存后，记得释放
	free(arr);

	return 0;
}
```
在使用 `malloc` 后，你可以在分配的内存中存储数据，并在不再需要时使用 `free` 函数释放内存，以避免内存泄漏。