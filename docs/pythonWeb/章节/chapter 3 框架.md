# 第三章

## 模板

通常，我们把网页当中不常变动的内容称作**静态资源**，如HTML网页，CSS样式文件，图像或音频文件。

相对的，在网页中存在很多变动的内容，这些内容通常由程序生成。这便是**动态网页**。我们以文章页面为例，文章的内容以相同的布局动态生成于网页页面，归功于它们都是基于同样的结构，我们把这个网页结构称作模板。



### jinja2

模板的作用是内容注入，页面继承和包含，`jinja2`模板引擎实现了一套完善的解决方案。使用模板时，所有静态资源应放在 `static` 目录之下，模板资源放置在 `templates` 目录之下。

模板资源中可能包含一个`html` 文件。

当我们在`app.py`中使用：

```python
from flask import Flask, render_template
@app.route('/value')
def value(username=None)
	return render_template('value.html')
```

可以很轻松地根据 `templates`目录下的模板文件渲染出来生成一个页面。

#### 基本语法

在jinja2中有三类基本语法

```html
{%...%}  # 控制语句，用于实现结构控制，定义模板，变量
{{...}}  # 表达式语句，用于输出变量，调用宏指令，对象函数
{#...#}  # 注释语句
```

关于注释，值得注意的一点：`{#...#}`作为模板的注释语句，与HTML自带的`<!-- -->`产生了某些冲突，使用 HTML 注释 `<!-- -->` 来注释 `Jinja2` 模板语句，那么这些语句仍然会被 `Jinja2` 解析和执行，但注释本身会在最终的 HTML 输出中显示，这可能会导致安全问题或不必要的信息泄露。

#### 注入变量

实现动态网页，要根据不同的情况生成不同的内容，这个过程我们称之为**注入变量**

注入变量分作两步：

1. 在视图函数中注入变量，此处的变量为`username`。其默认值为`None`，但也受到路由`/value/<string:username>` 影响改变变量值。

   ```python
   @app.route('/value')
   @app.route('/value/<string:username>')
   def value(username=None):
       return render_template('value.html', username=username)
   # 当访问value这个路由时，username 参数将为 None，因为没有提供任何额外的路径参数。
   # 在这个函数中，username 是一个可选参数，其默认值为 None。当 Flask 接收到一个匹配上述任一路由的请求时，它会调用 value 函数，并根据 URL 中是否存在额外的路径参数来决定是否传递一个值给 username。
   ```

2. 将变量显示到页面中，我们需要在模板文件中使用**控制语句 {%...%}** 实现结构控制， **表达式语句（ {{...}} ） **输出变量。

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Value Page</title>
   </head>
   <body>
       {% if username %}
           <p>Hello, {{ username }}!</p>
       {% else %}
           <p>Hello, guest!</p>
       {% endif %}
   </body>
   </html>
   ```

#### 生成链接

使用`url_for()`来生成链接

基于flask所构建的网站中，我们每一个视图函数对应一种功能。如何把多个页面联系在一起，需要我们使用**链接标签**<a>。

在通常情况下，链接标签中所**对应的链接**可以在模板中使用函数`url_for()`生成。

要注意**静态文件链接**和**路由链接**之间的区别

```html
<!-- 生成静态文件链接 注意此处的文件链接采用link而不是a-->
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap.min.css') }}">
<!-- 生成路由链接 -->
    <a href="{{ url_for('value') }}">
        注入变量演示
    </a>
<!-- 生成路由链接（带参数） -->
    <a href="{{ url_for('value', username='admin') }}">
        注入变量演示（username=admin）
    </a>
```



#### 控制结构

在app.py中写入控制结构。实现在视图页面中不同的渲染结果。

```python
@app.route('/control')
@app.route('/control/<int:num>')
def control(num=0):
    # 此处使用 list 模拟文章列表。
    articles = []
    for i in range(1, num + 1):
        articles.append({
            'title': '文章%d标题' % i,
            'content': ('文章%d的内容 ' % i) * i,
        })
    return render_template('control.html', num=num, articles=articles)
```

jinja2中的控制结构：`{%...%}`

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>控制结构</title>
</head>
<body>
<h1>文章列表</h1>
{% if num <= 0 %}
    <h2>文章数量为0，没有内容可展示。</h2>
{% else %}
    {% for article in articles %}
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
    {% endfor %}
{% endif %}
</body>
</html>
```



#### 模板的包含与继承

模板继承和包含是两个强大的功能，它们可以帮助你构建可重用和结构化的模板。

- 模板继承允许你创建一个基础模板，然后让其他模板继承这个基础模板。这在创建具有一致布局的网页时非常有用，比如一个网站的头部、尾部和导航栏。
- 模板包含允许你将重复的模板代码片段放入单独的文件中，然后在其他模板中包含这些片段。这类似于其他编程语言中的函数或方法。



```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>模板包含演示</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap.min.css') }}">
</head>
<body>
{% include 'include_nav.html' %}

<script src="{{ url_for('static', filename='jquery.min.js') }}"></script>
<script src="{{ url_for('static', filename='bootstrap.min.js') }}"></script>
</body>
</html>
```

上述是一个失败的例子

与下面的代码形成对比。

```html
<nav class="navbar navbar-inverse navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                    aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">包含导航栏演示</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="https://ai.m.taobao.com/home-atb?tkSid=1732523173535_556978544_0.0&ali_trackid=2:mm_26632323_6762370_107181600323:1732523173535_556978544_0&clk1=d59da02e7f6cae0eca7cf4e100d0a39b&union_lens=lensId:OPT@1710136889@0b87bd25_0d45_18e2c1a0fce_934a@01@eyJmbG9vcklkIjozODk1N30ie;recoveryid:556978544_0@1732523173541&pageId=20150318020018244&rootPageId=20150318020018244&bxsign=tbka-uB8X9dyjadiZyqPnZ5hNc3nqDq-KpWO2-HvLVyufiaHrjPG2yMfLhpZcT2_oJ4zWmfEPMzGuyc2zrViV_uz_-J5qW0frXT5SefZBMPdit4CRnLA8LjGulDxF141j9W6vHYVRomNrQqv048vimMalclB0evvnRxp6QVTbOjgQ9KMlss-fmXuLGyp947xYEG">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
    </div>
</nav>
```

##### 继承

继承的重点是`extends`与`block`

采用`extends` 使用的是模板语言中的**结构语句** `{%extends '...'%}`相较于`block`，我们需要打上引号。

采用`block` 使用的是模板语言中的**结构语句** `{%block ...%}`相较于包含`include`与`extends`，我们无需打上引号。

- 定义**父模板**，在父模板中定义block

  ```html
  <!DOCTYPE html>
  <html lang="zh">
  <head>
      <meta charset="UTF-8">
      <title>
          {% block title %}
              {# 网页标题 #}
          {% endblock %}
      </title>
  
      {% block head %}
          {# 网页所引用的样式等静态资源 #}
      {% endblock %}
  </head>
  <body>
  {% block content %}
      {# 网页内容 #}
  {% endblock %}
  
  {% block script %}
      {# 网页所引用的js资源 #}
  {% endblock %}
  </body>
  </html>
  ```

  `{%block%}`用于定义可被继承的页面修改块。

- 定义**子模板**，继承父模板，根据需要实现父模板中的block

  ```html
  {% extends 'extends_base.html' %}
  
  {% block head %}
      <link rel="stylesheet" href="{{ url_for('static', filename='bootstrap.min.css') }}">
  {% endblock %}
  
  {% block script %}
      <script src="{{ url_for('static', filename='jquery.min.js') }}"></script>
      <script src="{{ url_for('static', filename='bootstrap.min.js') }}"></script>
  {% endblock %}
  
  {% block content %}
      {% include 'include_nav.html' %}
  
      <div class="container">
          {% block inner_content %}
              {# 模板页面的正文内容 #}
          {% endblock %}
      </div>
  {% endblock %}
  ```

  需要注意的是：**extends必须写在第一行**表明继承的父模板，如果子模板也可以再定义block，为它的子模板提供内容，即为孙子模板提供内容。

  子模板只能加载block内容，写在block之外的html不识别。

  以下是一个孙子模板，在继承了以上两个模板之后所创建的页面。

  ```html
  {% extends 'extends_bootstrap.html' %}
  
  {% block title %}模板的继承、包含{% endblock %}
  
  {% block inner_content %}
      <h1>模板的继承</h1>
      <p>可以使复杂的结构变简单。以免在多个页面中引用静态资源。</p>
  
      <h1>模板的包含</h1>
      <p>可以使复杂的部分单独抽离到某一个文件。</p>
  {% endblock %}
  
  {% block script %}
      {# 继承模板内容并添加新内容 #}
      {{ super() }}
      <script>
          // 以下代码用于添加文字动画。
          let items = $('h1,p');
          items.hide();
          items.fadeIn(1000);
      </script>
  {% endblock %}
  ```

  

##### 包含

如果网页中的一部分内容需要引用其他网页，可以使用包含加载过来。如果被加载的网页中有需要变量是加载不过来的，需要前端重新渲染



注意**包含**所采用的是模板语句是**结构语句** `{% include '...'%}`

```html
{%include 'test.html'%}
```



小结：

`extends` `block` `include`三者采用的都是**结构语言**，其中除了`block`以外其他二者携带的参数都需要`''`



#### 宏指令

**模板的包含、继承**也仅是从已经编写好的模板中加载相应的内容，并**将模板内容覆盖到当前页面下**。在常见的应用中，会有包含相同的文章项目的页面，例如网站首页中与文章列表页面中包含相同的文章项目。此时，文章项目的显示代码便需要在两个页面中同时编写，这种方式操作起来较为烦琐，消耗的资源也较多。

在上述例子中，文章项目属于**公共部分**，但在需要生成多个文章项目的情况下，使用包含与继承便不再合适，宏指令便是此问题的解决方案。

宏指令其实并不复杂，它类似于Python中的函数，拥有参数，可以被调用用于生成网页内容。

要注意的是我们在**调用**和**定义**宏指令语句的时候所采用的模板语句是不同的

- 在**调用宏指令**的时候我们采用的是**表达式语句** `{{...}}`
- 在**定义宏指令**的时候我们采用的是控制语句 `{%...%}`

视图函数代码

```python
@app.route('/macro')
@app.route('/macro/<int:num>')
def macro(num=0):
    # 此处使用 list 模拟文章列表。
    articles = []
    for i in range(1, num + 1):
        articles.append({
            'title': '文章%d标题' % i,
            'content': ('文章%d的内容 ' % i) * i,
        })
    return render_template('macro.html', num=num, num_prev=num - 1, num_next=num + 1, articles=articles)
```

模板文件 `macro.html`

```html
{# 此处的模板文件继承于上一章所定义的模板 #}
{% extends 'extends_bootstrap.html' %}

{# 宏指令可以定义在单独的文件，然后被其它文件所引入。 #}
{% import 'macro_define.html' as macro %}

{% block title %}
    宏指令
{% endblock %}

{% block inner_content %}
    {# 宏指令使用方法类似于函数。 调用了macro_define的函数#}
	{# 调用宏指令，是表达式语句 #}
    {{ macro.article_list(articles, num) }}

    {% if num > 0 %}
        <a href="{{ url_for('macro', num=num_prev) }}" class="btn btn-primary">-1</a>
    {% endif %}
    <a href="{{ url_for('macro', num=num_next) }}" class="btn btn-primary">+1</a>
{% endblock %}
```



宏指令模板文件 `macro_define.html`

```html
{% macro article_item(title, content) %}
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
{% endmacro %}

{ #定义了一个宏指令# }
{ #定义一个宏指令用的则是结构语句# }
{% macro article_list(articles, article_num) %}
    {% if article_num <= 0 %}
        <h2>文章数量为0，没有内容可展示。</h2>
    {% else %}
        {% for article in articles %}
            {{ article_item(article.title, article.content) }}
        {% endfor %}
    {% endif %}
{% endmacro %}
```



#### 全局对象

在某些特殊的模板中，可以通过调用函数的方式直接获取数据。但在被继承的模板中，如果需要调用某个固定的函数，通常需要在每一个使用被继承模板的视图函数中注入相应的函数(变量)，但这显然不是推荐的操作方法。这时，需要注册全局对象。

```python
# 注册全局对象的类型不限，可以是任何类型（函数亦可）。
def range_list(x):
    # 该函数生成了数量为 x 的 int list，（从 0 开始）
    return list(range(x))
# 将函数注册到全局对象中  注册名为global_test
app.add_template_global(range_list, 'global_test')
```

```html
{% extends 'extends_bootstrap.html' %}
{% block title %}注册全局对象{% endblock %}

{% block inner_content %}
{# 此处将数字列表输出到页面中 调用全局对象#}
{{ global_test(10) }}
{% endblock %}
```



#### 变量过滤器

变量过滤器用于对注入变量进行简单处理。在板页面注入变量时，只需要在变量后面添加“”即可调用过滤器方法。

```html
{# 字符串的首字母大写，其他小写 #}
<p>{{ 'test' | capitalize }}</p>

{# 字符串格式化 #}
<p>{{ '你好 %s，这里是 %s。' | format(request.remote_addr, request.path) }}</p>

{# 字符串转小写 #}
<p>{{ 'TESTTEST' | lower }}</p>
```

<u>可以用注册全局对象的方法构建自己的过滤器</u>。



全局对象和变量过滤器类似于 python中的函数。而对于python本身自带的部分函数，模板对于其**具备严格的限制**。仅有部分认为安全的内置python函数可以直接使用。对于其他的函数可以通过编写自定义的**模板过滤器**或**全局函数**，并在 Flask 应用中启用它们。





### Flask-Bootstrap

Bootstrap 是一个独立的、开源的 CSS 和 JavaScript 框架，用于开发跨浏览器兼容的网页。它提供了一套响应式的网格系统、预制的组件（如按钮、导航栏、模态框等）和 JavaScript 插件。

Flask-Bootstrap 是一个 Flask 扩展，它简化了在 Flask 项目中集成 Bootstrap 的过程。Flask-Bootstrap 提供了一系列的模板，包含对于资源的引用，和一些快捷的宏指令。其通过提供 Jinja2 模板标签来加载 Bootstrap 的 CSS 和 JavaScript 文件，使得开发者可以轻松地在 Flask 模板中使用 Bootstrap。还提供了一些额外的功能，比如自动添加 Bootstrap 类到表单元素，以及提供一些 Bootstrap 组件的宏（macros）。

**与Bootstrap的关系**

- **集成**：Flask-Bootstrap 使得在 Flask 应用中集成 Bootstrap 变得更加简单。你不需要手动下载 Bootstrap 文件或修改 HTML 来引入 Bootstrap，Flask-Bootstrap 会帮你处理这些。
- **自动化**：Flask-Bootstrap 自动为你的应用添加 Bootstrap 的样式和脚本，你只需要在你的 Flask 应用中安装并配置 Flask-Bootstrap。
- **定制化**：虽然 Flask-Bootstrap 提供了方便的集成方式，但你仍然可以自定义 Bootstrap 的配置，比如选择不同的主题或版本。
- **共存**：你可以同时使用 Flask-Bootstrap 和 Bootstrap，Flask-Bootstrap 作为 Flask 应用和 Bootstrap 之间的桥梁，而 Bootstrap 提供样式和组件。

初始化bootstrap

```python
from flask_bootstrap import Bootstrap

# flask_bootstrap 初始化代码
bootstrap = Bootstrap()
bootstrap.init_app(app)
# 使用本地资源，禁用cdn
bootstrap_cdns = app.extensions['bootstrap']['cdns']
bootstrap_cdns['bootstrap'] = bootstrap_cdns['local']
bootstrap_cdns['jquery'] = bootstrap_cdns['local']
```

初始化之后我们就可以直接使用

```python
@app.route('/bootstrap')
def bootstrap_flask():
    return render_template('bootstrap_flask.html')
```

bootstrap_flask.html文件的内容，即初始化的内容：

```html
{# 模板目录下的bootstrap目录复制自 Python安装目录/site-packages/flask_bootstrap/templates #}
{% extends 'bootstrap/base.html' %}

{% block title %}Flask Bootstrap{% endblock %}

{% block navbar %}
    {% include 'include_nav.html' %}
{% endblock %}

{% block content %}
    <div class="container">
        <p>flask_bootstrap提供了一些基本的模板，可以省去从零编写模板页的过程。</p>
        <p>同时还提供了 flask_wtf 表单生成的宏指令。（后续讲解）</p>
    </div>
{% endblock %}
```

