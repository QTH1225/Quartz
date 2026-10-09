---
title: Elastoplasticity | Stress Analysis
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: Notes on stress analysis in elastoplasticity.
published: 2025-11-27
tags:
- Elastoplasticity
- Mechanics
translations:
  zh: /02engineering/structure/plasticity-3
lang: en-US
---

## External force
### Power
Physical strength means the external force to which the body is subject in its volume, defined and calculated as follows.
$$
f=\lim_{ \Delta V \to 0 } \frac{\Delta F}{\Delta V}=f_{x}i+f_{y}j+f_{z}k
$$
The formula for this definition may illustrate the following issues:
1. $f$is the continuous distribution function for coordinates;
2. $f$The loading method is arbitrary;
3. $f_{x},f_{y},f_{z}$The number of the coordinates is determined by the coordinates.

### Fashion.
Surface force means the external force which acts on the area of the body ' s surface unit, defined and formulaed as follows.
$$
\bar{f}=\lim_{ \Delta S \to 0 } \frac{\Delta F}{\Delta S}=\bar{f_{x}}i+\bar{f_{y}}j+\bar{f_{z}}k
$$
The formula for this definition may illustrate the following issues:
1. $\bar{f}$is the continuous distribution function for coordinates;
2. $\bar{f}$The loading method is arbitrary;
3. $\bar{f_{x}},\bar{f_{y}},\bar{f_{z}}$The number of the coordinates is determined by the coordinates.
## stock vector and spresstensor
### Definition of a stress vector
The stress vector is triggered by extraneous forces. $P$ The internal concentration of the power on a point, the formula being:
$$
p_{n}=\lim_{ \Delta A \to 0 } \frac{\Delta F}{\Delta A}
$$
So we can divide the stress vector into a meso vector.$\sigma_{n}$and the vector fraction$\tau_{n}$, which are called positivespress, tanspress. The stress vector can be expressed as
$$
p_{n}=\sigma_{n}n+\tau_{n}s
$$
The blogger writes: $n$ It's a foreign-law unit vector.$s$ For a unit vector in the cross section, you can also write in the straight corner codenate system as
$$
p_{n}=p_{x}i+p_{y}j+p_{z}k
$$
### stresstensor
To study, pass a little.$P$ On different cross sections, we set the object's stress status at a point to pass a point.$P$ The collection of stress conditions on all sides.
- $x$ The face is$\sigma_{x},\tau_{xy},\tau_{xz}$
- $y$ The face is$\sigma_{y},\tau_{yx},\tau_{yz}$
- $z$ The face is$\sigma_{z},\tau_{zx},\tau_{zy}$
So we'll put these nine points in the form of a matrix called a stress matrix.
$$
\begin{pmatrix}
\sigma_{x} & \tau_{xy} & \tau_{xz} \\
\tau_{yz} & \sigma_{y} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{z}
\end{pmatrix}=
$$
The meaning of the stress symbol is described below.$\tau_{xy}$For example, the first subscript$x$ Organisation$\tau$The French direction of the side. Second subscript$y$ Organisation$\tau$And we have a rule on the stress symbol:
- Stress: Positive, negative
- Cutpress: The coordinates are on the front, in line with the coordinates, and the coordinates are negative, in contrast to the coordinates.

If you're going to$x,y,z$In the form of 1,2,3, it can be simply written as tensor:
$$
\sigma_{ij}=
$$
And...$\sigma_{ij}$Called stresstensor.

Because stresstensor is defined on each of the objects' mass points, stresstensor is the function of the position, i.e., the position of the object is the function of the object.$\sigma_{ij}(x,y,z)$, the object's stresstensor field, the stress field.$\sigma_{ij}=\sigma_{ji}$, that is, spresstensor is symmetrical, the tress matrix.

## Stress on Any Antenna
