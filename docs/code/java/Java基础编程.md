# 编程

Java是面向对象的语言，面向对象的语言的程序的组成单位就是“**类**”；

使用关键字**class可以声明类**；

可运行的Java类的基本结构如下：

```java
class op {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```

`public`：用来修饰`class`，成为公共类，即使不在一个类中，其他类也可以访问它。

- tip: 一个`.java`文件中最多有一个公共类（<u>公共类可有可无</u>）


`class`：类关键字。

`op`：自定义的类名，如果其命名的类为`public class`，那这个文件要跟类同名。

`public static void main(String[] args)`：main方法，是程序的入口。可以理解成`python`中的**主函数语段**。

`system.out.println`：其作用是打印文本信息。同时`println`会额外输出后换行，Java中还有`print` `printf`



## 基本语法

Java程序的基本格式可以理解为如下格式：

```java
修饰符 class 类名{
	code
}
//Java中的注释方法

/*
	多行注释
			*/
```

在Java中，整型有四类：`byte`  `short`  `int`  `long`

### 基本类型

|  基本类型   |  大小   |    最小值    |        最大值         |   包装类型    |
| :---------: | :-----: | :----------: | :-------------------: | :-----------: |
| **boolean** |    —    |      —       |           —           |  **Boolean**  |
|  **char**   | 16 bits |  Unicode 0   | Unicode \(2^{16} -1\) | **Character** |
|  **byte**   | 8 bits  |     -128     |         +127          |   **Byte**    |
|  **short**  | 16 bits | \(- 2^{15}\) |    \(+ 2^{15} -1\)    |   **Short**   |
|   **int**   | 32 bits | \(- 2^{31}\) |    \(+ 2^{31} -1\)    |  **Integer**  |
|  **long**   | 64 bits | \(- 2^{63}\) |    \(+ 2^{63} -1\)    |   **Long**    |
|  **float**  | 32 bits |   IEEE754    |        IEEE754        |   **Float**   |
| **double**  | 64 bits |   IEEE754    |        IEEE754        |  **Double**   |
|  **void**   |    —    |      —       |           —           |   **Void**    |

- 基本类型有自己对应的**包装类型**：如果你希望在堆内存里表示基本类型的数据，就需要用到它们的**包装类**。

```java
char c = 'x'; 
Character ch = new Character(c);
```

- **自动装箱**和**自动拆箱**机制
- 高精度（非基本类型）： `BigInteger` 和 `BigDecimal`。



### 类型转换

类型转换符合如下格式

`目标类型 变量 = （目标类型） 值`

```java
class op{
    public static void main(String[] args){
		int out = 10;
        byte a = (byte) out;
        System.out.print("a="+a)//注意事项：print内只可以用“”而不能使用单引号''
        
        /* 与python中不同的是，Java的文本和非文本共同输出的格式需要使用 + 而仅有数值输出的时候，+仅承担相加的作用*/
        
        long b = (long)(a+out); //强制类型转换   
        System.out.println("b="+b);
    }
}
```



#### 特殊情况

计算的特殊情况：

两个`byte`变量相加，其结果赋值给一个`byte`变量是不会成功赋值的。

```java
class op{
	public static void main(String[] args){
		byte a = 2;
		byte b = 3;
        byte c = a + b ;
		System.out.print(c);
    }
}
```

是因为，这样的代码会出现编译问题。

`Javac`会默认两个byte相加把他们产生的结构自动升为`int`（直接跳过了`short`），所以需要使用上述的**强制类型转换**来解决这个问题。



### 作用域

在Java中，变量是有作用域的，类似于局部变量和全局变量

```java
class op{
	public static void main(String[] args){
		int a = 3;
		{
			int b = 3;
    		System.out.print("a="+a);
            System.out.print("b="+b);
		}		
        //b的作用域   在这个范围中，ab都可以起作用
		System.out.print("a="+a);
        System.out.print("b="+b);   //代码会报错，因为不在b的作用域，会认为b没有被定义
	}
}
```

在这个代码中，第一次输出的两个输出都可以成功输出。但是第二段输出不行，因为b定义在局部当中，没有被定义在全局中，所以不能全局可用。



### 选择结构



#### if else语句

展示一下，在Java当中的Java语句是怎么编写的

```java
class op{
	public static void main(String[] args){
		int a = 3;
		if(a<10){
			a++;
		}else if(a<20){
			a++;
		}else{
            System.out.pirnt(a);
        }
	}
}
```



#### 三元语句

类似于C的三元（就是C的三元）：

```java
condition ? result_1 : result_2;
```

先判断`condition`是否为真，若为真则输出`result_1`反之输出`result_2`。



#### switch语句

```java
class op{
	public static void main(String[] args){
        int day = 5;
        switch(day){
            case 1:
                code;
                break;
            case 2:
                code;
                break;
           	...
            default:
                code;
                break;
        }
    }
}
```

以上为Java中的选择结构部分，接下来介绍的Java中的循环结构



### 循环结构

#### while语句

while语句是我们先要学习的Java中的循环语句。

```
while{

}
```

#### for语句



```

```



### 声明变量

```java
int a = 12; // 设置 a 为整数类型,并给 a 赋值为 12 
String str = "Hello, OI-wiki"; // 声明字符串变量 str 
char ch = 'W'; 
double PI = 3.1415926;
```

#### final 关键字

`final` 含义是这是最终的、不可更改的结果。

被 `final` 修饰的变量只能被赋值一次，赋值后不再改变。

```java
final double PI = 3.1415926;
```



#### 数组

数组使用前需要被初始化，并且不能访问数组长度以外的数据。

- 以每个数组上少量的内存开销及运行时检查下标的额外时间为代价
- 当我们创建对象数组时，实际上是创建了一个引用数组，并且每个引用的初始值都为 **null** 。
- 如果我们尝试使用为 **null** 的引用，则会在运行时报错。

```java
// 有十个元素的整数类型数组
// 其语法格式为 数据类型[] 变量名 = new 数据类型[数组大小]
int[] ary = new int[10];
```



#### 字符串

```Java
// 最为简单的构造一个字符串变量的方法如下
String a = "Hello";

// 还可以使用字符数组构造一个字符串变量
char[] stringArray = { 'H', 'e', 'l', 'l', 'o' };
String s = new String(stringArray);
```



### 输入

Java通过输入流进行输入。

```java
import java.utils.Scanner
public class op{
	public static void main(String[] args){
        Scanner scanner = new Scanner(System.in)
        scanner.close(); //关闭输入流
    }		
}
```

## 类

### 类的描述

```java
class ATypeName {
 // 这里是类的内部
}
```

### 对象的创建

```java
ATypeName a = new ATypeName();
```

类中的内容：方法（method）和字段（field）

- 字段：可以是基本类型，也可以是引用类型。

  - 基本类型初始化

  |  基本类型   |    初始值     |
  | :---------: | :-----------: |
  | **boolean** |     false     |
  |  **char**   | \u0000 (null) |
  |  **byte**   |   (byte) 0    |
  |  **short**  |   (short) 0   |
  |   **int**   |       0       |
  |  **long**   |      0L       |
  |  **float**  |     0.0f      |
  | **double**  |     0.0d      |

  - 引用必须初始化

- 方法：方法决定对象能接收哪些消息。方法的基本组成部分包括名称、参数、返回类型、方法体。

  ```java
  [返回类型] [方法名](/*参数列表*/){
      // 方法体
  }
  ```

  - 方法只能作为类的一部分创建。它只能被对象所调用，并且该对象必须有权限来执行调用。

  ```java
  [对象引用].[方法名](参数1, 参数2, 参数3);
  ```

  - **参数传递：** 我们并没有直接处理对象，而是在传递对象引用

#### 创建过程

构造器是**静态方法**。

1. 定位类对象：在首次创建、访问 Dog 类型对象或静态方法、属性时，Java 解释器在类路径中查找，定位 Dog.class 。
2. 加载类对象：加载 Dog.class （创建 Class 对象）后，所有**静态初始化**的动作都执行完毕。静态初始化只在加载时执行一次。
3. 分配空间：使用 `new` 创建对象时，在堆中分配空间，并清零，设置为默认值
4. 初始化
5. 构造器

##### 初始化

注意初始化的顺序，不应当**向前引用**未初始化的数据。

##### 构造器

- Java 中使用了与 C++ 同样的方式：构造器名称与类名相同。

```java
class Rock {
    Rock() { // 这是一个构造器
        System.out.print("Rock ");
    }
}
```

构造器需要注意的事项：

- 默认构造器：没有指定的情况下编译器会自动创建
- 构造器嵌套：通过 `this` 调用一次构造器，避免代码重复

```java
Flower(String s, int petals) { 
 this(petals);
 //- this(s); // Can't call two! 
 this.s = s; // Another use of "this"
}
```

##### `this` 关键字

- 只能在非静态方法内部使用
- 一般用于在类的一个**方法内调用其他方法、返回对象本身的引用**





### 程序编写

- 命名可见性
  - 为一个**类库**生成一个明确的名称，Java 创建者希望我们反向使用自己的网络域名，因为域名通常是唯一的。反转域名后，`.` 用来代表子目录的划分。
  - 整个包名都是小写的。
  - 所有文件都自动存在于自己的命名空间中，文件中的每个类都具有唯一标识符。这样，Java 语言可以防止名称冲突。
  - 空目录：例如在 `com.mindviewinc.utility.foibles` 这样的目录结构中，我们创建了 `com` 和 `mindviewinc` 空目录。它们存在的唯一目的就是用来表示这个反向的 URL。
- 组件使用
  - `import`指示编译器导入一个包，也就是一个类库（在其他语言中，一个库不仅包含类，还可能包括函数和数据，但请记住 Java 中的所有代码都必须写在类里）。
  - 大多数时候，我们都在使用 Java 标准库中的组件。有了这些构件，你就不必写一长串的反转域名。如： `import java.util.*;`
  - 使用通配符 `*` 导入其中类
- 静态
  - 当我们说某个事物是**静态**时，就意味着该字段或方法不依赖于任何特定的对象实例 。
  - 关键字： `static`
  - 情况：
    - 你只想为特定字段（注：也称为属性、域）分配一个共享存储空间，而不去考虑究竟要创建多少对象，甚至根本就不创建对象。
    - 创建一个与此类的任何对象无关的方法。也就是说，即使没有创建对象，也能调用该方法。
  - 即使你创建了两个对象，但是静态变量仍只占一份存储空间。
  - 引用：我们通过一个对象来定位它，例如 `st2.i`。我们也可以**通过类名直接引用它**，这种方式对于非静态成员则不可行。
  - `static` 关键字的这些特性对于应用程序入口点的 `main()` 方法尤为重要。
