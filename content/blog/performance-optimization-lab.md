---
templateKey: BlogPost
title: A Performance Optimization Lab
date: 2019-11-16T00:19:44.387Z
lastModified: 2025-07-27T08:54:45.000Z
description: Review on a lab from my university.
featuredPost: false
tags:
  - optimization
  - cache
  - tiling
---
The lab [requirement](https://1drv.ms/b/s!AjhADX36RxGfiYsZaGYIFiM3tYk4lw?e=vRaKHP) is as follows:

![](/img/performance-optimization-lab-image1.png)

![](/img/performance-optimization-lab-image4.png)

![](/img/performance-optimization-lab-image2.png)

In short, we are given a simple image processing implementation that manipulate a sprite object on a bitmap image with three types of operations, shifting, rotating, and mirroring. The goal is to optimize this implementation.

The key assumptions I noticed are:

* White color will always be the background color.
* Object will always be visible and never shifted off the image frame.
* Rotation will be a multiple of 90 degrees.
* One frame output per 25 operations.

**Algorithm level optimization:**
\
Before diving into the system level, I would like to start with algorithm improvement. The naive implementation is simply to manipulate matrix of the whole image frame according to the ops. However, with the first assumption, we can notice that not all pixels are required to be processed. We can iterate the whole image buffer and record the index reference and color information of each non-white colored pixel into a information compacted array I called info_array. We then only need to process the much smaller array for ops given. For example, given a shifting op, instead of moving pixels for the whole image frame, we can simply modify the index inside the info_array by the given offset. This algorithm level improvement greatly reduced the average processing time due to the fact that most objects are small fractions of the whole bitmap images.

Based on the second to fourth assumptions, we can further improve the algorithm by merging 25 operations into one before computing the output frame. To merge ops, we need 5 states corresponding to the 3 op types.  

```c
int shiftvertical = 0 , shifthorizontal = 0, rotate = 0, mirror_x = 0, mirror_y = 0;  
```

These states means that we are going to shift the object from its very initial position, which is represented by the info_array, vertically by `shiftvertical`, and horizontally by `shifthorizontal`, and rotate the object by `rotate` * 90 degrees, and mirror the object on x-axis if `mirrow_x` = 1 and on y-axis if `mirror_y` = 1, on the mentioned order. For each op, we are merging it with the previous states. Notice that the previous state will affect how to merge. For example, rotating 90 degrees before shifting up by y indicates shifting right by y before rotating 90 degrees and can be represented by states:

```c
shiftvertical = 0; shifthorizontal = y; rotate = 1; mirror_x = 0; mirror_y = 0;
```

Notice the order of merged ops must be consistent to produce the correct result. Merging a single op with a consecutive number of ops is equivalent to merging the same single op with the merged states produced from the same consecutive ops.

The code snippet for merging a shifting up operation:

```c
if (!strcmp(sensor_values[sensorValueIdx].key, "W")) {
           
            if(rotate&&mirror_x){
                
                switch(rotate){
                   
                    case 1:
                        shifthorizontal += sensor_values[sensorValueIdx].value;
                        break;
                    case 2:
                        shiftvertical += sensor_values[sensorValueIdx].value;
                        break;
                    case 3:
                        shifthorizontal -= sensor_values[sensorValueIdx].value;
                        break;
                     
                }
                
                
            }else if(rotate){
                switch(rotate){
                  
                    case 1:
                        shifthorizontal -= sensor_values[sensorValueIdx].value;
                        break;
                    case 2:
                        shiftvertical -=sensor_values[sensorValueIdx].value;
                        break;
                    case 3:
                        shifthorizontal += sensor_values[sensorValueIdx].value;
                        break;
                     
                }
                
            }else if(mirror_x){
                shiftvertical-=sensor_values[sensorValueIdx].value;
                
            }else {
                shiftvertical+= sensor_values[sensorValueIdx].value;
            }
}
```

After merging 25 ops into 5 states, we can start to process the info_array by manipulating the indexes to produce the output frame. A trick here is to merge the index manipulations for rotation and mirror.

```c
#define rotate_90_mirror_x(i,j,w,i2,j2) i2=(w-j-1);j2=(w-i-1)
#define rotate_90_mirror_y(i,j,w,i2,j2) i2=j;j2=i
#define rotate_180_mirror_x(i,j,w,i2,j2) i2=i;j2=(w-j-1) // mirrory
#define rotate_180_mirror_y(i,j,w,i2,j2) i2=(w-i-1);j2=j //mirrorx
#define rotate_270_mirror_x(i,j,w,i2,j2) i2=j;j2=i //rotate_90+my
#define rotate_270_mirror_y(i,j,w,i2,j2) i2=(w-j-1);j2=(w-i-1) //rotate_90+mx
```

No matter how many ops are merged, those merged states are applied on the same info_array, which means that the states can be used to distinguish unique frame. Therefore, we can cache some of the frequently shown frame into memory with their states as key.

**System Level Optimization:**
\
Obviously, the current implementation involves a lot of array iterations and looping. A very effective way to optimize those looping are loop tiling/blocking for the reason of cache locality. 
Loop tiling can be useful here for the rotating operation because the rotation of a matrix can potentially lead to crossing cache line and cache misses. However, things are a little bit tricky on our modified algorithm with info_array. Remember that the info_array contains indexes/reference to the original frame buffer, and it means that direct apply of tiling on the info_array will have little effect. Two neighbour cells in the info_array don’t necessarily indicate their reference locations are neighbors of each other in the original frame buffer. The trick is to use tiling to iterate the original frame when writing indexes into info_array such that indexes are read in tiling order from the info_array. 

Loop unrolling is another trick can be used and it is quite easy to implement. Some other optimizations involving register variable declaration and function inlining can be automagically done by GCC compiler with optimization flags like `-O3` turned on. Some other flags worth trying are something like `-march=cpu-type`.

![](/img/performance-optimization-lab-image3.png)




Another environment depending optimization is to prefer memory chunk manipulation with memset, memcpy, memcmp instead of single byte manipulation. Memory alignment is another factor to consider when defining data `struct`. The important way to find out rooms for optimization is to use profiler like `gcov` and `gprof`.
