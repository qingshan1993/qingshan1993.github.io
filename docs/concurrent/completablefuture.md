---
title: CompletableFuture基础
---

# 为什么需要CompletableFuture
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
