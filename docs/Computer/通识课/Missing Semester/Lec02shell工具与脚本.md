## shell工具和脚本

### shell脚本

在本节我们将学习如何编写一个shell脚本，主要用bash。因为它最流行，应用更为广泛。

到目前为止，我们已经学习了如何在 shell 中执行命令，并使用管道将命令组合使用。但是，很多情况下我们需要执行一系列的操作并使用条件或循环这样的控制流。

shell 脚本的复杂性进一步提高。

大多数shell都有自己的一套脚本语言，包括**变量**、**控制流**和自己的语法。shell脚本与其他脚本语言不同之处在于，shell 脚本针对 shell 所从事的相关工作进行了优化。因此，创建**命令流程（pipelines）**、将结果保存到文件、从标准输入中读取输入，这些都是 shell 脚本中的原生操作，这让它比通用的脚本语言更易用。

#### 注意空格

在bash中为**变量赋值**的语法是`foo=bar`

**访问变量中存储的数值**，其语法为 `$foo`。

 需要注意的是，`foo = bar` （将各个字符用空格隔开）是不能正确工作的。在shell中空格是用于**分隔参数的字符**。

因此，如果各个字符用空格隔开的话，解释器会调用程序`foo` 并将 `=` 和 `bar`作为参数传入`foo`。

```bash
user:~$ foo=bar
user:~$ echo $foo
bar

user:~$ foo = bar
bash:command not found:foo  #脚本并没有找到foo这个程序
```

在shell脚本中使用空格会起到分割参数的作用。

#### 字符串

Bash中的字符串通过`'` 和 `"`分隔符来定义，二者在定义字符串的时候并没有任何的不同。但是实际上，它们的含义并不相同。

```shell
user:~$ echo "Hello"
Hello

user:~$ echo 'Hello'
Hello

#这里补充一下数组的输出
echo ${#string} #字符串长度
${string:1:3} #从第二个字符开始输出三位字符
var=(1 2 3 4)
echo ${var[@]} #数组全部内容，只是$var仅仅输出1 
echo ${var[1]} #第二个数
echo ${var[@]:1:3} #输出从第2个开始的3个
```

`''`定义的字符串为**原义字符串**，其中的变量不会被转义

 `""`定义的字符串会**将变量值进行替换**。

```bash
user:~$ foo=bar #定义变量foo

user:~$ echo "Value is $foo"
Value is bar  #""对于其中的字符串内容进行了转译，将其中的变量值进行了替换

user:~$ echo 'Value is $foo' 
Value is $foo   #''对于其中的字符串内容没有进行任何替换，而是按照原内容进行了输出
```

#### 控制流

即`for` `while` `if` `case`四大语句。

和其他大多数的编程语言一样，`bash`也支持`if`, `case`, `while` 和 `for` 这些控制流关键字。

```bash
if [ $a -gt $b ];then #演示一个判断变量a是否大于变量b的语句
	code....
fi

for num in 1 2 3 4 5;do
	code...
done

whie(condition);do #但是得注意一件事，在while中最外围的括号需要填充的内容为F/T，所以我们的条件需要一个()先转为布尔值
	code	
done
```

同样地， `bash` 也支持**定义函数**，它可以接受参数并基于参数进行操作。

下面这个函数是一个例子，它会创建一个文件夹并使用`cd`进入该文件夹。

```shell
user:~$ vim mcd.sh

#以下是mcd.sh文件中的内容
mcd () {
    mkdir -p "$1"  # 以传入的第一个参数作为目录名，创建一个目录（文件夹）。第一个在mkdir中参数-p的含义是创建多级目录
    cd "$1"   # 进入刚刚创建的文件夹当中
}

./mcd.sh # 可以直接执行脚本，参数在文件名后直接跟住就行。
source mcd.sh #  将mcd变为我们可以直接执行的shell程序

```

这里 `$1` 是一种特殊变量，类似于其他脚本语言中的`argv`。

与其他脚本语言不同的是，bash使用了很多特殊的变量来表示**参数**、**错误代码**和**相关变量**。也就是**保留关键字**。

下面列举了其中一些**保留关键字**，更完整的列表可以参考 [这里](https://www.tldp.org/LDP/abs/html/special-chars.html)。

- `$0` - 脚本名
- `$1` 到 `$9` - 脚本的参数。 `$1` 是第一个参数，依此类推。
- `$@` - 所有参数
- `$#` - 参数个数
- `$?` - 前一个命令的返回值，如果上一个命令是正确的，它应该会返回一个0。如果发生错误，会返回一个1。(C：return 0)
- `$$` - 当前脚本的进程识别码（`PID`）
- `!!` - 完整的上一条命令，包括参数。常见应用：当你因为权限不足执行命令失败时，可以使用 `sudo !!`再尝试一次。
- `$_` - 上一条命令的最后一个参数。如果你正在使用的是交互式 shell，你可以通过按下 `Esc` 之后键入 . 来获取这个值。



命令通常使用 `sdtout`来**返回输出值**，使用`stderr` 来**返回错误及错误码**，便于脚本以更加友好的方式报告错误。

返回码或退出状态是脚本/命令之间交流执行状态的方式。返回值0表示正常执行，其他所有非0的返回值都表示有错误发生。

退出码可以搭配 `&&`（与操作符）和 `||`（或操作符）使用，用来进行条件判断，决定是否执行其他程序。它们都属于短路[运算符](https://en.wikipedia.org/wiki/Short-circuit_evaluation)（[*] short-circuiting） 

同一行的多个命令可以用` ; `分隔，也就是**一行当中执行多个命令**。

程序 `true` 的返回码永远是`0`，`false` 的返回码永远是`1`。让我们看几个例子

```shell
#条件判断
user:~$ false || echo "Oops, fail"  
Oops, fail

user:~$ true || echo "Will not be printed"

#解释一下发生了什么，||的操作逻辑是会将两个命令按照先后顺序都运行一遍。如果都是为假，才能认定整个命令是错误的，而且也不会有输出。与C语言一样，当发现左侧为真时并不会再运行右侧的命令了（一个为真，则为真）。专业的说法应该时此处发生了短路[*]。


user:~$ true && echo "Things went well"
Things went well

user:~$ false && echo "Will not be printed"
#同理也是会按序运行，来看其是否正确，如果第二个命令执行则说明两个命令均为真。但是一旦出现错误，就会断定整个命令为错不会有输出。


user:~$ false ; echo "This will always run"
This will always run
#用";"符号可以将两个命令在同一行中执行。
```



#### $操作

如何将一个命令的输出存储到一个变量中

```shell
user:~$ foo=$(pwd) #变量foo会获取pwd的输出作为其变量值
```

我们可以通过这种方式将它放入字符串中实现   *命令替换*（*command substitution*）。命令替换是一种在Linux，Unix以及类Unix操作系统中常见的技术，用于在一个命令中嵌套另一个命令

```shell
user:~$ echo "We are in $(pwd)"
We are in /home/documents/test
#在linux中，其实没有""也可以实现
```

当我们通过 `$(CMD)` 这样的方式来执行`CMD` 这个命令时，它的**输出结果**会替换掉 `$(CMD)` 。

```shell
user:~$ ls
missing hello.txt

user:~$ ls -1 #man ls对于此参数作用的描述 list one file per line.
missing 
hello.txt

user:~$ echo for file in $(ls)
for file in missing hello.txt

user:~$ echo for file in "$(ls)"
for file in missing 
hello.txt  

#我有必要解释一下这些代码为什么发生了完全不同的事情。先说明一下，在UNIX中你应该会看见ls应该发生的是换行的情况。但我们这里是在Linux中，所以并没有出现换行的情况，需要给入一个参数-1才能实现每行一个文件的输出。但是你要是尝试将ls>file.txt 查看file.txt你会发现，file.txt中的内容也是每行一个文件名。
```

##### 两种echo的不同

如果我们使用`echo $(ls)`的话，`shell`捕获`echo`的输出并对其进行*字拆分*(`word splitting`)  这也就是说，所有的空格序列（包括换行符）都将被替换成单个空格，所以使用`echo $(ls)`的话就会出现输出都在一行的情况。

而我们使用`echo "$(ls)"`的时候则是 `shell`在捕获输出的时候因为`""`的纯在，进而被禁止了*字拆分*，也就是说其保留了原先默认的换行（在后续我们会解释，为什么说是默认的换行）。

总结：在shell获取`echo`程序的输出的时候会进行 *字拆分* 的默认操作，将空格序列（包括换行）变为单个空格。而使用`""`时候的时候则会禁用这种操作。

##### ls的细节

而我们单个使用`ls`为什么会出现单行输出多个文件，而进行`ls>file.txt`时，发现`file.txt`中的内容是多行输出呢？而使用`-1`参数的时候又是换行的呢？我们可以通过`man ls`查阅在`1`参数传入的时候发生了什么

```shell
 -1      (The numeric digit "one".) Force output to be one entry per line.
            This is the default when output is not to a terminal.
            
 #tips,虽然man cmd是一个很好的习惯，但是上述的内容在GNU coreutils是找不见的。
```

也就是说在*终端*（Terminal）上展示`ls`指令的输出的时候`1`是默认不启用的，而当`ls`在非终端上使用的时候，`1`又默认启用而发生了输出换行。在`echo`程序调用`ls`的输出的时候，其实`ls`已经认为自己是在非终端的情况了，所以会默认启用参数`1`。

#### 进程替换

还有一个冷门的类似特性是 *进程替换*（*process substitution*）， 在使用输出重定向`<`的时候再套一个括号`()`，如`<(CMD)` 。其会执行 `CMD` 并将结果输出到一个临时文件中，并将 `<(CMD)` 替换成临时文件名。这在我们希望返回值通过文件而不是STDIN传递时很有用。

例如， `diff <(ls foo) <(ls bar)` 会显示文件夹 `foo` 和 `bar` 中文件的**区别**。`cat <(ls) <(ls..)`会显示当前文件夹和上级目录中的所有文件

```shell
user:~/missing$ cat <(ls) <(ls ..)
last-modified.txt
semester
file.txt
hello.txt
las-modied.txt
missing
```

我们以一个具体的脚本范例来演示我们所提及的特性。这段脚本会遍历我们提供的参数，使用`grep` 搜索子字符串 `foobar`，如果没有找到，则将其作为注释追加到文件中。

打开`example.sh`文件

```shell
#!/bin/bash

echo "Starting program at $(date)" # date会被替换成日期和时间

echo "Running program $0 with $# arguments with pid $$" #$0是我们当前运行的脚本名，$#是我们给这个脚本的参数量，$$就是PID

for file in "$@"; do   # $@会展开为所有的参数
    grep foobar "$file" > /dev/null 2> /dev/null  #"/dev/null"被称作黑洞文件，顾名思义。而2>是用于重定向标准错误流的
    # 如果模式没有找到，则grep退出状态为 1
    # 我们将标准输出流和标准错误流重定向到Null，因为我们并不关心这些信息
    
    if [[ $? -ne 0 ]]; then  #-ne 即not equal不相等
        echo "File $file does not have any foobar, adding one" 
        echo "# foobar" >> "$file"  #在文件中追加一个#foobar的注释，如果单用>会覆盖写。
    fi
done

```

在条件语句中，我们比较 `$?` 是否是不等于0，也就是否是错的。如果是错的，即判断为真就会执行语句。 在bash中进行比较时，尽量使用双方括号 `[[ ]]` 而不是单方括号 `[ ]`，这样会降低犯错的几率，尽管这样并不能兼容 `sh`。

当执行脚本时，我们经常需要提供**形式类似的参数**。bash使我们可以轻松的实现这一操作，它可以基于文件扩展名展开表达式。这一技术被称为`shell`的 *通配*（*globbing*）

- 通配符 `*`和 `?` - 当你想要利用通配符进行匹配时，你可以分别使用 `?` 和 `*` 来匹配一个或任意个字符。

  例如

  我们有文件`foo`, `foo1`, `foo2`, `foo10` 和 `bar`

  ```shell
  user:~$ rm foo?
  #会删除foo1 和 foo2。也就是?会限制多出的字符数量必须等于?的个数 
  
  user:~$ rm foo* 
  #则会删除除了bar之外的所有文件。*不会限制字符数量 0~∞
  
  #通配同样可以用于文件的情况，比如删除所有的.sh文件：
  user:~$ rm *.sh
  user:~$ ls *.sh #展示此目录下的所有的.sh文件
  ```

  

- 花括号`{}` - 当你有一系列的指令，其中包含一段公共子串时，可以用花括号来自动展开这些命令。这在批量移动或转换文件时非常方便。

```shell
user:~$ convert image.{png,jpg}
# 会展开为
user:~$ convert image.png image.jpg

user:~$ cp /path/to/project/{foo,bar,baz}.sh /newpath
# 会展开为
user:~$ cp /path/to/project/foo.sh /path/to/project/bar.sh /path/to/project/baz.sh /newpath

# 也可以结合通配使用
user:~$ mv *{.py,.sh} folder
# 会移动所有 *.py 和 *.sh 文件

user:~$ mkdir foo bar

# 下面命令会创建foo/a, foo/b, ... foo/h, bar/a, bar/b, ... bar/h这些文件
user:~$ touch {foo,bar}/{a..h}
user:~$ touch foo/x bar/y
# 比较文件夹 foo 和 bar 中包含文件的不同
user:~$ diff <(ls foo) <(ls bar)
# 输出
# < x
# ---
# > y  #说明y文件仅存于bar文件夹中
```



#### 其他语言的脚本

编写 `bash` 脚本有时候会很别扭和反直觉。我们可以使用 [shellcheck](https://github.com/koalaman/shellcheck) 这样的工具可以帮助你定位sh/bash脚本中的错误。

终端中不仅仅可以使用bash写的脚本，同样可以使用其他语言。

比如说，这是一段 Python 脚本，作用是将输入的参数倒序输出：

```python 
#!/usr/local/bin/python
import sys  #python在默认情况下不与shell交互，所以我们需要导入sys库
for arg in reversed(sys.argv[1:]):
    print(arg)
```

开头这行叫做`shebang`让*内核*（kernel）知道如何运行这个脚本。如果没有这一行的话，我们需要`python script.py`来运行脚本，但是我们有了这一行，所以我们直接用`./ script.py`就可以运行这个脚本。开头的路径同时告知了运行这个脚本所需要的解释器在哪儿。

内核知道去用 python 解释器而不是 shell 命令来运行这段脚本，是因为脚本的开头第一行的 [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix))。

但是我们会出现不知道需要解释器所在的位置在哪儿？（不同的系统中可能同个解释器位置不同）

为了解决这个问题，我们可以在 `shebang` 行中使用 `env` 命令，

```python
#!/usr/bin/env python
```

它会利用环境变量中的程序来解析该脚本，这样就提高了您的脚本的可移植性。`env` 会利用我们第一节讲座中介绍过的`PATH` 环境变量来进行定位。 

shell函数和脚本有如下一些不同点：

- 函数只能与shell使用相同的语言，脚本可以使用任意语言。因此在脚本中包含 `shebang` 是很重要的。
- 函数仅在定义时被加载，脚本会在每次被执行时加载。这让函数的加载比脚本略快一些，但每次修改函数定义，都要重新加载一次。
- 函数会在当前的shell环境中执行，脚本会在单独的进程中执行。因此，函数可以对环境变量进行更改，比如改变当前工作目录，脚本则不行。脚本需要使用 `export`将环境变量导出，并将值传递给环境变量。
- 与其他程序语言一样，函数可以提高代码模块性、代码复用性并创建清晰性的结构。shell脚本中往往也会包含它们自己的函数定义。



### shell工具

#### 查看命令如何使用

我们应该如何在使用命令时，使用正确的选项达到我们想要的效果呢？例如 `ls -l`, `mv -i` 和 `mkdir -p`。更普遍的是，给一个命令行，应该怎样了解如何使用这个命令行并找出它的不同的选项呢？

在上一节中我们介绍过，最常用的方法是为对应的命令行添加`-h` 或 `--help` 标记。

另外一个更详细的方法则是使用`man` 命令。`man` 命令是手册（manual）的缩写，它提供了命令的用户手册。例如，`man rm` 会输出命令 `rm` 的说明，同时还有其标记列表，包括之前我们介绍过的`-i`。 

事实上，目前我们给出的所有命令的说明链接，都是网页版的Linux命令手册。即使是您安装的第三方命令，前提是开发者编写了手册并将其包含在了安装包中。在交互式的、基于字符处理的终端窗口中，一般也可以通过 `:help` 命令或键入 `?` 来获取帮助。

有时候手册内容太过详实，让我们难以在其中查找哪些最常用的标记和语法。 [TLDR pages](https://tldr.sh/) 是一个很不错的替代品，它提供了一些案例，可以帮助您快速找到正确的选项。

#### 查找文件

程序员们面对的最常见的重复任务就是查找文件或目录。

所有的类UNIX系统都包含一个名为 [`find`](https://man7.org/linux/man-pages/man1/find.1.html) 的工具，它是 shell 上用于查找文件的绝佳工具。`find`命令会递归地搜索符合条件的文件，例如：

```shell
# 查找所有名称为src的文件夹
find . -name src -type d

# 查找所有文件夹路径中包含test的python文件
find . -path '*/test/*.py' -type f

# 查找前一天修改的所有文件
find . -mtime -1

# 查找所有大小在500k至10M的tar.gz文件
find . -size +500k -size -10M -name '*.tar.gz'
```

除了列出所寻找的文件之外，find 还能对所有查找到的文件进行操作。

这能极大地简化一些单调的任务。

```shell
# 删除全部扩展名为.tmp 的文件
find . -name '*.tmp' -exec rm {} \;
# 查找全部的 PNG 文件并将其转换为 JPG
find . -name '*.png' -exec convert {} {}.jpg \;
```

尽管 `find` 用途广泛，它的语法却比较难以记忆。例如，为了查找满足模式 `PATTERN` 的文件，您需要执行 `find -name '*PATTERN*'` (如果您希望模式匹配时是不区分大小写，可以使用`-iname`选项）

您当然可以使用 alias 设置别名来简化上述操作，但 shell 的哲学之一便是寻找（更好用的）替代方案。 记住，shell 最好的特性就是您只是在调用程序，因此您只要找到合适的替代程序即可（甚至自己编写）。

例如，[`fd`](https://github.com/sharkdp/fd) 就是一个更简单、更快速、更友好的程序，它可以用来作为`find`的替代品。它有很多不错的默认设置，例如输出着色、默认支持正则匹配、支持unicode并且我认为它的语法更符合直觉。以模式`PATTERN` 搜索的语法是 `fd PATTERN`。

大多数人都认为 `find` 和 `fd` 已经很好用了，但是有的人可能想知道，我们是不是可以有更高效的方法，例如不要每次都搜索文件而是通过编译索引或建立数据库的方式来实现更加快速地搜索。

这就要靠 [`locate`](https://man7.org/linux/man-pages/man1/locate.1.html) 了。 `locate` 使用一个由 [`updatedb`](https://man7.org/linux/man-pages/man1/updatedb.1.html)负责更新的数据库，在大多数系统中 `updatedb` 都会通过 [`cron`](https://man7.org/linux/man-pages/man8/cron.8.html) 每日更新。这便需要我们在速度和时效性之间作出权衡。而且，`find` 和类似的工具可以通过别的属性比如文件大小、修改时间或是权限来查找文件，`locate`则只能通过文件名。 [这里](https://unix.stackexchange.com/questions/60205/locate-vs-find-usage-pros-and-cons-of-each-other)有一个更详细的对比。

#### 查找代码

查找文件是很有用的技能，但是很多时候您的目标其实是查看文件的内容。

为了实现这一点，很多类UNIX的系统都提供了[`grep`](https://man7.org/linux/man-pages/man1/grep.1.html)命令，它是用于对输入文本进行匹配的通用工具。它是一个非常重要的shell工具，我们会在后续的数据清理课程中深入的探讨它。

`grep` 有很多选项，这也使它成为一个非常全能的工具。

 `-C` ：获取查找结果的上下文（Context）；

`-v` 将对结果进行反选（Invert），也就是输出不匹配的结果。

举例来说， `grep -C 5` 会输出匹配结果前后五行。当需要搜索大量文件的时候，使用 `-R` 会递归地进入子目录并搜索所有的文本文件。

但是，我们有很多办法可以对 `grep -R` 进行改进，例如使其忽略`.git` 文件夹，使用多CPU等等。

因此也出现了很多它的替代品，包括 [ack](https://beyondgrep.com/), [ag](https://github.com/ggreer/the_silver_searcher) 和 [rg](https://github.com/BurntSushi/ripgrep)。它们都特别好用，但是功能也都差不多，我比较常用的是 ripgrep (`rg`) ，因为它速度快，而且用法非常符合直觉。例子如下：

```shell
# 查找所有使用了 requests 库的文件
rg -t py 'import requests'

# 查找所有没有写 shebang 的文件（包含隐藏文件）
rg -u --files-without-match "^#!"

# 查找所有的foo字符串，并打印其之后的5行
rg foo -A 5

# 打印匹配的统计信息（匹配的行和文件的数量）
rg --stats PATTERN
```

与 `find`/`fd` 一样，重要的是你要知道有些问题使用合适的工具就会迎刃而解，而具体选择哪个工具则不是那么重要。

#### 查找 shell 命令

一个简单的方法是按向上的方向键会显示你使用过的上一条命令，继续按上键则会遍历整个历史记录。

`history` 命令允许您以程序员的方式来访问shell中输入的历史命令。

这个命令会在标准输出中打印shell中的历史命令。

如果我们要搜索历史记录，则可以利用管道将输出结果传递给 `grep` 进行模式搜索。 `history | grep find` 会打印包含find子串的命令。

对于大多数的shell来说，您可以使用 `Ctrl+R` 对命令历史记录进行回溯搜索。敲 `Ctrl+R` 后您可以输入子串来进行匹配，查找历史命令行。反复按下就会在所有搜索结果中循环。在 [zsh](https://github.com/zsh-users/zsh-history-substring-search) 中，使用方向键上或下也可以完成这项工作。

`Ctrl+R` 可以配合 [fzf](https://github.com/junegunn/fzf/wiki/Configuring-shell-key-bindings#ctrl-r) 使用。`fzf` 是一个通用的模糊查找工具，它可以和很多命令一起使用。这里我们可以对历史命令进行模糊查找并将结果以赏心悦目的格式输出。

另外一个和历史命令相关的技巧我喜欢称之为**基于历史的自动补全**。 这一特性最初是由 [fish](https://fishshell.com/) shell 创建的，它可以根据您最近使用过的开头相同的命令，动态地对当前的shell命令进行补全。这一功能在 [zsh](https://github.com/zsh-users/zsh-autosuggestions) 中也可以使用，它可以极大的提高用户体验。

你可以修改 shell history 的行为。

例如，如果在命令的开头加上一个空格，它就不会被加进shell记录中。当你输入包含密码或是其他敏感信息的命令时会用到这一特性。 为此你需要在`.bashrc`中添加`HISTCONTROL=ignorespace`或者向`.zshrc` 添加 `setopt HIST_IGNORE_SPACE`。 如果你不小心忘了在前面加空格，可以通过编辑 `.bash_history`或 `.zhistory` 来手动地从历史记录中移除那一项。

#### 文件夹导航

之前对所有操作我们都默认一个前提，即您已经位于想要执行命令的目录下，但是如何才能高效地在目录间随意切换呢？有很多简便的方法可以做到，比如设置alias，使用 [ln -s](https://man7.org/linux/man-pages/man1/ln.1.html) 创建符号连接等。而开发者们已经想到了很多更为精妙的解决方案。

由于本课程的目的是尽可能对你的日常习惯进行优化。因此，我们可以使用[`fasd`](https://github.com/clvv/fasd)和 [autojump](https://github.com/wting/autojump) 这两个工具来查找最常用或最近使用的文件和目录。

Fasd 基于 [*frecency* ](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/Places/Frecency_algorithm)对文件和文件排序，也就是说它会同时针对频率（*frequency*）和时效（*recency*）进行排序。默认情况下，`fasd`使用命令 `z` 帮助我们快速切换到最常访问的目录。例如， 如果您经常访问`/home/user/files/cool_project` 目录，那么可以直接使用 `z cool` 跳转到该目录。对于 autojump，则使用`j cool`代替即可。

还有一些更复杂的工具可以用来概览目录结构，例如 [`tree`](https://linux.die.net/man/1/tree), [`broot`](https://github.com/Canop/broot) 或更加完整的文件管理器，例如 [`nnn`](https://github.com/jarun/nnn) 或 [`ranger`](https://github.com/ranger/ranger)。

