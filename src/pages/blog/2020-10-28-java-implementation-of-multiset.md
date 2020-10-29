---
templateKey: BlogPost
title: Java Implementation of MultiSet
date: 2020-10-28T21:16:49.892Z
featuredPost: false
tags:
  - Coding
  - Java
  - Data Structure
---
In java.utils we have TreeSet which is quite useful for storing unique keys, but what if there is a need to store sorted non-unique keys into the set? Basically, the solution is to use a multiset. Below is my implementation of MultiSet in Java.

My design is based on java TreeMap. I use a linked list structure to store all nodes with the same element. To be able to go to previous and next item within the linked list, I implement a simple doubly linked list with a node structure. You may wonder why not simply use a treeMap to store data with frequencies and to save some space. The answer is that linked list structure is more flexible and allow us to find the next/previous node that contains an element that is **equal to** the current element within a given specific node. That is to say, each element can be distinguished to each other even if their values are the same by their position in the linked list. Their position in the linked list is determined by the insertion order. While I could maintain these position information somewhere else, I realize that if the input data contains little to none duplicate values, then the extra cost from using linked list is negligible.

**Doubly Linked List:**

```java
class DLL<T>{
        //dummy head and dummy tail
        Node<T> head;
        Node<T> tail;

        public DLL(){
            head = new Node<>(null);
            tail = new Node<>(null);
            head.next=tail;
            tail.prev=head;
        }

        public void addLast(T data){
            Node<T> node = new Node<>(data);
            tail.prev.next=  node;
            node.prev =tail.prev;

            tail.prev= node;
            node.next=tail;
        }

        public void remove(Node<T> node){
            node.prev.next=node.next;
            node.next.prev=node.prev;
        }

        public void removeFirst(){
            head.next= head.next.next;
            head.next.prev= head;
        }
        public Node<T> peekFirst(){
            if(head.next!=tail)
                return head.next;
            return null;
        }
        public Node<T> peekLast(){
            if(head.next==tail)
                return null;
            return tail.prev;
        }

        public boolean isTail(Node<T> node){
            return node.next==tail;
        }
        public boolean isHead(Node<T> node){
            return node.prev==head;
        }

    }
```

**Node:**

```java
class Node<K>{ 
        Node<K> prev,next;
        K data;
        public Node(K val){
            data= val;
        }
}
```

**MultiSet:**

```java
public class MultiSet<K extends Comparable<? super K>> { 
    
    TreeMap<K,DLL<K>> map;
    public MultiSet(){
        map = new TreeMap<>();

    }

    public Node<K> add(K data){

        DLL<K> dll = map.computeIfAbsent(data, k->new DLL<>());
        dll.addLast(data);
        return dll.peekLast();

    }

    public boolean contains(K data){
        return map.containsKey(data);
    }

    public void remove(K data){
        if(contains(data)){
            DLL<K> dll = map.get(data);
            dll.removeFirst();
            if(dll.head==dll.tail){
                map.remove(data);
            }
        }
    }
    public void remove(Node<K> node){
        if(!contains(node.data)) return;

        DLL<K> dll = map.get(node.data);
        dll.remove(node);
        if(dll.head==dll.tail){
            map.remove(node.data);
        }

    }
    public Node<K> next(Node<K> node){
        K data = node.data;
        DLL<K> dll = map.get(data);
        Node<K> res;
        if(dll.isTail(node)){ 
            dll = map.higherEntry(data).getValue();
            res = dll.peekFirst();
        }else{
            res = node.next;
        }
        return res;
    }

    public Node<K> prev(Node<K> node){
        K data = node.data;
        DLL<K> dll = map.get(data);
        Node<K> res;
        if(dll.isHead(node)){
            dll = map.lowerEntry(data).getValue();
            res = dll.peekLast();
        }else{
            res = node.prev;
        }
        return res;
    }
}
```

What is next? With multiset we can do a lot more than what a tree set can do, for example we can implement a median finder with multiset. Check my next post about median finder.
