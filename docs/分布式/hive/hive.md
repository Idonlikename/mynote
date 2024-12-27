# 数据仓库Hive

Hive的优点是学习成本低，可以通过类似`SQL`语句实现快速`MapReduce`统计，使`MapReduce`变得更加简单，而不必开发专门的`MapReduce`应用程序。

Hive是十分适合数据仓库的统计分析，处理一些大型数据集，比传统数据仓库更加高效快捷。 

Hive是基于`Hadoop`的**数据仓库**工具。可以用于存储在`Hadoop`集群中的`HDFS`文件数据集进行数据整理、特殊查询和分析处理。Hive提供了类似于关系型数据库`SQL`语言的`HiveQL`工具，通过`HiveQL`可以快速实现简单的`MapReduce`统计。

### Hive的场景

Hive构建在`Hadoop`文件系统之上，Hive不提供实时的查询和基于行级的数据更新操作，不适合需要低延迟的应用，如联机事务处理（On-line Transaction Processing，OLTP）相关应用。

Hive适用于联机分析处理（On-Line Analytical Processing，OLAP），应用场景如图所示：

![img](https://Idonlikename.github.io/mynote/分布式/hive/image/img1.jpeg)

### Hive的特性

Hive作为数据仓库软件，使用类SQL的HiveQL语言实现数据查询，所有Hive数据均存储在Hadoop文件系统中，Hive具有以下特性。

使用HiveQL以类SQL查询的方式轻松访问数据，将HiveQL查询转换为MapReduce的任务在Hadoop集群上执行，完成ETL（Extract、Transform、Load——提取、转换、加载）、报表、数据分析等数据仓库任务。HiveQL内置大量UDF（User Defined Function）来操作时间、字符串和其他的数据挖掘工具，支持用户扩展UDF函数来完成内置函数无法实现的操作。

多种文件格式的元数据服务，包括TextFile、SequenceFile、RCFile和ORCFile，其中TextFile为默认格式，创建SequenceFile、RCFile和ORCFile格式的表需要先将文件数据导入到TextFile格式的表中，然后再把TextFile表的数据导入SequenceFile、RCFile和ORCFile表中。

直接访问HDFS文件或其他数据存储系统（如HBase）中的文件。

支持MapReduce、Tez、Spark等多种计算引擎，可根据不同的数据处理场景选择合适的计算引擎。

支持HPL/SQL程序语言，HPL/SQL是一种混合异构的语言，可以理解几乎任何现有的过程性SQL语言（如Oracle PL/SQL、Transact-SQL）的语法和语义，有助于将传统数据仓库的业务逻辑迁移到Hadoop上，是在Hadoop中实现ETL流程的有效方式。

可以通过HiveLLAP（Live Long and Process）、Apache YARN和Apache Slider（动态YARN应用，可按需动态调整分布式应用程序的资源）进行秒级的查询检索。LLAP结合了持久查询服务器和优化的内存缓存，使Hive能够立即启动查询，避免不必要的磁盘开销，提供较佳的查询检索效率。

#### 数据类型

hive中的数据类型不是真正的数据类型，而是一种验证过程或者说限定。



### 架构

Hive架构中主要包括客户端（Client）、Hive Server、元数据存储（MetaStore）、驱动器（Driver）。

![img](https://Idonlikename.github.io/mynote/分布式/hive/image/img2.jpeg)

#### Hive架构

Hive有多种接口供客户端使用，其中包括Thrift（Apache的一种软件框架，用于可扩展的跨语言服务开发）接口、数据库接口、命令行接口和Web接口。

数据库接口包括ODBC（Open Database Connectivity，开放数据库连接）和JDBC（Java DataBase Connectivity，Java数据库连接）。

客户端通过Thrift接口及数据库接口访问Hive时，用户需连接到Hive Server，通过Hive Server与Driver通信。命令行接口CLI是和Hive交互的最简单方式，可以直接调用Driver进行工作。CLI只能支持单用户，可用于管理员工作，但不适用于高并发的生产环境。用户也可使用Web接口通过浏览器直接访问Driver并调用其进行工作。

Hive Server作为JDBC和ODBC的服务端，提供Thrift接口，可以将Hive和其他应用程序集成起来。Hive Server基于Thrift软件开发，又被称为Thrift Server。Hive Server有两个版本，包括HiveServer和HiveServer2。HiveServer2本身自带了一个命令行工具BeeLine，方便用户对HiveServer2进行管理。

MetaStore存储Hive的元数据，Hive的元数据包括表的名字、表的属性、表的列和分区及其属性、表的数据所在目录等。元数据被存储在单独的关系数据库中，常用的数据库有MySQL和Apache Derby（Java数据库）。MetaStore提供Thrift界面供用户查询和管理元数据。

Driver接收客户端发来的请求，管理HiveQL命令执行的生命周期，并贯穿Hive任务整个执行期间。Driver中有编译器（Compiler）、优化器（Optimizer）和执行器（Executor）三个角色。Compiler编译HiveQL并将其转化为一系列相互依赖的Map/Reduce任务。Optimizer分为逻辑优化器和物理优化器，分别对HiveQL生成的执行计划和MapReduce任务进行优化。Executor按照任务的依赖关系分别执行Map/Reduce任务。

#### HCatalog

HCatalog用于Hadoop的表和元数据管理，使用户可以使用不同的数据处理工具（如Pig、MapReduce等）更轻松地读取和写入元数据。HCatalog基于Hive的MetaStore为数据处理工具提供服务。

下图中，HCatalog通过Hive提供的HiveMetaStoreClient对象来间接访问MetaStore，对外提供HCatLoader、HCatInputFormat来读取数据；提供HCatStorer、HCatOutputFormat来写入数据。

![img](https://Idonlikename.github.io/mynote/分布式/hive/image/img3.jpeg)



#### WebHCat

WebHCat是HCatalog的REST（Representational State Transfer，表现状态传输）接口，可以使用户能够通过安全的HTTPS协议执行操作。如图6-3所示，用户可以通过WebHCat访问Hadoop MapReduce（或YARN）、Pig（Apache的大型数据集分析平台）、Hive和HCatalog DDL（Data Definition Language，数据库模式定义语言）。WebHCat所使用的数据和代码在HDFS中维护，执行操作时需从HDFS读取。HCatalog DLL命令在接收请求时直接执行；MapReduce、Pig和Hive作业则由WebHCat服务器排队执行，可以根据需要监控或停止。

![img](https://Idonlikename.github.io/mynote/分布式/hive/image/img4.jpeg)

## 行存储列存储

### 概述

目前大数据存储有两种方案可供选择：**行存储（Row-Based）**和**列存储（Column-Based）**。

业界对两种存储方案有很多争持，集中焦点是:谁能够更有效地处理海量数据，且兼顾安全、可靠、完整性。从目前发展情况看，关系数据库已经不适应这种巨大的存储量和计算要求，基本是淘汰出局。

在已知的几种大数据处理软件中，`Hadoop`的`HBase`采用列存储，`MongoDB`是文档型的行存储，`Lexst`是二进制型的行存储。

### 在数据写入上的对比

1. **行存储的写入是一次完成**。一次完成的写入建立在操作系统的文件系统上，可以保证写入过程的成功或者失败，数据的完整性因此可以确定。即，行存储的数据完整性强。
2. 列存储由于需要把一行记录拆分成单列保存，**写入次数明显比行存储多（意味着磁头调度次数多，而磁头调度是需要时间的，一般在1ms~10ms)**，再加上磁头需要在盘片上移动和定位花费的时间，实际时间消耗会更大。所以，行存储在写入上占有很大的优势。
3. 还有数据修改,这实际也是一次写入过程。不同的是，数据修改是对磁盘上的记录做删除标记。行存储是在指定位置写入一次，列存储是将磁盘定位到多个列上分别写入，这个过程仍是行存储的列数倍。所以，数据修改也是以行存储占优。

### 在数据读取上的对比

1. 数据读取时，行存储通常将一行数据完全读出，如果只需要其中几列数据的情况，就会存在冗余列，出于缩短处理时间的考量，消除冗余列的过程通常是在内存中进行的。
2. 列存储每次读取的数据是集合的一段或者全部，不存在冗余性问题。
3. 集合一定是整型数据。这种情况使数据解析变得十分容易。相比之下，行存储则要复杂得多，因为在一行记录中保存了多种类型的数据，数据解析需要在多种数据类型之间频繁转换，这个操作很消耗CPU，增加了解析的时间。所以，列存储的解析过程更有利于分析大数据。
4. 从数据的压缩以及更性能的读取来对比

### 优缺点

显而易见，两种存储格式都有各自的优缺点：

- 行存储的写入是一次性完成，消耗的时间比列存储少，并且能够保证数据的完整性，缺点是数据读取过程中会产生冗余数据，如果只有少量数据，此影响可以忽略;数量大可能会影响到数据的处理效率。
- 列存储在写入效率、保证数据完整性上都不如行存储，它的优势是在读取过程，不会产生冗余数据，这对数据完整性要求不高的大数据处理领域，比如互联网，犹为重要。

**行存储适合业务的读取场景**，**列存储更适合分析的读取场景**，两种存储格式各自的特性都决定了它们的使用场景。

### 列存储的适用场景

1）一般来说，一个OLAP类型的查询可能需要访问几百万甚至几十亿个数据行，且该查询往往只关心少数几个数据列。例如，查询今年销量最高的前20个商品，这个查询只关心三个数据列：时间（date）、商品（item）以及销售量（sales amount）。商品的其他数据列，例如商品URL、商品描述、商品所属店铺，等等，对这个查询都是没有意义的。

而列式数据库只需要读取存储着“时间、商品、销量”的数据列，而行式数据库需要读取所有的数据列。因此，列式数据库大大地提高了OLAP大数据量查询的效率

OLTP    OnLine TransactionProcessor 在线联机事务处理系统（比如Mysql，Oracle等产品）

OLAP    OnLine AnalaysierProcessor  在线联机分析处理系统（比如Hive  Hbase等）

![img](https://Idonlikename.github.io/mynote/分布式/hive/image/img5.jpg)

2）很多列式数据库还支持列族（column group，Bigtable系统中称为locality group），即将多个经常一起访问的数据列的各个值存放在一起。如果读取的数据列属于相同的列族，列式数据库可以从相同的地方一次性读取多个数据列的值，避免了多个数据列的合并。列族是一种行列混合存储模式，这种模式能够同时满足OLTP和OLAP的查询需求。

3）此外，由于同一个数据列的数据重复度很高，因此，列式数据库压缩时有很大的优势。

例如，Google Bigtable列式数据库对网页库压缩可以达到15倍以上的压缩率。另外，可以针对列式存储做专门的索引优化。比如，性别列只有两个值，“男”和“女”，可以对这一列建立位图索引：

如下图所示

“男”对应的位图为100101，表示第1、4、6行值为“男”

“女”对应的位图为011010，表示第2、3、5行值为“女”

如果需要查找男性或者女性的个数，只需要统计相应的位图中1出现的次数即可。另外，建立位图索引后0和1的重复度高，可以采用专门的编码方式对其进行压缩。

当然，如果每次查询涉及的数据量较小或者大部分查询都需要整行的数据，列式数据库并不适用。

### 最后总结如下



**传统行式数据库的特性如下：**

①数据是按行存储的。

②没有索引的查询使用大量I/O。比如一般的数据库表都会建立索引，通过索引加快查询效率。

③建立索引和物化视图需要花费大量的时间和资源。

④面对查询需求，数据库必须被大量膨胀才能满足需求。



**列式数据库的特性如下：**

①数据按列存储，即每一列单独存放。

②数据即索引。

③只访问查询涉及的列，可以大量降低系统I/O。

④每一列由一个线程来处理，即查询的并发处理性能高。

⑤数据类型一致，数据特征相似，可以高效压缩。比如有增量压缩、前缀压缩算法都是基于列存储的类型定制的，所以可以大幅度提高压缩比，有利于存储和网络输出数据带宽的消耗。