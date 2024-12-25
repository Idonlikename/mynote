## MapReduce

`MapReduce` 将计算过程分为两个阶段：Map 阶段和 Reduce 阶段。也就是指 `Hadoop` 程序执行的两个独立且不同的任务。第一个是映射作业，它获取一组数据并将其转换为另一组数据，其中各个元素被分解为元组（键/值对）。

**Map阶段**：在这个阶段，输入数据被分割成多个独立的片段，每个片段由一个Map任务处理。Map任务对数据片段进行处理，并产生中间的键值对(key-value pairs)。

**Reduce阶段**：Map阶段产生的中间数据会被 Shuffle 过程传输给Reduce任务。Reduce任务将具有相同键的值聚合在一起，并进行归约操作，如计算总和、平均值等。 

前言：

Google于2003年在SOSP上发表了《The Google File System》，于2004年在OSDI上发表了《MapReduce: Simplified Data Processing on Large Clusters》，于2006年在OSDI上发表了《Bigtable: A Distributed Storage System for Structured Data》。这三篇论文为大数据及云计算的发展奠定了基础

一、MapReduce概述

MapReduce是一个分布式、并行处理的计算框架。

MapReduce 把任务分为 Map 阶段和 Reduce 阶段。开发人员使用存储在HDFS 中数据（可实现快速存储），编写 Hadoop 的 MapReduce 任务。由于 MapReduce工作原理的特性， Hadoop 能以并行的方式访问数据，从而实现快速访问数据。

### 结构部分

MapReduce体系结构主要由四个部分组成，分别是：`Client`、`JobTracker`、`TaskTracker`以及`Task`

![img](E:\Desktop\File\大三上\分布式计算\mapreduce\image\image1.png)

#### Client

用户编写的MapReduce程序通过Client提交到JobTracker端 用户可通过Client提供的一些接口查看作业运行状态。

#### JobTracker

JobTracker负责资源监控和作业调度 JobTracker 监控所有TaskTracker与Job的健康状况，一旦发现失败，就将相应的任务转移到其他节点 JobTracker 会跟踪任务的执行进度、资源使用量等信息，并将这些信息告诉任务调度器（TaskScheduler），而调度器会在资源出现空闲时，选择合适的任务去使用这些资源。

#### TaskTracker

TaskTracker 会周期性地通过“心跳”将本节点上资源的使用情况和任务的运行进度汇报给JobTracker，同时接收JobTracker 发送过来的命令并执行相应的操作（如启动新任务、杀死任务等） TaskTracker 使用“slot”等量划分本节点上的资源量（CPU、内存等）。一个Task 获取到一个slot 后才有机会运行，而Hadoop调度器的作用就是将各个TaskTracker上的空闲slot分配给Task使用。slot 分为Map slot 和Reduce slot 两种，分别供MapTask 和Reduce Task 使用。

#### Task

Task 分为Map Task 和Reduce Task 两种，均由TaskTracker 启动。

### 执行阶段

MapReduce各个执行阶段：

![img](E:\Desktop\File\大三上\分布式计算\mapreduce\image\image2.png)

 MapReduce应用程序执行过程：

![img](E:\Desktop\File\大三上\分布式计算\mapreduce\image\image3.png)







## Word Count

### Map

进行**切片操作**，它负责将大规模数据集分割成小块，并对每一块进行初步处理和转换，为Reduce阶段的聚合操作打下基础。主要负责处理输入数据并生成**中间键值对**（key-value pairs）

其中的处理包括：**数据划分**、**数据转换**、**中间结果的生成**、**局部聚合**，**并行计算**



### 介于Map和Reduce中间

**Merge（合并）**： 合并是指将两个或多个数据集按照某种规则（例如，基于共享的键）组合成一个数据集。在大数据领域，这通常涉及到将不同来源或分布式存储的数据整合在一起。例如，Spark和Hadoop中的Join操作就是一种典型的合并操作。Merge操作有多种类型，例如Inner Join、Left Join、Right Join和Full Outer Join。

**Combine（组合）**： 在大数据处理中，组合通常是指在数据分区和处理过程中，将相同键的数据整合在一起。组合的主要目的是减少数据在网络中传输的开销，从而提高处理性能。例如，在MapReduce、Spark等大数据框架中，Shuffle过程中的Combiner可以将同一个节点上的中间结果组合起来，以减少数据在网络中的传输。Combiner操作通常用于那些满足结合律和交换律的操作，例如计数、求和、最大值和最小值等。



### Reduce

数据的汇总，聚合以及结果生成。

**Aggregate（聚合）**： 聚合是指将一组数据通过某种操作（例如，求和、计数、平均、最大值、最小值等）汇总成一个值。在大数据处理中，聚合操作通常用于从大量数据中提取有价值的信息。例如，在SQL查询中的GROUP BY子句，以及Spark、Hadoop等大数据框架中的Reduce操作，都涉及到对数据进行聚合。





### Shuffle过程详解

`Hadoop`运行机制中，将map输出进行**分区**、**分组**、**排序**和**合并**等处理后作为输入传给Reducer的过程，称为shuffle过程。

shuffle阶段又可以分为Map端的shuffle和Reduce端的shuffle。

#### 一、Map端的shuffle

写磁盘：Map端会处理输入数据并产生中间结果，这个中间结果会写到本地磁盘，而不是HDFS。每个Map的输出会先写到内存缓冲区中，当写入的数据达到设定的阈值时，系统将会启动一个线程将缓冲区的数据写到磁盘，这个过程叫做spill。

分区、分组、排序：在spill写入之前，会先进行二次排序，首先根据数据所属的partition进行排序，然后每个分区（partition）中的数据再按key来排序。partition的目是将记录划分到不同的Reducer上去，以期望能够达到负载均衡，以后的Reducer就会根据partition来读取自己对应的数据。接着运行combiner(如果设置了的话)，combiner的本质也是一个Reducer，其目的是对将要写入到磁盘上的文件先进行一次处理，这样，写入到磁盘的数据量就会减少。最后将数据写到本地磁盘产生spill文件(spill文件保存在{mapred.local.dir}指定的目录中，Map任务结束后就会被删除)。

- 文件合并：最后，每个Map任务可能产生多个溢写文件（spill file），在每个Map任务完成前，会通过多路归并算法将这些spill文件归并成一个已经分区和排序的输出文件。至此，Map的shuffle过程就结束了。

- 压缩：在shuffle过程中如果压缩被启用，在map传出数据传入Reduce之前可执行压缩，默认情况下压缩是关闭的，可以将mapred.compress.map.output设置为true可实现压缩。

#### 二、Reduce端的shuffle

Reduce端的shuffle主要包括三个阶段，copy、sort(merge)和reduce。

首先要将Map端产生的输出文件拷贝到Reduce端，但每个Reducer如何知道自己应该处理哪些数据呢？因为Map端进行partition的时候，实际上就相当于指定了每个Reducer要处理的数据(partition就对应了Reducer)，所以Reducer在拷贝数据的时候只需拷贝与自己对应的partition中的数据即可。每个Reducer会处理一个或者多个partition，但需要先将自己对应的partition中的数据从每个Map的输出结果中拷贝过来。

接下来就是排序（sort）阶段，也成为合并（merge）阶段，因为这个阶段的主要工作是执行了归并排序。从Map端拷贝到Reduce端的数据都是有序的，所以很适合归并排序。最终在Reduce端生成一个较大的文件作为Reduce的输入。MapReduce编程接口







## MapReduce项目案例

### WordCount

代码演示：

```java
package hadoop.mapreduce;

import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class MyWordCount {
	/*
	 * 	KEYIN：是map阶段输入的key（偏移量）
	 * 	VALUEIN：是map阶段输入的value（文本文件的内容--行）
	 *  KEYOUT：是map阶段输出的key(单词)
	 *  VALUEOUT：是map阶段输出的value（单词的计数--1）
	 *  
	 *  Java基本数据类型：
	 *  	int、short、long、double、float、char、boolean、byte
	 *  hadoop数据类型
	 *  	IntWritable、ShortWritable、LongWritable、DoubleWritable、FloatWritable
	 *  	ByteWritable、BooleanWritable、NullWritable、Text
	 *  	Text：使用utf8编码的文本类型
	 */
	public static class WordCount_Mapper extends Mapper<LongWritable, Text, Text, IntWritable>{
		@Override	//方法的重写
		protected void map(LongWritable key, Text value, Mapper<LongWritable, Text,
				Text, IntWritable>.Context context)
				throws IOException, InterruptedException {
			String[] line = value.toString().split(" ");	//将获取到的数据以空格进行切分成一个个单词
			for (String word : line) { 	//遍历单词的数组
				context.write(new Text(word), new IntWritable(1));  //单词进行计数，将中间结果写入context
			}
		}												
	}
```

​	
```java
/*
 * KEYIN：reduce阶段输入的key(单词)
 * VALUEIN：reduce阶段输入的value(单词的计数)
 * KEYOUT：reduce阶段输出的key(单词)
 * VALUEOUT：reduce阶段输出的value(单词计数的总和)
 * 
 * reduce方法中做以下修改：
 * 	将Text arg0改为Text key
 *  将Iterable<IntWritable> arg1改为Iterable<IntWritable> value
 *  将Context arg2修改为Context context
 */
public static class WordCount_Reducer extends Reducer<Text, IntWritable, Text, IntWritable>{
	@Override
	protected void reduce(Text key, Iterable<IntWritable> values,
			Reducer<Text, IntWritable, Text, IntWritable>.Context context)
					throws IOException, InterruptedException {
		int sum = 0;	//创建一个变量,和
		for (IntWritable intWritable : values) {		//遍历相同key单词的计数
			sum += intWritable.get();	//将相同key单词的计数进行累加
		}
		context.write(key, new IntWritable(sum));	//将计算的结果写入context
	}
}
 
//提交工作
public static void main(String[] args) throws Exception {
	
	String inPath= "hdfs://192.168.182.10:8020/input.txt";
	String outPath = "hdfs://192.168.182.10:8020/output/";
	Configuration conf = new Configuration();
	Job job = Job.getInstance();	//创建Job对象job
	FileSystem fs = FileSystem.get(conf);
	if (fs.exists(new Path(outPath))) {
		fs.delete(new Path(outPath), true);
	}
	job.setJarByClass(MyWordCount.class); 	//设置运行的主类MyWordCount
	job.setMapperClass(WordCount_Mapper.class); 	//设置Mapper的主类
	job.setReducerClass(WordCount_Reducer.class); 	//设置Reduce的主类
	job.setOutputKeyClass(Text.class); 	//设置输出key的类型
	job.setOutputValueClass(IntWritable.class); 	//设置输出value的类型
	//设置文件的输入路径(根据自己的IP和HDFS地址设置)
	FileInputFormat.addInputPath(job, new Path(inPath));	
	//设置计算结果的输出路径(根据自己的IP和HDFS地址设置)
	FileOutputFormat.setOutputPath(job, new Path(outPath));
	System.exit((job.waitForCompletion(true)?0:1)); 	//提交任务并等待任务完成
}
```
}

打包上传虚拟机：

步骤：

右键单击项目名 --> 选择 Export --> Java --> JAR file --> Browse...选择存放路径 --> 文件名

命名为wordcount.jar，将打包好的jar包上传到虚拟机中

运行代码：

在本地创建一个文件input.txt

vi input.txt
 添加内容：

```
hello world
hello hadoop
bye world
bye hadoop
```

上传到DHFS中：

```shell
hadoop fs -put input.txt /
```

使用jar命令执行项目：

```shell
hadoop jar wordcount.jar hadoop.mapreduce.MyWordCount
```

#### 计算考试平均成绩

代码演示：

##### Mapper类

```
package hadoop.mapreduce;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Counter;
import org.apache.hadoop.mapreduce.Mapper;

/*

 * 编写CourseScoreAverageMapper继承Mapper类
   */
    public class CourseScoreAverageMapper extends Mapper<LongWritable, Text, Text, IntWritable>{
   @Override	//方法的重写
   protected void map(LongWritable key, Text value, Mapper<LongWritable, Text,
   		Text, IntWritable>.Context context)
   		throws IOException, InterruptedException {
   	String line = new String(value.getBytes(),0,value.getLength(),"UTF8");	//转换中文编码
   	Counter countPrint =  context.getCounter("CourseScoreAverageMapper.Map 输出传递Value:", line);	//通过计数器输出变量值
   	countPrint.increment(1L);	//将计数器加一
   	StringTokenizer tokenArticle = new StringTokenizer(line,"\n");	//将输入的数据按行“\n”进行分割
   	while(tokenArticle.hasMoreElements()) {
   		StringTokenizer tokenLine = new StringTokenizer(tokenArticle.nextToken());	//每行按空格划分
   		String strName = tokenLine.nextToken();		//按空格划分出学生姓名
   		String strScore = tokenLine.nextToken();	//按空格划分出学生成绩
   		Text name = new Text(strName);	//转换为Text类型
   		int scoreInt = Integer.parseInt(strScore);	//转换为int类型
   		context.write(name, new IntWritable(scoreInt));		//将中间结果写入context
   		countPrint = context.getCounter("CourseScoreAverageMapper.Map中循环输出信息：", "<key,value>:<"+strName+","+strScore+">");	//输出信息
   		countPrint.increment(1L);	//将计数器加一
   	}
   }												

 }
```

##### Reducer类

```java
package hadoop.mapreduce;

import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Counter;
import org.apache.hadoop.mapreduce.Reducer;

/*
 * 编写CourseScoreAverageReducer继承Reduce类
 */
   public class CourseScoreAverageReducer extends Reducer<Text, IntWritable, Text, IntWritable>{
   @Override  //重写reduce方法
   protected void reduce(Text key, Iterable<IntWritable> values,
   		Reducer<Text, IntWritable, Text, IntWritable>.Context context)
   				throws IOException, InterruptedException {
   	int sum = 0;	//总分
   	int count = 0;	//科目数
   	for (IntWritable val : values) {		//遍历相同key的分数
   		sum += val.get();	//将相同key的分数进行累加
   		count++;	//计算科目数
   	}
   	int average = (int)sum/count;	//计算平均分
   	context.write(key, new IntWritable(average));	//将计算的结果写入context
   	Counter countPrint = context.getCounter("CourseScoreAverageReducer.Reducer中输出信息：", "<key,value>:<"+key.toString()+","+average+">");	//输出信息
   	countPrint.increment(1L);	//计数器加1
   }
}
```



##### Driver类

```java
package hadoop.mapreduce;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;
public class CourseScoreDriver {
public static void main(String[] args) throws Exception {
	Configuration conf = new Configuration();	//获取配置文件
	Job job = Job.getInstance(conf,"CourseScoreAverage");	//创建Job对象job
	String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();	//获取命令行参数
	if(otherArgs.length<2) {	
		System.err.print("Usage:hadoop jar MyAverage.jar <in> <out> ");
		System.err.print("hadoop jar MyAverage.jar hadoop.mapreduce.CourseScoreDriver <in> <out>");
		System.exit(2);
	}else {
		for (int i = 0; i < otherArgs.length-1; i++) {	//设置文件输入路径
			if(!("hadoop.mapreduce.CourseScoreDriver".equalsIgnoreCase(otherArgs[i]))) {  //排除hadoop.mapreduce.CourseScoreDriver这个参数
				FileInputFormat.addInputPath(job, new Path(otherArgs[i]));
				System.out.println("参数IN:"+otherArgs[i]);
			}
		}
		//设置文件输出路径
		FileOutputFormat.setOutputPath(job, new Path(otherArgs[otherArgs.length-1]));  //设置输出路径
		System.out.println("参数OUT："+otherArgs[otherArgs.length-1]);
	}
	FileSystem hdfs = FileSystem.get(conf);	//创建文件系统
	if(hdfs.exists(new Path(otherArgs[otherArgs.length-1]))) {	//如果已经存在该路径，则删除该路径
		hdfs.delete(new Path(otherArgs[otherArgs.length-1]), true);
	}
	job.setJarByClass(CourseScoreDriver.class); 	//设置运行的主类CourseScoreDriver
	job.setMapperClass(CourseScoreAverageMapper.class); 	//设置Mapper的主类
	job.setCombinerClass(CourseScoreAverageReducer.class); 	//设置Combiner的主类
	job.setReducerClass(CourseScoreAverageReducer.class); 	//设置Reduce的主类
	job.setOutputKeyClass(Text.class); 	//设置输出key的类型
	job.setOutputValueClass(IntWritable.class); 	//设置输出value的类型
	job.setInputFormatClass(TextInputFormat.class);		//设置输入格式
	job.setOutputFormatClass(TextOutputFormat.class);	//设置输出格式
	System.exit((job.waitForCompletion(true)?0:1)); 	//提交任务并等待任务完成
	System.out.println("Job Finished!");
	}
}
```
打包上传虚拟机：

步骤：

右键单击项目名 --> 选择 Export --> Java --> JAR file --> Browse...选择存放路径 --> 文件名

命名为average.jar ， 将打包好的average.jar上传到虚拟机中



运行代码：

首先准备三个文件 Chinese.txt、Math.txt、English.txt，添加如下内容：

![img](E:\Desktop\File\大三上\分布式计算\mapreduce\image\image4.png)

 将文件上传到HDFS的data目录下： 

```shell
hadoop fs -mkdir /data
hadoop fs -put Chinese.txt /data/
hadoop fs -put Math.txt /data/
hadoop fs -put English.txt /data/
```

执行代码：

```shell
hadoop jar average.jar hadoop.mapreduce.CourseScoreDriver /data /data/output
```

 查看结果，如下图：

![img](E:\Desktop\File\大三上\分布式计算\mapreduce\image\image5.png)

#### Semester——word count jar

import相应的jar包

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
```



##### Map

```java
public static class MyMapper extends Mapper<LongWritable,Text, Text, IntWritable>{
            @Override
            protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, IntWritable>.Context context) throws IOException, InterruptedException {
                String line = value.toString();
                String[] words = line.split(" ");
                for (String word : words) {
                    Text wordText =  new Text(word);
                    IntWritable one = new IntWritable(1);
                    context.write(wordText,one);
                }
            }
        }
```





##### Reduce

```java
public static class MyReducer extends Reducer<Text,IntWritable,Text,LongWritable> {
            @Override
            protected void reduce(Text key, Iterable<IntWritable> values, Reducer<Text, IntWritable, Text, LongWritable>.Context context) throws IOException, InterruptedException {
                Long count = 0L;
                for (IntWritable value : values) {
                    count += value.get();
                }
                LongWritable thecount = new LongWritable(count);
                context.write(key, thecount);
            }
        }
```





##### Maprduce

```java
public static void main(String[] args) throws IOException, InterruptedException, ClassNotFoundException {
            Configuration conf = new Configuration();
            Job job  =Job.getInstance(conf,"wordcount");
            job.setJarByClass(Main.class);
            FileInputFormat.setInputPaths(job,new Path(args[0]));
            job.setInputFormatClass(TextInputFormat.class);
            job.setMapperClass(MyMapper.class);
            job.setMapOutputKeyClass(Text.class);
            job.setMapOutputValueClass(IntWritable.class);
            job.setNumReduceTasks(2);
            job.setReducerClass(MyReducer.class);
            job.setOutputKeyClass(Text.class);
            job.setOutputValueClass(LongWritable.class);
            FileOutputFormat.setOutputPath(job,new Path(args[1]));
            boolean result = job.waitForCompletion(true);
            System.exit(result ? 0 : 1);
        }
```



当编辑好上述的代码之后，我们就可以使用maven创建我们的新的jar包。其会保存在`target`目录之下

```
target
    ├─classes
    │  └─org
    │      └─example
    ├─generated-sources
    │  └─annotations
    ├─generated-test-sources
    │  └─test-annotations
    ├─maven-archiver
    ├─maven-status
    │  └─maven-compiler-plugin
    │      ├─compile
    │      │  └─default-compile
    │      └─testCompile
    │          └─default-testCompile
    ├─test-classes
    └─wordcount-1.0-SNAPSHOT.jar
```



`target` 文件树如上所示。

将`jar`文件传入`master`中，在开启`yarn`和`hdfs`之后输入如下的指令：

```shell
 yarn jar <jar-filename> [mainclass] /path/to/input/file /path/to/
```

`yarn jar` 是 Hadoop YARN（Yet Another Resource Negotiator）中的一个命令，用于提交并运行一个打包成 JAR 文件的应用程序。YARN 是 Hadoop 的资源管理器，负责管理和调度集群中的计算资源，而 `yarn jar` 命令允许用户将编写的 YARN 应用程序打包成 jar文件，并在 YARN 管理的集群上执行 

指令结构由：

`yarn jar`——类似于`hdfs dfs`结构

`<jar-filename>`——`maven`所创建的`jar`文件的全名

`[mainclass]`——想要使用的类的具体的包名和类名——`package.class`

`/input/path`  && `/output/path`—— 等待处理文件的路径（也就是输入文件的路径），以及输出的路径



#### word count networking



##### Map

```java
	public static  class MyMapper extends Mapper<LongWritable, Text,Text, IntWritable> {
        @Override
        protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, IntWritable>.Context context) throws IOException, InterruptedException {
            String line = value.toString();
            String[] words = line.split(" ");
            for (String word : words) {
                Text wordText =  new Text(word);
                IntWritable one = new IntWritable(1);
                context.write(wordText,one);
            }
        }
    }
```



##### Reduce



```java
public static  class   MyReducer extends Reducer<Text, IntWritable,Text,LongWritable> {
        @Override
        protected void reduce(Text key, Iterable<IntWritable> values, Reducer<Text, IntWritable, Text, LongWritable>.Context context) throws IOException, InterruptedException {
            Long count = 0L;
            for (IntWritable value : values) {
                count+=value.get();
            }
            LongWritable theCount = new LongWritable(count);
            context.write(key,theCount);
        }
    }
```



##### Mapreduce

```java
public static void main(String[] args) throws IOException, InterruptedException, ClassNotFoundException {
        Configuration conf = new Configuration();
        conf.set("mapred.job.tracker", "192.168.100.1:9001");
        conf.set("fs.default.name", "hdfs://192.168.100.1:9000");
        Job job  =Job.getInstance(conf,"Main");
        job.setJarByClass(Main.class);
        // path  windows 还 hdfs
        FileInputFormat.setInputPaths(job,new Path("/user/FinalExam/words.txt"));
        job.setInputFormatClass(TextInputFormat.class);
        job.setMapperClass(MyMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        job.setNumReduceTasks(1);
        job.setReducerClass(MyReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(LongWritable.class);
        FileOutputFormat.setOutputPath(job,new Path("/user/mote_output"));
        boolean result = job.waitForCompletion(true);
        System.exit(result ? 0 : 1);
    }
```

