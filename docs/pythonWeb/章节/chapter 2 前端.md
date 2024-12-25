# 第二章

我们所学习的flask实现的主要是后端的功能，即承担服务器的作用。而web前端是与后端交互的界面。所以这一章主要包含**`HTML`**、**CSS**、**`JavaScript`**。

## 前端内容

### HTML

`HTML`，全称为`Hyper Text Markup Language`，超文本标记语言。用于描述网页的内容。	

HTML文档的结构分为**头部**与**主体**

**头部**内容（<head>标签对所包含的内容）**不会在页面中显示**，`head` 标签包含了文档的元数据，即直接显示但对于网页来说十分重要的信息（不包含语言属性）

会在页面中显示的只有**主体**内容（<body>标签对所包含的内容）。

一个典型的HTML文件通常具备如下的结构

```html
<!DOCTYPE html> <!--这行声明了文档类型和HTML版本-->
<html lang="zh"><!--开启了HTML文档，并设置了语言属性为中文（"zh"表示中文）-->
    <head>
        <meta charset="UTF-8"><!--制指定了页面的字符编码-->
        <title>模板包含演示</title>
    </head>

    <body>
        <!--网页所展示的内容-->
    </body>
</html>
```

值得注意的是，我们在编写属性的时候，通常是写在标签内的。

只有我们需要编写需要显示出来的内容时才会在标签外进行书写。

#### html的组成

##### 基础内容

```html
<tile> 网页的标题 </tile> <!--也就是网页的名称-->

<h1>一级标题</h1>
....
<h5>五级标题</h5>  <!--总共5个级别的标题-->

<p>表示一个段落</p>

<!--<br/>在html中意味着换行-->
<br/><!--/在后且可有可无，因为br是一个自闭合的标签-->
<p>另一个段落</p>
```

##### 图像

<img> 就是图像标签

如果我们需要创建一个能够显示图片的网页，我们首先需要创建一个新的文件夹 `static` 包含网页中静态的信息与数据。

在 `static` 中我们保留和存储静态资源文件。也就是不经常发生改变的文件。我们想要显示的图像文件也在其中。

我们需要在<body>中添加如下的代码。

```html
<img alt="图像显示失败" src = "static/img.png">
```

<img>与文本标签有所不同，图像标签需要添加`src`属性以**指向图像所在的位置**，由于此处图像名称为`img.png`，所以`src`的相对路径为`static/img.png`。

`alt`则表示在图像加载失败时，我们需要显示的内容。且因为<img>是自闭合标签，我们无需进行</img>

##### 链接

<a> 链接标签

`href` 属性来定义跳转的链接

```html
<a href="https://baidu.com">百度</a> <!--一个叫做百度的链接，用于跳转到百度的页面-->
```

##### 表格

表格的标签有点多，相较于其他标签而言更为复杂。但也十分简单

<tabel>表格标签    <tr>表格行标签  <td>表格列标签  <th>表格列标题标签  

```html
<!--  表格演示 -->
<table><!--定义一个列表-->
     <tr><!--列表第一行的名称-->
          
          <!--各列的名称-->
          
          <th>id</th><!--第一行当中的第一列的名称-->
          <th>用户名</th>
          <th>邮箱</th>
          <th>操作</th>
     </tr>
     <tr><!--再定义一行-->
          <td>1</td>
          <td>John</td>
          <td>john@gmail.com</td>
          <td>
               <a href="#"> 编辑</a>
               <a href="#"> 删除</a>
          </td>
     </tr>
     <tr>
          <td>3</td>
          <td>Carlos</td>
          <td>carlos@qq.com</td>
          <td>
               <a href="#"> 编辑</a>
               <a href="#"> 删除</a>
          </td>
     </tr>
</table>
```

总的来说，我们需要先定义一个表格标签。在这个表格中，我们按照行来一行行来定义表格的内容。而行的内容，又是由其中的一列列来定义的。需要注意的是，第一行定义的必须是列标题，也就是用<th>去定义。而其余行的列内容则用<td>



##### 表单

form 即为表单标签

是用于承载用户输入、提交输入数据到服务器、实现用户交互的基础内容。

所有的表单输入标签都需要为<form>标签对所包含，而常见的表单输入标签有<input>标签（基本输入，其中包含文本输入、密码输入、电话号码输入、邮箱输入、单选项、复选框等）、<textarea>（多行文本）标签、<select>（下拉列表）标签、<button>（按钮）标签。

```html
<!-- action 属性值为表单提交到的页面位置，留空则为当前页面 -->
<form action="" method="post">
     <h1> 用户信息表单</h1>
     
     <!-- 单行文本输入 -->
     <label for="input-username">用户名</label>
     <!--for 属性是 <label> 标签中的一个属性，它的作用是将标签与特定的表单控件关联起来。for 属性的值必须与对应表单控件（如 <input>、<textarea> 或 <select> 等）的 id 属性值相匹配-->
     <input type="text" name="username" id="input-username" required>
     <!-- input 是一个表单控件。type指定了输入控件的类型。在这里，"text" 表示这是一个文本输入框，用户可以在其中输入文本。>
     <name为输入控件指定了一个名称，这个名称在表单数据提交到服务器时用于识别这个字段。在服务器端，可以通过这个名字来获取用户输入的值。>
	 <require 是一个布尔属性，表示在提交表单之前，用户必须填写这个输入框。如果用户试图提交表单而没有填写这个输入框，浏览器会显示一个提示，并阻止表单提交。-->	
     <br/>
     
     <!-- 密码文本输入 -->
     <label for="input-password">密码</label>
     <input type="password" name="password" id="input-password" required>
     <br/>
     
     <!-- 数字输入 -->
     <label for="input-age">年龄</label>
     <input type="number" name="age" id="input-age" placeholder="请输入年龄
（选填）">
     <br/>
     
     <!-- 电话号码输入 -->
     <label for="input-phone">电话</label>
     <input type="tel" name="phone" id="input-phone" placeholder="请输入电
话号码（选填）">
     <br/>
     
     <!-- 电子邮箱输入 -->
     <label for="input-email">邮箱</label>
         <input type="email" name="email" id="input-email" placeholder="请输入
邮箱（选填）">
     <br/>
     
     <!-- 多行文本输入 -->
     <label for="input-introduce">自我介绍</label>
     <textarea name="introduce" id="input-introduce" placeholder="请输入自
我介绍（选填）"></textarea>
     <br/>
     
     <!-- 下拉列表 -->
     <label for="input-education">学历</label>
     <select id="input-education">
           <option value="0">保密</option>
           <option value="1">中专</option>
           <option value="2">高中</option>
           <option value="3">大专</option>
           <option value="4">本科及以上</option>
     </select>
     <br/>
     
     <!-- 单选项 -->
     <label for="input-sex">性别</label>
    
     <input type="radio" name="sex" id="input-sex-male">
     <label for="input-sex-male">男</label>
     
     <input type="radio" name="sex" id="input-sex-female">
     <label for="input-sex-female">女</label>
     <br/>
     
     <!-- 复选框 -->
     <label> 特长</label>
     <input type="checkbox" name="soft" id="input-skill-soft">
     <label for="input-skill-soft">软件开发</label>
     
     <input type="checkbox" name="server" id="input-skill-server">
     <label for="input-skill-server">系统运维</label>
     
     <input type="checkbox" name="safe" id="input-skill-safe">
     <label for="input-skill-safe">网络安全</label>
     <br/>
    
     <!--定义一个按钮-->
     <button type="submit">保存</button>
     <button type="reset">重置</button>
</form>
```





CSS和Javascripts不做重点。

### `CSS`

在之前的各种演示例子中，存在控件的位置看起来不美观、颜色不好看等问题，这些问题便是“样式”问题。**层叠样式表**(**Cascading Style Sheets**，`CSS`)便是这些问题的解决方案。

`CSS`可以修改页面的排版，控件的**颜色**、**边框**、**间距**等一系列属性，`CSS`通常有以下3种使用方式。

1. 在网页头部使用<style>标签定义样式。
2. 在网页头部使用<link>标签，从其他位置引入`CSS`样式文件。
3. 在标签中添加“style”属性，编写`CSS`语句。以下是一个`CSS`综合应用简单实例。

我们需要现在static文件夹之下，存储一个`CSS`文件。在使用时仅需在head中添加一段这样的信息。

```html
    <style>
        /* 使用 id 获取控件，并应用样式 */
        #p-test {
            background-color: #5bc0de;
            float: top;
        }

        /* 获取 body标签 下所有控件，并应用样式 */
        body * {
            border: 1px solid black;
            margin: 0;
            padding: 0;
        }
    </style>
    <link href="static/test.css" rel="stylesheet">


    <p id="p-test">这是一个段落。这是一个段落。这是一个段落。这是一个段落。这是一个段落。这是一个段落。这是一个段落。</p>
    <!-- 从"style"属性中应用样式 -->
    <p style="float: left;">这是一个段落。这是一个段落。这是一个段落。<br/>这是一个段落。这是一个段落。这是一个段落。<br/>这是一个段落。</p>
    <img alt="这是一张图片" src="static/img.png" style="float: right">
    <div style="position: relative; top: 128px; float: left">
        <!-- class属性用于对控件进行分类，以便于使用CSS、JavaScript进行获取 -->
        <h1 class="h-test">这是一级标题文本</h1>
        <h2 class="h-test">这是二级标题文本</h2>
        <h3 class="h-test">这是三级标题文本</h3>
        <h4 class="h-test">这是四级标题文本</h4>
        <h5 class="h-test">这是五级标题文本</h5>
    </div>
```



### JavaScripts

HTML控件的应用实现了对网页的基本描述，`CSS`的应用实现了对网页控件的布局、上色等，而JavaScript则可以实现网页控件在浏览器端与用户的交互。

HTML表单在没有JavaScript相关代码的情况下，只能与服务器进行交互；在有了JavaScript相关代码后，很多用户操作都可以不经过服务器，直接根据事先设计好的前端逻辑，由浏览器实现与用户的交互。

JavaScript通常用于对用户输入进行本地校验，对不符合规则的输入进行提示；JavaScript还可用于实现控件之间的交互、播放控件动画、加载表单数据、异步加载页面等，其功能十分强大。



```html
<!--
此处通过使用 form标签 的 "onsubmit" 事件属性，实现事件与函数的绑定。
当表单提交事件触发时，将执行函数进行验证，如果返回true则正常提交表单，如果返回false则取消表单提交。
用<script>来添加Javascripts
-->
<script> 
    function form_submit() {
        let input_username = document.getElementById('input-username');
        let input_password = document.getElementById('input-password');

        if (input_username.value.length < 5) {
            alert('用户名长度不能小于5');
            return false;
        }
        if (input_password.value.length < 8) {
            alert('密码长度不能小于8');
            return false;
        }

        return true;
    }
</script>
```

也可以用外部文件加载





## Bootstrap

bootstrap是一种前端框架。其基于HTML、`CSS`、`JavaScripts`开发。

在Bootstrap4 网络系统中，Bootstrap 提供了一套响应式、移动设备优先的流式网格系统，随着屏幕或视口(viewport)尺寸的增加，系统会自动分为最多 12 列。也就是把表格分成12个单元，由开发者自己决定一列需要几个单元。由单元数决定最后的列数。把列分成12个单元，而选择的数字实际是多少个单元组成一列，即12/n。也可以传入多个参数，不进行等分单元列。



- .col-针对所有设备器
- .col-sm-平板-屏幕宽度等于或大于 576px
- .col-md-桌面显示器-屏幕宽度等于或大于 768px
- .col-lg- 大桌面显示器 - 屏幕宽度等于或大于 992px
- .col-xl- 超大桌面显示器 - 屏幕宽度等于或大于 1200px

