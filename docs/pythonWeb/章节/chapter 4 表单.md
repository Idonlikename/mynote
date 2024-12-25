# 第四章

之前我们在第二章中提及了表单，用于与用户之间的交互。具体来说负责接受用户输入的信息，并将信息返回给服务器处理之后再返回给用户，即反应到浏览器上。

一次完整的交互，需要后端程序的参与。这是我们在第二章所没有展示的，所以在此我们进行补充。

## 基本交互

### GET

GET 请求用于**从服务器获取数据**。它通常用于请求获取页面、图像、文档等静态资源，或者从服务器获取特定数据。

- 数据通过 URL 查询字符串传递，附加在 URL 后面，以问号（?）分隔。例如：http://example.com/page?param1=value1&param2=value2
- 安全性：GET 请求在 URL 中明文传递数据，因此不适合传递敏感信息，因为信息可以在浏览器历史记录、服务器日志等地方可见。
- 缓存：GET 请求可以被浏览器缓存，因此可以加快页面加载速度。
- 幂等性：多次发送相同的 GET 请求不会对服务器产生副作用，即多次请求不会改变服务器状态。

```python
# 不难注意到的是，在路由中我们定义了方法method GET与POST
@app.route('/form', methods=['GET', 'POST'])
def form():
    # args用于获取GET方式提交的数据
    msg_get = request.args.get('msg_get')
```



### POST

POST 请求**用于向服务器提交数据**，通常用于提交表单、发送用户输入数据等。

- 数据传递： 数据通过 HTTP 请求的消息体传递，不会显示在 URL 中。因此，POST 请求适合传递敏感信息。

- 安全性： POST 请求对数据进行加密，相对更安全，适合传递敏感信息。
- 缓存： POST 请求不会被浏览器缓存。
- 幂等性： 一般情况下，多次发送相同的 POST 请求可能会对服务器产生副作用，即多次请求可能会改变服务器状态。但在某些情况下，可以通过设计来使 POST 请求具有幂等性。

```python
@app.route('/form', methods=['GET', 'POST'])
def form():
    # form用于获取POST方式提交的数据
    msg_post = request.form.get('msg_post')
    return render_template('form.html', msg_get=msg_get, msg_post=msg_post)
```



在完成视图函数的编辑之后我们还需要在html中继续编辑

```html
{% extends 'base.html' %}

{% block content %}
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <form method="get" class="form-horizontal" role="form">
                    <p>Get 表单测试</p>
                    <label>
                        消息：
                        <input name="msg_get" value="Get!" class="form-control"/>
                    </label>
                    <input type="submit" class="btn btn-primary">
                </form>
            </div>
            <div class="col-md-6">
                <form method="post" class="form-horizontal" role="form">
                    <p>Post 表单测试</p>
                    <label>
                        消息：
                        <input name="msg_post" value="Post!" class="form-control"/>
                    </label>
                    <input type="submit" class="btn btn-primary">
                </form>
            </div>
        </div>
        <div class="row">
            {% if msg_get %}
                <p>你发送的Get消息：{{ msg_get }}</p>
            {% endif %}
            {% if msg_post %}
                <p>你发送的Post消息：{{ msg_post }}</p>
            {% endif %}
        </div>
    </div>
{% endblock %}
```



### 文件上传

表单不单单可以提交消息，还可以**上传文件**。我们需要定义两个视图函数，一个用于上传文件，一个获取上传的文件。

首先我们展示**获取上传文件**的视图函数

```python
# 用于获取上传的文件
@app.route('/files/<filename>')
def uploaded_files(filename):
    path = app.config['UPLOADED_PATH']
    return send_from_directory(path, filename)
```

再展示**上传文件**的视图函数

```python
# 用于上传文件
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files.get('upload')
        f.save(os.path.join(app.config['UPLOADED_PATH'], f.filename))
    # 将上传目录下的文件展示到页面中
    files = os.listdir(app.config['UPLOADED_PATH'])
    return render_template('upload.html', files=files)
```

模板页面

```html
{% extends 'base.html' %}

{% block title %}文件上传{% endblock %}

{% block content %}
    <div class="container">
        <form role="form" method="post" enctype="multipart/form-data">
            <p>文件上传</p>
            <label>
                文件：
                <input type="file" name="upload" class="form-control">
            </label>
            <input type="submit" class="btn btn-primary">
        </form>

        <ul>
            {% for file in files %}
                <li><a href="{{ url_for('uploaded_files', filename=file) }}">{{ file }}</a></li>
            {% endfor %}
        </ul>
    </div>
{% endblock %}
```





## Flask-WTF

Flask-WTF 是一个用于集成 WTForms 表单库到 Flask 应用中的**扩展**。WTForms 是一个用于创建和处理 Web 表单的库，它提供了一种简单而强大的方式来**定义**、**验证**和**呈现表单**。

**WTForms带有数据验证的功能**，便于服务器端对于数据进行验证

同时还带跨请求伪造（Cross-Site Request Forgery, CSRF）保护功能，因此我们在使用WTF生成表单时需要定义csrf_token 也就是密钥。

在使用Flask-WTF表单之前，我们需要优先定义表单类。所有表单类都需要继承“FlaskForm”表单类，这是Flask-WTF对WTForms表单的封装。表单类用于描述表单的结构，表单字段使用类变量进行描述。

```python
class LoginForm(FlaskForm):
    username = StringField(label='用户名', validators=[DataRequired()])
    password = PasswordField(label='密码', validators=[DataRequired()])
    submit = SubmitField(label='登录')
```

在表单类设计完成之后，我们就可以直接在视图函数中使用表单类。

应用表单类的视图函数

```python
app = Flask(__name__)
# 使用表单前须定义csrf_token密钥（任意字符串）。
app.config['SECRET_KEY'] = 'Chapter4'

from flask_bootstrap import Bootstrap

bootstrap = Bootstrap()
bootstrap.init_app(app)
bootstrap_cdns = app.extensions['bootstrap']['cdns']
bootstrap_cdns['bootstrap'] = bootstrap_cdns['local']
bootstrap_cdns['jquery'] = bootstrap_cdns['local']
@app.route('/login', methods=['GET', 'POST'])
@app.route('/login/<int:mode>', methods=['GET', 'POST'])
def login(mode=1):
    form = LoginForm()
    if request.method == 'POST' and form.validate_on_submit():
        return 'Hello %s!<br>你所输入的密码为：%s' % (form.username.data, form.password.data)
    else:
        return render_template('login.html', form=form, mode=mode)
```

模板页面代码

```html
{% extends 'base.html' %}

{# 引入flask_bootstrap提供的 wtf表单宏指令 #}
{% import 'bootstrap/wtf.html' as wtf %}

{% block title %}登录表单{% endblock %}

{% block content %}
    <div class="container">
        {% if mode == 1 %}
            <form role="form" method="post">
                {{ form.username }}
                {{ form.password }}
                {# csrf_token用于保证用户提交表单安全性 #}
                {{ form.csrf_token }}
                {{ form.submit }}
            </form>
        {% elif mode == 2 %}
            <form role="form" method="post">
                {# 使用flask_bootstrap提供的宏指令，逐个字段生成表单 #}
                {{ wtf.form_field(form.username) }}
                {{ wtf.form_field(form.password) }}
                {# csrf_token是隐藏字段，使用默认方法生成即可 #}
                {{ form.csrf_token }}
                {{ wtf.form_field(form.submit) }}
            </form>
        {% elif mode == 3 %}
            {# 使用flask_bootstrap提供的宏指令，快速生成表单 #}
            {{ wtf.quick_form(form) }}
        {% endif %}
    </div>
{% endblock %}
```

### 渲染表单

渲染表单指的是，根据表单类所描述的结构来生成相应的HTML代码的过程。有三种渲染方式，由`mode`参数而定。

具体如下：

- 其中“mode == 1”处的表单为原始样式，且每一个表单字段都需要单独渲染常用于建立复杂表单。
- 而“mode == 2”处的表单与“mode == 1”处的表单渲染方式一致，不同之处在于“mode==2”处的表单使用了Flask-Bootstrap所提供的表单字段生成宏指令来进行生成，显示时包含Bootstrap样式。
- “mode == 3”处的表单则通过Flask-Bootstrap所提供的快速渲染表单的宏指令进行整个表单的渲染。这种方法常用于建立结构简单的表单，

### 处理表单

在前面的例子中，表单字段都比较少，如果要对数据进行验证，例如限制用户名或密码不为空，只需要直接通过if语句进行判断即可(不推荐)。而在表单字段相当多的情况下，这种方法便不再适用了。

WTForms包含数据验证功能。通常情况下，WTForms所提供的数据验证器可以满足大部分的需求。要使用数据验证器只需要在表单类的字段中添加validators参数，并指定相应的数据验证器即可(该参数为list类型，可添加多种类型的数据验证器)

常见的数据验证器类型

| 数据验证器类型 | 说明                                     |
| -------------- | ---------------------------------------- |
| Email          | 验证是否为电子邮箱                       |
| EqualTo        | 比较两个字段的值，常用于二次输入密码确认 |
| IPAddress      | 验证是否为IPv4网络地址                   |
| Length         | 验证字符串输入数据的长度                 |
| NumberRange    | 验证输人的数值是否在数字范围内           |
| Optional       | 选填，数据为空时跳过其他验证函数         |
| DataRequired   | 必填，确保输入数据不为空                 |
| Regexp         | 使用正则表达式验证输入数据               |

#### 调用方式

在定义类时，我们在validator中添加数据验证器即可。

```python
class RegisterForm(FlaskForm):
    email = StringField(label='邮箱', validators=[DataRequired(), Email()])
```

## 消息反馈

### 闪现消息

所有消息都是直接通过文本内容返回到浏览器中进行展示的。而在实际项目中，<u>消息通常会在页面中的**一小部分区域**展示如弹框</u>等。**闪现消息**便是Flask对这种消息反馈功能的实现。

在视图函数页面增添一个`flash()`函数，分为两个参数，前一个参数用于发送的内容，而后一个参数是消息的状态。

总共有四种状态：

- success
- danger
- info
- warning

```python
flash("这是一条测试消息","success")
flash('这是一条测试消息', 'danger')
flash('这是一条测试消息', 'info')
flash('这是一条测试消息', 'warning')
```

即可闪现消息。

闪现消息的可制定性高。

模板页面设计

```html
{% extends 'base.html' %}

{% import 'bootstrap/utils.html' as utils %}

{% block title %}flash消息{% endblock %}

{% block content %}
    {% if mode != 1 %}
        {% for category, message in get_flashed_messages(with_categories=true) %}
            <h5>[{{ category }}] - {{ message }}</h5>
        {% endfor %}
    {% else %}
        {{ utils.flashed_messages() }}
    {% endif %}
{% endblock %}
```

### 自定义错误页

就是针对不同的错误状态码，进行跟网页风格相似的设计。

```python
# app.errorhandler装饰器用于绑定错误页面的视图函数，与路由函数相似。
@app.errorhandler(404)
def not_found_page(e):
    return render_template('custom_error.html', title='Emmmm, 404!', description='搞错url了吧：%s' % request.path), 404


@app.route('/error_404')
def error_404():
    abort(404)
```

模板页面设计

```html
{% extends 'base.html' %}

{% block title %}自定义错误页{% endblock %}

{% block content %}
    <div class="container">
        <h1>{{ title }}</h1>
        <pre>{{ description }}</pre>
    </div>
{% endblock %}
```



## Flask-CKEditor

CKEditor是一个富文本编辑器，支持编辑图文内容、文件上传，简单易用是一个相当实用的控件。Flask-CKEditor针对Flask对CKEditor进行了适配，**使其支持Flask-WTF**，也可以通过“wtf”快速生成表单。

初始化代码

```python
from flask_ckeditor import CKEditor
# 使用本地资源文件
app.config['CKEDITOR_SERVE_LOCAL'] = True
# 指定文件上传所使用的视图函数
app.config['CKEDITOR_FILE_UPLOADER'] = 'upload_ckeditor'
ckeditor = CKEditor()
# 初始化 Flask-CKEditor
ckeditor.init_app(app)
```

表单类的实现代码，也就是先用CKEditor定义表单类

```python
from flask_ckeditor import CKEditorField
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
class ArticleForm(FlaskForm):
    title = StringField(label='标题', validators=[DataRequired()])
    content = CKEditorField(label='内容', validators=[DataRequired()])
    submit = SubmitField(label='查看')
```

视图函数的实现代码，再在视图函数中调用之前定义好的表单类

```python
@app.route('/ckeditor_article', methods=['GET', 'POST'])
def ckeditor_article():
    form = ArticleForm()

    if request.method == 'POST' and form.validate_on_submit():
        return render_template('ckeditor_view.html', form=form)
    else:
        return render_template('ckeditor_edit.html', form=form)
```

文章编辑模板

```python
{% extends 'base.html' %}

{% import 'bootstrap/wtf.html' as wtf %}

{% block title %}CKEditor 基本使用{% endblock %}

{% block content %}
    <div class="container">
        {{ wtf.quick_form(form) }}
    </div>
    {# 加载 CKEditor 资源 #}
    {{ ckeditor.load() }}
    {# 配置 CKEditor 控件，此处 name 与表单类字段的 content对应。 #}
    {{ ckeditor.config(name='content', height=320) }}
{% endblock %}
```

同样是快速渲染表单，WTF和CKEditor的不同点在于CKEditor需要使用`ckeditor.load()`方法以及`ckeditor.config()`方法进行加载。

`load`负责加载资源，而`config`用于配置控件



### 资源上传

在常见的使用场景中，编辑内容的过程中还需要插入图像，但前面的例子中，富文本编辑器仅支持添加在线图像，使用起来并不方便。

为此，接下来需要实现图像(资源)上传功能。

实现资源上传功能需要为`CKEditor`指定文件上传所使用的**视图函数**及用于**获取已上传的文件视图函数**。



```python
from flask import send_from_directory, url_for
from flask_ckeditor import upload_fail, upload_success
# CKEditor用于上传文件的视图函数
@app.route('/upload_ckeditor', methods=['POST'])
def upload_ckeditor():
    f = request.files.get('upload')
    # 检查文件后缀
    extension = f.filename.split('.')[1].lower()
    if extension not in ['jpg', 'gif', 'png', 'jpeg', 'zip']:
        return upload_fail(message='不支持的文件！')
    f.save(os.path.join(app.config['UPLOADED_PATH'], f.filename))
    # 上传完成后返回相应链接
    return upload_success(url=url_for('uploaded_files', filename=f.filename))
```

这里使用了之前在**文件上传**章节中定义好的 `uploaded_files()` 函数。