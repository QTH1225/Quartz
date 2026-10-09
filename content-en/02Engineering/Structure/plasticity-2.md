---
title: Elastoplasticity | An Introduction to Tensor Analysis
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: An introduction to tensor analysis for elastoplasticity.
published: 2025-11-10
tags:
- Mechanics
- Elastoplasticity
translations:
  zh: /02engineering/structure/plasticity-2
lang: en-US
---

## Previously on "The Right"
After completing the content and basic concepts of the study of the elastapalsitice in the previous unpublished note “Elastitice à l'élastación en el contours”, the main mathematical tool — tensor — is briefly described and analysed.

## - I'm sorry, Tensor.
### So, the meaning of the tensor subscript
We use 1, 2, 3 for the axis. $x,y,z$ and use a specific letter (e.g., $i$ The letter with a subscript sign means first-order vector, and the letter with two subscripts means second-order tansor; so, with $n$ The letter of subscript means $n$ Steptensor.

for any coordinates in 3D space $(x,y,z)$ We can make the following brief:
$$
(x,y,z)\to x_{i}(i=1,2,3)
$$
The blogger writes:$x_{1}$ Represents original coordinates $x$ ，$x_{2}$ Represents original coordinates $y$ ，$x_{3}$ Represents original coordinates $z$ 。

We can also prune the second step of stresstensor and the second step of strainensor:
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

### Peace offerings.
In the same subparagraph, if**Some subscript appeared twice.**, then in 3D space, it means yes**Compromise the indicator from 1 to 3**We can give a few examples of this.

So, we can give you some examples.

1.tensor ' s relationship to vector point multiplied
$$A_{i}B_{i}=A_{1}B_{1}+A_{2}B_{2}+A_{3}B_{3}=\sum_{i=1}^{3}A_{i}B_{i}=\mathbf{A} \cdot \mathbf{B}$$

2. Computation formula under the agreement
Yeah.$C_{ij}B_{i}=C_{1j}B_{1}+C_{2j}B_{2}+C_{3j}B_{3}$, of which$j=1,2,3$. The formula $i$If you make a peace, you can equal the next three.

$$
\begin{cases}
C_{i 1}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{31}B_{3} \\
C_{i 2}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{32}B_{3} \\
C_{i 3}B_{i}=C_{11}B_{1}+C_{21}B_{2}+C_{33}B_{3} \\
\end{cases}
$$

3. Stresstensor ' s development:$\sigma _{ii}=\sigma_{11}+\sigma_{22}+\sigma_{33}$

4. Strress squared multiplier:
$$
\sigma_{ij}\sigma_{ij}=\sigma_{11}^{2}+\sigma_{12}^{2}+\sigma_{13}^{2}+\sigma_{21}^{2}+\sigma_{22}^{2}+\sigma_{23}^{2}+\sigma_{31}^{2}+\sigma_{32}^{2}+\sigma_{33}^{2}
$$

### Kronecker (Kronecker Delta)
$\delta_{ij}$ It's called**Kronecker symbol**, defined as follows:
$$
\delta_{ij}=
\begin{cases}
0 & \quad\text{if}\quad i\neq j \\
1 & \quad\text{if} \quad i=j & 
\end{cases}
$$

$\delta_{ij}$ There are two subscripts, so it's second-order tensor, which is the matrix, which is the unit matrix:
$$
\delta_{ij}=\begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}
$$
It can make the formula more simple in its expression and writing, for example, in the caldetic coordeine system, the unit vector points of the axis multiplied by the number of points of the axis can be expressed as:
$$
\mathbf{i}_{i} \cdot \mathbf{i}_{j}=\delta_{ij}
$$
### Subscript to the number of deflectors
We can use it to better mark the glitch numbers.**Comma marks for bias**。
$$
f_{,i}=\frac{ \partial f }{ \partial x_{i} },\quad f_{,ij}=\frac{ \partial^{2} f }{ \partial x_{i} \partial x_{j} }
$$
And our stress fractions can be expressed as
$$
\sigma_{ij,k}=\frac{ \partial \sigma_{ij} }{ \partial x_{k} },\quad \sigma_{ij,j}=\frac{ \partial \sigma_{ij} }{ \partial x_{j} } =\frac{ \partial \sigma_{i_{1}} }{ \partial x_{1} } +\frac{ \partial \sigma_{i_{2}} }{ \partial x_{2} }+\frac{ \partial i_{3} }{ \partial x_{3} } 
$$

Here.  $j$ Repeat, so we're... $j=1,2,3$ Make peace.
### Replace symbol (Permutation symbol)
We use replacement symbols to simplify expressions.$\epsilon_{ijk}$ The definition is as follows.
$$\epsilon_{ijk}=
\begin{cases}
\begin{aligned}
&1   && \text{当 } i,j,k \text{ 为正循环排列(偶排列)} \\
&-1  && \text{当 } i,j,k \text{ 为逆循环排列(奇排列)} \\
&0   && \text{当 } i,j,k \text{ 中有两个赋值相同时}
\end{aligned}
\end{cases}
$$

So, let's give you an example of the three-tier pattern of the replacement symbol expression. For the three-tier pattern, we have
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

So, we use replacement symbols to write $\epsilon_{ijk}a_{1i}a_{2j}a_{3k}$ Or... $\epsilon_{ijk}a_{i1}a_{j2}a_{k3}$ , of which $i,j,k=1,2,3$ 。

## definition of tensor
### View tensor and vectors from coordinate changes
If you're looking at a straight angle $Oxyz$ vector $\mathbf{r}$ The three fractions are $a_{1},a_{2},a_{3}$, and there is $\mathbf{r}=a_{1}i+a_{2}j+a_{3}k$. For another straightangle $Ox'y'z'$vector $\mathbf{r}$ It can be broken down into $a_{1}',a_{2}',a_{3}'$, and there is $\mathbf{r}=a_{1}'i'+a_{2}'j'+a_{3}'k'$We have, because of the objectivity of the vector.
$$
a_{1}i+a_{2}j+a_{3}k=a_{1}'i'+a_{2}'j'+a_{3}'k'
$$
Dots on the right and left $i',j',k'$ , and can get
$$
\begin{cases}
a_{1}'=a_{1}i\cdot i'+a_{2}j\cdot i'+a_{3}k\cdot i'=a_{1}l_{11}+a_{2}l_{12}+a_{3}l_{13} \\
a_{2}'=a_{1}i\cdot j'+a_{2}j\cdot j'+a_{3}k\cdot j'=a_{1}l_{21}+a_{2}l_{22}+a_{3}l_{23} \\
a_{3}'=a_{1}i\cdot k'+a_{2}j\cdot k'+a_{3}k\cdot k'=a_{1}l_{31}+a_{2}l_{32}+a_{3}l_{33} \\
\end{cases}
$$

and the matrix can be used to be
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

Use tensor to remember
$$
a_{i}'=l_{ij}a_{j}
$$
It can be set. $l_{ij}$ is the coordinates variant matrix or is called coordinates variant tensor.
$$l_{ij}=
\begin{pmatrix}
l_{11} & l_{12} & l_{13} \\
l_{21} & l_{22} & l_{23} \\
l_{31} & l_{32} & l_{33}
\end{pmatrix}
$$
By linear algebra, the inverse of the coordinates is equal to the conversion of the matrix
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
i.e.,$(l_{ij})^{-1}=(l_{ij})^{T}=l_{ij}$
### definition of tensor
Number of elements of the tansor element by space dimension $N$ and order $n$ A decision would be equal to $N^{n}$ . We can define tensor in three-dimensional straight-angle coordenate system.
- Zero-order tensor definition

Zero scale tensor is the mark, which is independent of the coordinate system and is not variable in coordinates changes.
- First-order definition of tensor

coordinate system $Oxyz$ Down array $T_{i}(i=1,2,3)$ Convert to $Ox'y'z'$ After the array is by $T_{i}(i=1,2,3)$ Change to $T_{i}'(i=1,2,3)$ , if the following relationships are satisfied before and after the change
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
i.e., $T_{i}'=l_{ij}T_{j}$ We'll call it a array. $T_{i}(i=1,2,3)$ is first-order tansor (vector).
- definition of second-order tensor

coordinate system $Oxyz$ Down array $T_{i}(i=1,2,3)$ Convert to $Ox'y'z'$ After the array is by $T_{i}(i=1,2,3)$ Change to $T_{i}'(i=1,2,3)$ , if the change is met before and after$T_{ij}'=l_{i m}l_{j n}T_{mn}$$ 或者 $$T_{ij}=l_{mi}l_{nj}T_{mn}'$$ 则我们称数组 $T_(i) $ is second-order tensor, using matrix, which is:

-  $n$ definition of steptensor

If there's a array, $T_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots,i_{n}=1,2,3)$ , the element of the array is obviously $3^{n}$ , if the new codestate system changes the array to$T'_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots,i_{n}=1,2,3)$, if the following relationships are satisfied before and after the change:
$$
T'_{i_{1}i_{2}\dots i_{n}}=l_{i_{1}j_{1}}l_{i_{2}}j_{2}\dots l_{i_{n}j_{n}}T_{j_{1}j_{2}\dots j_{n}}
$$
Or...
$$
T_{j_{1}j_{2}\dots j_{n}}=l_{j_{1}i_{1}}l_{j_{2}i_{2}}\dots l_{j_{n}i_{n}}T'_{j_{1}j_{2}\dots j_{n}}
$$
So, what's it called?$T_{i_{1}i_{2}\dots i_{n}}(i_{1},i_{2}\dots i_{n})$Yes.$n$Ordersor, which can also be expressed as$T_{i_{n}}$。
## Algebra operation for tensor
### Tensor's equal.
If two tensor $A$ and $B$ Under the same coordinates.**Same weights.**, and the two fractions are equal and are recorded as $A=B$.
### addition to tansor
If two tensor $A$ and $B$ That's the same sequence. They're in the same code.**Added by equivalents**The operation is called $A$ and $B$ ♪ And remember as $A+B$ .
### Tensor's Multiplier
Set $\lambda$ is a number (mark),$A$ Defines as any ranktensor $\lambda$ and $A$ The amount of the product $\lambda A$ New Tensor $B$ , and $B$ the fraction of the $\lambda$ Multiply $A$ Every fraction.
### Tensor's multiplier.
If $A$ Yes. $m$ And the ordersor, $B$ Yes. $n$ stepstensor, $AB$ They're defined as using**Each fraction of the first and the last fraction of the first tensor are multiplied separately.**, and can get $3^{m}\cdot 3^{n}=3^{m+n}$ Elements. They make up one. $m+n$ Steptensor.

The tensor multipliers are mainly of the following nature:
1. Tensor's laws:$(A+B)C=AC+BC$
2. The confluence of the tensor:$(AB)C=A(BC)$
3. Unsatisfied exchange rule:$AB\neq BA$
### Tensor shrinks and
Any $n$ Order$n\geq 2$Yes. $n$ A free subscript, erm...**Two of them were the same subscripts and thus agreed to make a peace.**, the rest of the freedom subscript remains unchanged, called the shrunk of the tensor. The operation can lower the original tensor by two steps, producing one. $n-2$ Step of the tensor.

For example, second-order tansor$\sigma_{ij}\to\sigma_{ii}=\sigma_{11}+\sigma_{22}+\sigma_{33}$, see the second-order tansor shrink and then become a zero-grade tensor; for the third tensor shrink$A_{ijk}\to A_{ijj}=A_{i 11}+A_{i 22}+A_{i 33}$And you can see that the third step tensor shrinks and then becomes one.

### tensor ' s inner volume (point multiplied)
Yes, sir. $A$ and $B$ and the two subscripts involved in the contraction are**Last subscript of the previous tensor and first subscript of the last tensor**, this operation is called the tensor's inner volume, and it is recorded as $A\cdot B$ We'll discuss the contents of the different steps:

- Two first-order tansor $A=A_{i}$ ，$B=B_{j}$, and $A\cdot B=A_{i}B_{i}$ The result is a metric.
- Two second-order tansor $A=A_{ij}$，$B=B_{kl}$ , and $A\cdot B=A_{ik}B_{kl}$ , the result is still a second-order tansor. The tansor point is actually a multiply of the matrix.

So, it is clear that the second step and above in the tensor buildup is not in conformity with the exchange law, but for two first-orderers.

### The symmetry and opposition of the tansor
- (a) Transposition of tensor: the operation of switching the order of two subscripts in tensor is called tensor conversion;

- Tensor symmetry: the conversion of tensor is equal to the original tensor, which is described as the tensor symmetry of the two subscripts, such as the four-step elasticity factor tensor $C_{ijkl}=C_{jikl}$ , the tensor is symmetrical to the first and second subscript.

- (a) Tensor ' s objection, which is known as the alternative to the original tensor, is known as the tensor ' s objection to the two subscripts;

- (a) Tensor: if it symmetricalizes either of the subscripts, the tensor is called tensor;

- Objection to tensor: If tensor objects to either of the subscripts, it is tensit to tensit to tensor;

So we have an important character: for any second-order tansor $A_{ij}$ ♪ I can always $A_{ij}$ Dissect To**A symmetry of tensor and a counter-centre of tensor**：
$$
A_{ij}=\frac{1}{2}(A_{ij}+A_{ji})+\frac{1}{2}(A_{ij}-A_{ji})
$$
The blogger writes:$\frac{1}{2}(A_{ij}+A_{ji})$ It's symmetrical. $\frac{1}{2}(A_{ij}-A_{ji})$ For counter-title tensor.
