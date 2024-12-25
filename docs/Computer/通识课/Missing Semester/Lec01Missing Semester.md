## The Missing  Semester of Your CS Education

### Shell

`shell`是一个脚本语言、一个命令行解释器。

是操作系统中提供**访问内核、调用内核程序**。

Shell也用于泛指所有为用户提供操作界面的程序，也就是程序和用户交互的层面。因此与之相对的是内核（**Kernel**），内核不提供和用户的交互功能（来自wiki）。

shell是**文本接口**，其可以充分利用计算机的能力。

它的功能是实现：**执行程序**，输入并获取某种**半结构化的输出**。

#### Bash - Bourne Again SHell

Bash是被最广泛使用的一种 shell，最常见的一种shell，它的语法和其他的 shell 都是类似的。你可以将它当作一种shell脚本。

bash是`MacOS`和`Linux`中**默认使用的shell**，同时它也与其他shell相兼容。偶尔可能是你会发现`zsh`这也是一种常用的shell脚本

#### 使用Shell

如果我们打开终端(`Terminal`)，终端是能够显示`shell`的界面，我们可以看到终端显示出这样的界面

```shell
user:~$
```

这是shell的主要文本接口。

其中包含了我们的用户名 `user`

以及我们所在的目录 ：`~`意味着我们在`home``

``$`则意味着我们现在并不是`root`用户。



我们可以向shell输入我们的命令，shell会对我们的命令进行解析（具体的运行过程我们会在之后的内容给出），

我们以两个简单的命令为例：

##### `date`

执行`date`程序，返回了当前的日期

```shell
user:~$ date
当前日期: 2023/05/04 周四
```



##### `echo`

执行`echo`程序，且指定了参数为`hello`，于是我们输出了 `hello`

```shell
user:~$ echo hello
hello
```

由第二个例子可见，shell的解析是**以空格来分割命令并进行解析**。

如果希望传递的参数中包含空格（例如一个名为 My Photos 的文件夹）

- 要么用使用`''`单引号，`""`双引号将其包裹起来（在之后我们会解释两种符号的不同）
- 要么使用转义符号 `\` 进行处理（`My\ Photos`）



#### Shell是如何运行

shell 是如何运行`date` 或 `echo` 的呢？

类似于 `Python` 或 `Ruby`，shell 是一个编程环境，所以它也具备**变量**、**条件**、**循环**和**函数**。

所以当在 shell 中执行命令时，实际上是在**执行一段 shell 可以解释执行的简短代码**。

如果你要求 shell 执行某个指令，但是该指令并不是 shell 所了解的编程关键字，那么它会去咨询 **环境变量** `$PATH`，这十分关键，当然你也可以使用`source`命令自行增添一些指令。

环境变量`PATH`它会列出当 shell 接到某条指令时，进行程序搜索的路径：

```shell
user:~$ echo $PATH    #列出所有的环境变量
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

user:~$ which echo  #echo 所在的路径
/bin/echo

user:~$ /bin/echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

三段指令的解读：

当我们执行 `echo` 命令时，shell 了解到需要执行 `echo` 这个程序，随后它便会在 `$PATH` 中搜索**由 `:` 所分割**的一系列目录，基于名字搜索该程序。当找到该程序时便执行

使用 `which` 程序确定某个**程序名**代表的是哪个**具体的程序，即程序所在的具体路径**。

我们也可以绕过 `$PATH`，通过直接指定需要执行的程序所在的**路径**来执行该程序



#### 在Shell中导航

shell 中的路径是一组被分割的目录

在 `Linux` 和 `macOS` 上使用 `/` 分割，在Windows上是 `\`。妈的，Microsoft你知道我复制路径过来一个个改多狼狈么？

路径 `/` 代表的是系统的根目录（`root`），所有的文件夹都包括在这个路径之下。而在Windows上每个盘都有一个根目录（例如： `C:\`）。

如果某个路径以 `/` 开头，那么它是一个 **绝对路径**，其他的都是 **相对路径** 。相对路径是指相对于当前工作目录的路径，**当前工作目录可以使用 `pwd` 命令来获取**。在路径中，`.` 表示的是**当前目录**，而 `..` 表示**父级目录**。

```shell
missing:~$ pwd  #pwd 会打印当前所处文件位置的绝对路径
/home/missing

missing:~$ cd /home
missing:/home$ pwd
/home

missing:/home$ cd .. #返回上级目录
missing:/$ pwd
/  #根目录

missing:/$ cd ./home #到达当前目录下的home文件夹
missing:/home$ pwd
/home

missing:/home$ cd missing 
missing:~$ pwd
/home/missing

missing:~$ ../../bin/echo hello  #构建目录体系寻找，用多个父级目录
hello

missing:~$ cd ~ #这是一种返回主目录的方法
```

shell 会实时显示当前的路径信息。

##### `ls`

为了查看指定目录下包含哪些文件，我们使用 `ls` 命令

(过于常见的指令这里不做演示)



大多数的命令接受标记和选项（带有值的标记），它们以 `-` 开头，并可以改变程序的行为。通常，在执行程序时使用 `-h` 或 `--help` 标记可以打印帮助信息，以便了解有哪些可用的标记或选项。例如，`ls --help` 的输出如下：

```shell
  -l                         use a long listing format
```

```shell
missing:~$ ls -l /home
drwxr-xr-x 1 missing  users  4096 Jun 15  2019 missing
```

这个参数可以更加详细地列出目录下文件或文件夹的信息。

本行第一个字符 `d` 表示 `missing` 是一个目录（directory）。

然后接下来的九个字符，每三个字符构成一组。 

（`rwx`）. 它们分别代表了文件所有者（`missing`），用户组（`users`） 以及其他所有人具有的**权限**。

其中 `-` 表示该用户不具备相应的权限。

`rwx`分别意味着读、写、运行

##### 其他常用指令

`mv`（用于重命名或移动文件）、 `cp`（拷贝文件）以及 `mkdir`（新建文件夹）。`cat`（打印文件内容）

`man`（用于获取一个指令的用户手册）与 `--help`如出一辙，不同的地方是`man`会进入另外一个页面。

`grep`（搜索文本文件，查找匹配正则表达式的行，并将其打印出来）

`clear`指令与 `ctrl+l`效果一致



### 在程序间创建连接

在 shell 中，程序有两个主要的“流”：它们的**输入流**和**输出流**。这里说一下，每个进程有默认3个打开的文件描述符，为`0 1 2 `分别意味着**标准输入流**，**标准输出流**，**标准错误输出流**。

输出和输入的重定向是不被程序所知晓的，它们只是进行了它们的默认操作。



#### 重定向

最简单的重定向是 `< file` 和 `> file`。

`>file`是一个输入重定向，`<file`是一个输出重定向。这里需要注意的是，如果指令不产生输出，在写入操作也就是`>file`的时候，需要依赖`echo`进行输入的重定向。

这两个命令可以将程序的输入输出流分别重定向到文件：

```shell
missing:~$ echo hello > hello.txt
missing:~$ cat hello.txt  #打印了文件内容,即输出“hello”
hello

missing:~$ cat < hello.txt #shell首先调用了hello.txt中的内容，将其作为cat指令的输入，打印了内容
hello

missing:~$ cat < hello.txt > hello2.txt  #shell调用了hello.txt的内容传给了cat作为输入，cat的输出传给了hello2作为内容
missing:~$ cat hello2.txt
hello

missing:~$ bash test.sh > file 2>&1 #这个命令的值得一提，它的含义是将标准错误的输出和标准输出一并写入file文件中

missing:~$ bash test.sh 2>> file #联系之前的内容，写入一个错误信息在file
```

单独一个`>`会覆盖之前写入文件中的内容，所以你可以用`>>`进行**追加**，也就是使之前写入的内容不被覆盖继续写入。



#### 管道

使用管道（ *pipes* ），我们能够更好的利用文件重定向。`|`的作用是让我们将**左边程序的输出**作为**右边程序的输入**从而让两个程序之间联系在一起。 

`|` 操作符允许我们将一个程序的输出和另外一个程序的输入连接起来：

```shell
missing:~$ ls -l / | tail -n1
drwxr-xr-x 1 root  root  4096 Jun 20  2019 var
missing:~$ curl --head --silent google.com | grep --ignore-case content-length | cut --delimiter=' ' -f2
219
```



### root用户

根用户几乎不受任何限制，他可以创建、读取、更新和删除系统中的任何文件。我们会在需要的时候使用 `sudo` 命令。顾名思义，它的作用是让您可以以 `su`（super user 或 root 的简写）的身份执行一些操作。 当您遇到拒绝访问（permission denied）的错误时，通常是因为此时您必须是根用户才能操作。

有一件事情是您必须作为根用户才能做的，那就是向 `sysfs` 文件写入内容。系统被挂载在 `/sys` 下，`sysfs` 文件则暴露了一些内核（kernel）参数。 因此，您不需要借助任何专用的工具，就可以轻松地在运行期间配置系统内核。

**注意 Windows 和 macOS 没有这个文件**



```shell
$ sudo find -L /sys/class/backlight -maxdepth 2 -name '*brightness*'
/sys/class/backlight/thinkpad_screen/brightness

$ cd /sys/class/backlight/thinkpad_screen

$ sudo echo 3 > brightness
An error occurred while redirecting file 'brightness'
open: Permission denied
```

出乎意料的是，这里发生了报错。即使我们已经使用过了`sudo`命令。关于 shell，有件事我们必须要知道。`|`、`>`、和 `<` 是通过 shell 执行的，而不是被各个程序单独执行。 `echo` 等程序并不知道 `|` 的存在，它们只知道从自己的输入输出流中进行读写。 对于上面这种情况， ***shell* (权限为您的当前用户) 在设置 `sudo echo` 前尝试打开 brightness 文件并写入**，但是系统拒绝了 shell 的操作因为此时 shell 不是根用户。

明白这一点后，我们可以这样操作：

```shell
$ echo 3 | sudo tee brightness
```

因为打开 `/sys` 文件的是 `tee`（“分叉流”，将输入同时写入到终端和文件中） 这个程序，并且该程序以 `root` 权限在运行，因此操作可以进行。

或者我们可以在指令的前面加一个`#`

这个`#`意味着我们是以root的身份运行此命令的，而通常`$`意味着我们并非root用户。（也可以是`sudo bash -c`，跟这个方法是一个道理）



