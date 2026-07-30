---
title: 弹塑性力学|应力分析
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: 弹塑性力学中的应力分析部分
published: 2025-11-27
tags:
  - Elastoplasticity
  - Mechanics
category: Mechanics
---

## 外力
### 体力
体力是指物体单位体积上所受的外力，其定义以及计算公式如下。
$$
f=\lim_{ \Delta V \to 0 } \frac{\Delta F}{\Delta V}=f_{x}i+f_{y}j+f_{z}k
$$
该定义公式可以说明以下几个问题：
1. $f$是坐标的连续分布函数；
2. $f$的加载方式是任意的；
3. $f_{x},f_{y},f_{z}$的正负号由坐标方向确定

### 面力
面力是指作用于物体表面单位面积上的外力，其定义以及公式如下。
$$
\bar{f}=\lim_{ \Delta S \to 0 } \frac{\Delta F}{\Delta S}=\bar{f_{x}}i+\bar{f_{y}}j+\bar{f_{z}}k
$$
该定义公式可以说明以下几个问题：
1. $\bar{f}$是坐标的连续分布函数；
2. $\bar{f}$的加载方式是任意的；
3. $\bar{f_{x}},\bar{f_{y}},\bar{f_{z}}$的正负号由坐标方向确定
## 应力矢量与应力张量
### 应力矢量的定义
应力矢量为由外力引起的在 $P$ 点某一面上的内力分布集度，其公式为：
$$
p_{n}=\lim_{ \Delta A \to 0 } \frac{\Delta F}{\Delta A}
$$
那么，我们可以将应力矢量分为法向分量$\sigma_{n}$与切向分量$\tau_{n}$，它们分别被称为正应力、切应力。则应力矢量可以表示为
$$
p_{n}=\sigma_{n}n+\tau_{n}s
$$
其中， $n$ 是外法线单位矢量，$s$ 为截面内一个单位矢量，那么在直角坐标系中也可以写为
$$
p_{n}=p_{x}i+p_{y}j+p_{z}k
$$
### 应力张量
为了研究通过一点$P$ 在不同截面上的应力，我们规定了物体在一点的应力状态为通过一点$P$ 的各个面上的应力状况的集合。
- $x$ 面的应力为$\sigma_{x},\tau_{xy},\tau_{xz}$
- $y$ 面的应力为$\sigma_{y},\tau_{yx},\tau_{yz}$
- $z$ 面的应力为$\sigma_{z},\tau_{zx},\tau_{zy}$
那么我们将这9个分量排列成矩阵的形式，该矩阵称为应力矩阵
$$
\begin{pmatrix}
\sigma_{x} & \tau_{xy} & \tau_{xz} \\
\tau_{yz} & \sigma_{y} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{z}
\end{pmatrix}=
$$
下面介绍应力符号的含义。以$\tau_{xy}$为例，第一个下标$x$ 表示$\tau$所在面的法线方向。第二个下标$y$ 表示$\tau$的方向。而我们对应力符号也有一定规定：
- 正应力：拉为正，压为负
- 切应力：坐标正面上，与坐标正向一致为正；坐标负面上，与坐标正向相反时为正。

如果将$x,y,z$用1,2,3进行表示，那么可以简单写成张量形式：
$$
\sigma_{ij}=
$$
而$\sigma_{ij}$称为应力张量。

由于应力张量是定义在物体的每个质点上的，因此，应力张量是位置的函数，即$\sigma_{ij}(x,y,z)$，称为物体的应力张量场，称为应力场。而根据切应力互等定理有$\sigma_{ij}=\sigma_{ji}$，也就是说应力张量是对称张量，即应力矩阵是对称矩阵。

## 任意斜截面上的应力
