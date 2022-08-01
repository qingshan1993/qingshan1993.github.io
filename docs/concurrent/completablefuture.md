---
title: CompletableFuture基础
---

# 初见CompletableFuture

CompletableFuture实现了Future接口，所以它理应有Future的功能，Future意为"未来"，代表了异步计算结果。看下面的例子：
::: code-tabs#java
@tab Future

```java
/* class：FutureDemo.java，method：main()*/
ExecutorService executor = Executors.newFixedThreadPool(5); 
//这里使用了lamada表达式，等待500ms，然后返回一个qingshang1993字符串
Callable<String> task = () -> {
    Thread.sleep(500);
    return "qingshang1993";
};
Future<String> future = executor.submit(task);
String result = future.get(); 
```

@tab CompletableFuture

```java
/* class：CompletableFuture.java，method：main()*/
CompletableFuture<String> completableFuture = new CompletableFuture<>();
ExecutorService executor = Executors.newFixedThreadPool(5);
executor.submit(()->{
    Thread.sleep(500);
    completableFuture.complete("qingshang1993");
    return null;
});
String result = completableFuture.get();
```
:::

这里我们分别使用了普通的Future和CompletableFuture实现了一个简单的功能：在主线程中创建一个异步任务，等待500ms后，返回一个“qingshang1993”字符串，当我们在主线程中调用get方法后，主线程将被阻塞，直到约500ms后异步计算结果返回--一个“qingshang1993”字符串。
从上面的例子可以看出，可以通过new关键字创建CompletableFuture对象，它有一个complete(T t)方法，接受一个泛型参数t，这个方法的的目的就是直接给CompletableFuture实例对象的结果赋值，功能相近的方法还有completeThrowable(Throwable x, Object r) 和 completeRelay(Object r)。
# 异步线程编排
我们所说的编排指的是：对于多个异步线程，我们可以手动指定线程执行的顺序。显然，没有CompletableFuture，我们依然可以实现编排，我们还是看一个例子：
