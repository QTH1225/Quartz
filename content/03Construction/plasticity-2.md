---
title: 弹塑性力学|张量分析初步
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: 弹塑性力学中的张量分析初步
published: 2025-11-10
tags:
  - Mechanics
  - Elastoplasticity
category: Mechanics
---

## 前情提要
通过<a href="/03construction/plasticity-1">弹塑性力学|绪论及基础部分</a>（即[弹塑性力学|绪论及基础概念](/03construction/plasticity-1)）了解完弹塑性力学的研究内容以及基本概念后，我们需要首先对所使用的主要数学工具——张量，进行一些简单的介绍与分析。

## 张量的介绍
### 张量的下标含义
我们使用1，2，3分别代表坐标轴 $x,y,z$ ，并使用特定的字母（如 $i$ ）代表分别取1，2，3全体，称为下标。那么，带一个下标的字母表示一阶张量（即矢量），带两个下标的字母就表示二阶张量；所以，带 $n$ 个下标的字母就表示 $n$ 阶张量。

对于三维空间中的任一坐标 $(x,y,z)$ ，我们可以进行如下简记：
$$
(x,y,z)\to x_{i}(i=1,2,3)
$$
此时，$x_{1}$ 表示原坐标的 $x$ ，$x_{2}$ 表示原坐标的 $y$ ，$x_{3}$ 表示原坐标的 $z$ 。

则我们可以将二阶应力张量与二阶应变张量也进行简记：
$$
\begin{pmatrix}
\sigma_{x} & \tau_{xy} & \tau_{xz} \\
\tau_{yz} & \sigma_{y} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{z}
\end{pmatrix}=
\begin{pmatrix}
\sigma_{11} & \sigma_{12} & \sigma_{13} \\
\sigma_{21} & \sigma_{22} & \sigma_{23} \\
\sigma_{31} & \sigma_{32} & \sigma_{33}
\end{pmatrix}\to \sigma_{ij}\quad (i,j=1,2,3)
$$
$$
\begin{pmatrix}
\varepsilon_{x} & \varepsilon_{xy} & \varepsilon_{xz} \\
\varepsilon_{yz} & \varepsilon_{y} & \varepsilon_{yz} \\
\varepsilon_{zx} & \varepsilon_{zy} & \varepsilon_{z}
\end{pmatrix}=
\begin{pmatrix}
\varepsilon_{11} & \varepsilon_{12} & \varepsilon_{13} \\
\varepsilon_{21} & \varepsilon_{22} & \varepsilon_{23} \\
\varepsilon_{31} & \varepsilon_{32} & \varepsilon_{33}
\end{pmatrix}\to \varepsilon_{ij}\quad(i,j=1,2,3)
$$

### 求和约定
在同一项中，如果**某个下标出现两次**，那么在三维空间中就表示要**对该指标从1到3进行求和**（二维空间中即表示从1到2进行求和）。我们可以举几个例子来说明这个求和约定。

那么，我们可以举一些例子

1.张量与矢量点乘的关系
$$A_{i}B_{i}=A_{1}B_{1}+A_{2}B_{2}+A_{3}B_{3}=\sum_{i=1}^{3}A_{i}B_{i}=\mathbf{A} \cdot \mathbf{B}$$

2.求和约定下的计算式
对于$C_{ij}B_{i}=C_{1j}B_{1}+C_{2j}B_{2}+C_{3j}B_{3}$，其中$j=1,2,3$。式中对 $i$进行求和，则可以等价为下面三个式子

$$
\begin{cases}
C_{i 1}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{31}B_{3} \\
C_{i 2}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{32}B_{3} \\
C_{i 3}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{33}B_{3} \\
\end{cases}
$$

3.应力张量的展开：$\sigma _{ii}=\sigma_{11}+\sigma_{22}+\sigma_{33}$

4.应力平方的乘积：
$$
\sigma_{ij}\sigma_{ij}=\sigma_{11}^{2}+\sigma_{12}^{2}+\sigma_{13}^{2}+\sigma_{21}^{2}+\sigma_{22}^{2}+\sigma_{23}^{2}+\sigma_{31}^{2}+\sigma_{32}^{2}+\sigma_{33}^{2}
$$

### 克罗内克符号（Kronecker Delta）
$\delta_{ij}$ 称为**克罗内克符号**，定义如下
$$
\delta_{ij}=
\begin{cases}
0 & \quad\text{if}\quad i\neq j \\
1 & \quad\text{if} \quad i=j & 
\end{cases}
$$

$\delta_{ij}$ 有两个下标，所以它是二阶张量，那么从矩阵角度看也就是单位矩阵，即：
$$
\delta_{ij}=\begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}
$$
它可以使公式的表达与书写更加简单，例如在笛卡尔坐标系中，坐标轴的单位矢量点乘可以表示为
$$
\mathbf{i}_{i} \cdot \mathbf{i}_{j}=\delta_{ij}
$$
### 偏导数的下标记法
为了更方便标记偏导数，我们可以使用**逗号记法来表示偏导**。
$$
f_{,i}=\frac{ \partial f }{ \partial x_{i} },\quad f_{,ij}=\frac{ \partial^{2} f }{ \partial x_{i} \partial x_{j} }
$$
则我们的应力分量可以表示为
$$
\sigma_{ij,k}=\frac{ \partial \sigma_{ij} }{ \partial x_{k} },\quad \sigma_{ij,j}=\frac{ \partial \sigma_{ij} }{ \partial x_{j} } =\frac{ \partial \sigma_{i_{1}} }{ \partial x_{1} } +\frac{ \partial \sigma_{i_{2}} }{ \partial x_{2} }+\frac{ \partial i_{3} }{ \partial x_{3} } 
$$

这里的  $j$ 重复，所以我们对 $j=1,2,3$ 进行求和。
### 置换符号(Permutation 符号)
我们使用置换符号来简化表达式，$\epsilon_{ijk}$ 的定义如下。
$$\epsilon_{ijk}=
\begin{cases}
\begin{aligned}
&1   && \text{当 } i,j,k \text{ 为正循环排列(偶排列)} \\
&-1  && \text{当 } i,j,k \text{ 为逆循环排列(奇排列)} \\
&0   && \text{当 } i,j,k \text{ 中有两个赋值相同时}
\end{aligned}
\end{cases}
$$

那么，我们可以举个例子说明三级行列式的置换符号表达。对于三级行列式，我们有
$$
\begin{vmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{vmatrix}
$$
$$
=a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}-a_{12}a_{21}a_{33}-a_{11}a_{23}a_{32}
$$

那么，我们使用置换符号可以写为 $\epsilon_{ijk}a_{1i}a_{2j}a_{3k}$ 或者 $\epsilon_{ijk}a_{i1}a_{j2}a_{k3}$ ，其中 $i,j,k=1,2,3$ 。

## 张量的定义
### 从坐标变换看张量与矢量
如果对于直角坐标系 $Oxyz$ ，矢量 $\mathbf{r}$ 的三个分量为 $a_{1},a_{2},a_{3}$，则有 $\mathbf{r}=a_{1}i+a_{2}j+a_{3}k$。对于另一个直角坐标系 $Ox'y'z'$，矢量 $\mathbf{r}$ 可以被分解为 $a_{1}',a_{2}',a_{3}'$，则有 $\mathbf{r}=a_{1}'i'+a_{2}'j'+a_{3}'k'$。由于矢量的客观性，我们有
$$
a_{1}i+a_{2}j+a_{3}k=a_{1}'i'+a_{2}'j'+a_{3}'k'
$$
左右两边同时点乘 $i',j',k'$ ，则可以得到
$$
\begin{cases}
a_{1}'=a_{1}i\cdot i'+a_{2}j\cdot i'+a_{3}k\cdot i'=a_{1}l_{11}+a_{2}l_{12}+a_{3}l_{13} \\
a_{2}'=a_{1}i\cdot j'+a_{2}j\cdot j'+a_{3}k\cdot j'=a_{1}l_{21}+a_{2}l_{22}+a_{3}l_{23} \\
a_{3}'=a_{1}i\cdot k'+a_{2}j\cdot k'+a_{3}k\cdot k'=a_{1}l_{31}+a_{2}l_{32}+a_{3}l_{33} \\
\end{cases}
$$

则可以使用矩阵表示为
$$
\begin{pmatrix}
a_1^{\prime} \\
a_2^{\prime} \\
a_3^{\prime}
\end{pmatrix}=
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}
\begin{pmatrix}
a_1 \\
a_2 \\
a_3
\end{pmatrix}
$$

使用张量可以记为
$$
a_{i}'=l_{ij}a_{j}
$$
其中可以设 $l_{ij}$ 为坐标变换矩阵，或者称为坐标变换张量。
$$l_{ij}=
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}
$$
由线性代数，坐标变换的逆等于矩阵的转置
$$
\begin{gathered}
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}^{-1}=
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}^T=
\begin{pmatrix}
l_{11} & l_{21} & l_{31} \\
l_{12} & l_{22} & l_{32} \\
l_{13} & l_{23} & l_{33}
\end{pmatrix}
\end{gathered}
$$
即$(l_{ij})^{-1}=(l_{ij})^{T}=l_{ij}$
### 张量的定义
张量元素的个数由空间维数 $N$ 与阶数 $n$ 决定，即等于 $N^{n}$ 。此时我们可以在三维直角坐标系中定义张量。
- 零阶张量的定义

零阶张量即为标量，它与坐标系无关，是坐标变换中的不变量。
- 一阶张量的定义

坐标系 $Oxyz$ 下的数组 $T_{i}(i=1,2,3)$ 在坐标变换为 $Ox'y'z'$ 后，数组由 $T_{i}(i=1,2,3)$ 变为 $T_{i}'(i=1,2,3)$ ，如果变换前后满足以下关系
$$
\begin{pmatrix}
T_1^{\prime} \\
T_2^{\prime} \\
T_3^{\prime}
\end{pmatrix}=
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}
\begin{pmatrix}
T_1 \\
T_2 \\
T_3
\end{pmatrix}
$$
即 $T_{i}'=l_{ij}T_{j}$ 成立，那么我们称数组 $T_{i}(i=1,2,3)$ 为一阶张量（矢量）。
- 二阶张量的定义

坐标系 $Oxyz$ 下的数组 $T_{i}(i=1,2,3)$ 在坐标变换为 $Ox'y'z'$ 后，数组由 $T_{i}(i=1,2,3)$ 变为 $T_{i}'(i=1,2,3)$ ，如果变换前后满足$$T_{ij}'=l_{i m}l_{j n}T_{mn}$$ 或者 $$T_{ij}=l_{mi}l_{nj}T_{mn}'$$ 则我们称数组 $T_{ij}(i=1,2,3)$ 为二阶张量，用矩阵表示这个条件为：

-  $n$ 阶张量的定义

如果有数组 $T_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots,i_{n}=1,2,3)$ ，显然该数组的元素为 $3^{n}$ 个，如果在新的坐标系下，该数组变为$T'_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots,i_{n}=1,2,3)$，如果变换前后满足如下关系：
$$
T'_{i_{1}i_{2}\dots i_{n}}=l_{i_{1}j_{1}}l_{i_{2}}j_{2}\dots l_{i_{n}j_{n}}T_{j_{1}j_{2}\dots j_{n}}
$$
或者
$$
T_{j_{1}j_{2}\dots j_{n}}=l_{j_{1}i_{1}}l_{j_{2}i_{2}}\dots l_{j_{n}i_{n}}T'_{j_{1}j_{2}\dots j_{n}}
$$
那么称$T_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots i_{n})$为$n$阶张量，也可以表示为$T_{i_{n}}$。
## 张量的代数运算
### 张量的相等
如果两个张量 $A$ 与 $B$ 在同一坐标下的**各个分量均相同**，则称这两个分量相等，记为 $A=B$.
### 张量的加法
如果两个张量 $A$ 与 $B$ 同阶，那它们在同一坐标系中的**各个对应分量相加**的操作称为 $A$ 与 $B$ 的和，记为 $A+B$ .
### 张量的数乘
设 $\lambda$ 为一个数（标量），$A$ 为任意阶张量，定义 $\lambda$ 与 $A$ 的乘积 $\lambda A$ 为一同阶的新张量 $B$ ，则 $B$ 的分量为 $\lambda$ 乘以 $A$ 的每一个分量。
### 张量的乘积
若 $A$ 为 $m$ 阶张量，而 $B$ 为 $n$ 阶张量，则 $AB$ 表示它们的乘积，定义为用**前一个张量的每一个分量与后一个张量的每一个分量分别进行相乘**，则可以得到 $3^{m}\cdot 3^{n}=3^{m+n}$ 个元素，它们构成一个 $m+n$ 阶张量。

张量的乘积主要具有以下性质
1. 张量的分配律：$(A+B)C=AC+BC$
2. 张量的结合律：$(AB)C=A(BC)$
3. 不满足交换律：$AB\neq BA$
### 张量缩并
任一 $n$ 阶张量（$n\geq 2$），有 $n$ 个自由下标，令**其中两个下标相同从而进行约定求和**，其余自由下标保持不变，称为张量的缩并。该操作可以将原张量的阶数降低2阶，产生一个 $n-2$ 阶的张量。

例如二阶张量$\sigma_{ij}\to\sigma_{ii}=\sigma_{11}+\sigma_{22}+\sigma_{33}$，可以看出该二阶张量缩并后成为一个0阶张量（标量）；对于三阶张量进行缩并$A_{ijk}\to A_{ijj}=A_{i 11}+A_{i 22}+A_{i 33}$，可以看出三阶张量缩并后成为了1阶张量。

### 张量的内积（点乘）
对张量 $A$ 和 $B$ 的乘积进行一次缩并运算，其中参与缩并的两个下标为**前一个张量的最后一个下标与最后一个张量的第一个下标**，这种操作称为张量的内积，记为 $A\cdot B$ 。下面我们对不同阶张量的内积进行讨论:

- 两个一阶张量 $A=A_{i}$ ，$B=B_{j}$，则 $A\cdot B=A_{i}B_{i}$ 结果为标量。
- 两个二阶张量 $A=A_{ij}$，$B=B_{kl}$ ，则 $A\cdot B=A_{ik}B_{kl}$ ，结果仍然是一个二阶张量。此时张量点乘实际上就是矩阵的乘法。

那么，此时二阶及以上的张量内积显然不符合交换律，但是对于两个一阶张量而言，是符合交换律的。

### 张量的对称与反对称
- 张量的转置：调换张量的两个下标的顺序的操作称为张量的转置；

- 张量的对称：转置张量与原张量相等，则称该张量关于这两个下标对称，例如四阶弹性系数张量 $C_{ijkl}=C_{jikl}$ ，则称该张量对于第一与第二下标对称。

- 张量的反对称：转置张量与原张量相反，则称为该张量对于这两个下标反对称；

- 对称张量：如果张量对于任意两个下标都对称，则该张量称为对称张量；

- 反对称张量：如果张量对于任意两个下标都反对称，则该张量称为反对称张量；

那么我们有重要的性质：对于任意一个二阶张量 $A_{ij}$ ，总可以将 $A_{ij}$ 分解为**一个对称张量与一个反对称张量之和**：
$$
A_{ij}=\frac{1}{2}(A_{ij}+A_{ji})+\frac{1}{2}(A_{ij}-A_{ji})
$$
其中，$\frac{1}{2}(A_{ij}+A_{ji})$ 为对称张量，而 $\frac{1}{2}(A_{ij}-A_{ji})$ 为反对称张量。
