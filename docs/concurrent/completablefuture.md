---
title: CompletableFuture基础
---

# 初见CompletableFuture

CompletableFuture实现了Future接口，所以它理应有Future的功能，Future意为"未来"，代表了异步计算结果。看下面的例子：
::: code-tabs#java
@tab Future

```java
/* class：CompletableFutureDemo.java，method：test1()*/
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
/* class：CompletableFutureDemo.java，method：test2()*/
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
我们所说的编排指的是：对于多个异步线程，我们可以手动指定线程执行的顺序。显然，没有CompletableFuture，我们依然可以实现编排，看下面的代码例子：

::: code-tabs#java
@tab Thread.join

```java
/* class：CompletableFutureDemo.java，method：test3()*/
Thread thread1 = new Thread(() -> IntStream.range(0, 10).forEach(System.out::println));
Thread thread2 = new Thread(() -> {
    try {
        thread1.join();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    IntStream.range(10, 20).forEach(System.out::println);
});
thread1.join();
thread1.start();
thread2.start();
```

@tab CompletableFuture

```java
/* class：CompletableFutureDemo.java，method：test4()*/
CompletableFuture
        .runAsync(() -> IntStream.range(0, 10).forEach(System.out::println))
        .thenRunAsync(() -> IntStream.range(10, 20).forEach(System.out::println));
```
:::
正如上面的代码，使用两个线程打印数字，第一个线程打印出0-9，然后第二个线程打印出10-19，我们使用Thread的join方法可以实现，join方法实际上是使用Object的wait方法实现两个线程之间的通信从而达到依次执行的目的，而CompletableFuture底层使用了并发类ForkJoinPool来实现线程间的通信。
值得说明的是，上面的例子中，我们使用CompletableFuture的静态方法runAsync()来作为任务的起点，我们并不能使用CompletableFuture实例对象的thenRunAsync()作为任务的起点，就像下面的例子，执行后，什么也不会发生。
```java
/* class：CompletableFutureDemo.java，method：test5()*/
CompletableFuture<Void> completableFuture = new CompletableFuture<>();
completableFuture
        .thenRunAsync(() -> IntStream.range(0, 10).forEach(System.out::println))
        .thenRunAsync(() -> IntStream.range(10, 20).forEach(System.out::println));
```
这足以说明，我们在使用CompletableFuture的使用，必须指定一个任务的起点。通常我们使用静态方法runAsync来作为任务的起点，这个方法还有一个重载方法，可以指定一个java.util.concurrent.Executor类型的实例对象，这意味着我们可以传入自定义的线程池对象。默认的，CompletableFuture使用的是ForkJoinPool.commonPool()。
类似的我们还有一个supplyAsync静态方法，它接受一个Supplier的函数式接口类型参数，Supplier有一个返回值，和runAsync一样，他也提供一个重载方法。除此之外，CompletableFuture还有一个completedFuture的静态方法，它足够简单，我们只需要传入一个结果参数就好了。总结一下，作为CompletableFuture的任务起点，提供了以下5个**静态方法**：
```java
//CompletableFuture.class
public static CompletableFuture<Void> runAsync(Runnable runnable) {
    return asyncRunStage(asyncPool, runnable);
}
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor) {
    return asyncRunStage(screenExecutor(executor), runnable);
}

public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier) {
    return asyncSupplyStage(asyncPool, supplier);
}
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor) {
    return asyncSupplyStage(screenExecutor(executor), supplier);
}

public static <U> CompletableFuture<U> completedFuture(U value) {
    return new CompletableFuture<U>((value == null) ? NIL : value);
}
```
# xxx和xxxAsync
在CompletableFuture中，我们会看到很多类似xxx和xxxAsync成对出现的方法，例如：thenRun和thenRunAsync，
thenAccept和thenAcceptAsync，thenCombine和thenCombine等等。我们来看一下他们的区别
::: code-tabs#java
@tab xxx

```java
/* class：CompletableFutureDemo.java，method：test6()*/
CompletableFuture
        .completedFuture(null)
        .thenRun(() -> System.out.println("thenRun 1:" + Thread.currentThread().getName()))
        .thenRun(() -> System.out.println("thenRun 2:" + Thread.currentThread().getName()));
//thenRun 1:main
//thenRun 2:main
```

@tab xxxAsync

```java
/* class：CompletableFutureDemo.java，method：test7()*/
CompletableFuture
        .completedFuture(null)
        .thenRunAsync(() -> System.out.println("thenRunAsync 1:" + Thread.currentThread().getName()))
        .thenRunAsync(() -> System.out.println("thenRunAsync 2:" + Thread.currentThread().getName()));
//thenRunAsync 1:ForkJoinPool.commonPool-worker-9
//thenRunAsync 2:ForkJoinPool.commonPool-worker-9
```
:::
在上面的两个例子中，我们使用completedFuture()静态方法作为任务的起点，然后使用thenRun方法来编排任务，该方法接受一个Runable实例，我们这里仅仅打印出运行该任务的线程名称，从打印结果可以看出，带Async后缀的方法会使用线程池中的线程运行任务，不带后缀的会使用当前线程运行任务。

# 处理异常
与Future相比，CompletableTuture一个巨大的优势就是它可以处理异常，看下面的例子：
```java
/* class：CompletableFutureDemo.java，method：test8()*/
final String name = "qingshan1993";
CompletableFuture
        .supplyAsync(() -> "Hello, ")
        .thenApply(x -> { return x + name + ", ";})
        .thenApply(x -> {
            if (x.contains("qingshan1993")) {
                return x + "welcome to study";
            } else {
                throw new IllegalArgumentException("must contains 'qingshan1993'");
            }})
        .exceptionally(ex-> "ERROR!")
        .thenAccept(x -> System.out.println(x +" CompletableFuture"));
//name=qingshan1993, result = Hello, qingshan1993, welcome to study CompletableFuture
//name=qingshan, result = ERROR! CompletableFuture
```
在上面的例子中，我们使用thApply拼接一个字符串，这个方法接受一个Function接口参数，其中在其第三步拼接"welcome to study"时，我们做一个前阶段的结果字符串是否包含"qingshan1993"的简单的判断。如果不包含，抛出一个IllegalArgumentException，在接下来使用**exceptionally()**方法处理异常，处理异常后我们返回了"ERROR!"作为拼接字符串的前缀，这里如果我们不处理这个异常，那么在控制台也看不到相关的异常信息，因为这个异常信息实际被包装在AltResult这个结果包装类中。
# thenCombine和thenAcceptBoth
在上面几个例子中，我们已经提到了
