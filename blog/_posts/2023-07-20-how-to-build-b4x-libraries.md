---
layout: blog
title:  How to Build Libraries For B4X
custom_css: blog
cover: /assets/images/post-thumbnails/how-to-build-libraries-for-b4x.jpg
tags: ["Tutorial","Java"]
---

So before head directly to the tutorial i just want to tell you a little story on how i suddenly want to build Libraries for B4X, because i don't even know what is B4X until yesterday~

So there's a client that wanting to create Libraries with Java programming langguage. The function of the libraries it self is pretty simple and so i accept to take the job. Fast Forward, i done working on the code, test it and it runs perfect. I go compile and pack it to jar and send them the screenshot of the working libs.

While they looks satisfied with result, they does says i still missing the XML files because they say Libraries a required an XML files. And this is make me confused, i know Java is not my primary languages, but as far as i know other than natively build it as .so or .dll files, Just using .class or .jar files alones are more than sufficient when you're creating Libraries for Java.

Surely i asked the client what is this XML file is for, but they just give me an general explanation of what Extensible Markup Language (XML) is. Not to be rude, but i don't think they understand what i'm asking. So i just go straight googling it and try to search Who actually need JAR + XML to be loaded as library.It take me a good 10 - 15 Minutes because most of the search reasult just giving me result for Jar File to read or create XML files. But there it is, the answer that i might looking for.

<br/>

# [B4X](https://www.b4x.com/) by Anywhere Software

So, what is it exactly? For simple B4X is an IDEs Suite that use their own programming langguage to Build application to platform of your choices either it Android, iOS, Arduino or Even Java App. 

While the B4X it self not a Java based program, but it used .jar based Libraries for (supposedly) compatibility with multiple different platform that it support. and with no way of it self Reading .jar file directly to see it's structure, thus it require XML to define it's structure to be able to be accessed by it's IDE Component. Rather weird approach if you asked me.

<br/>

# Start Building Then~

Since i already build the .jar files with OpenJDK previously i just need to make the XML files right? well, you're wrong.

Because B4X need their own definition inside the library we want to build, we need to also include their own headers to our sources code before compiling and pack it again.

Since B4X Development Environment are mainly aimed towards Windows Devs, for simplicity i will do it on Windows as well, sorry :/

I see someone able to running it on Ubuntu trough Wine, but i think it too much hasle to do, [Here's the Guide](https://www.b4x.com/android/forum/threads/b4j-on-linux.37306/) in case you're interested to try it on Linux.

So, Here's the indrigients:
- [B4J](https://www.b4x.com/b4j.html)
- [Simple Library Compiler](https://www.b4x.com/android/forum/threads/tool-simple-library-compiler-build-libraries-without-eclipse.29918/)
- [OpenJDK 11](https://learn.microsoft.com/en-us/java/openjdk/download) / [Oracle JDK 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)

For B4J and JDK you can just install it normaly with the given instruction (Just next :p)
as of the Simple Library Compiler, or SLC for short, you can just Extract it anywhere.

After everything is Installed Lets start to the next step

## Setup your B4X Environment

Since i just use B4J here i will only setup Environment for B4J, but if your trying to use it for B4A it should be the same approach to set them up.

- Open up your B4J
- On menubar choose "Configure Path"
![](/assets/images/posts/how-to-build-b4x-libraries/tools-configure-path.jpg){: .original-width }
- A Window will popup as follow and you can fill "javac.exe" with the location where you install the JDK and point it to javac binary file, and "Additional Libraries" fill it with where you compiled Libraries for B4X will be stored.
![](/assets/images/posts/how-to-build-b4x-libraries/path-configuration-window.jpg){: .original-width }
- Click OK and Exit B4J


## Modify Your Source Code

Before we can compile it, we need to add some B4X lib to your code so it will be usable within B4X.

```java
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.*;

@Version(1.0f)
@ShortName("YourLibName")
```

The `@Version` is to state what is your Library version and `@ShortName` is alias name that B4X will reffer to when the user trying to load your Library, you can chose a short name ore just simple your Library name, in camel cases.

and its just this 4 line to your Java code, atleast for the very Minimum, for other available anotations, Plese reffer to their [official guide and documentation](https://www.b4x.com/android/forum/threads/java-creating-libraries-for-b4a.6810/)


## Setup Simple Library Compiler

for this one is pretty Straight forward, because just like the name says, it's pretty simple :p

- Go to directory where you extract SLC
- On the root folder you'll find "LibraryCompiler.exe" and "B4J_LibraryCompiler.exe"
- For B4J we can double click on "B4J_LibraryCompiler.exe"
- You'll be provided by 3 Fields
    - Project Folder: fill this with path to root folder of your libraries source code
    - Library Name: we can simply fill this with the Class Name of your Libraries
    - -b4aignore: Just let this empty, we wont need it for now.
- After all field is setup you can go Press compile
![](/assets/images/posts/how-to-build-b4x-libraries/compiling.jpg){: .original-width }
- Voila, your lib are builded in JAR package with it's XML
![](/assets/images/posts/how-to-build-b4x-libraries/output-files.jpg){: .original-width }

**Fun fact:**
even though this is .jar file, but you wont be able to execute it from any other method outside B4X own IDE Loader.
eg: `java -jar yourlibs.jar` it will straight say your jar files is corrupted.
