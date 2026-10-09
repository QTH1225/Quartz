---
title: Elastoplasticity | Introduction and Basic Concepts
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: An introduction to elastoplasticity and its basic concepts.
published: 2025-11-19
tags:
- Mechanics
- Elastoplasticity
translations:
  zh: /02engineering/structure/plasticity-1
lang: en-US
---

## The study of the eliastoplasticity
### The concept of elasticity and plasticity -- what is plasticity?
Main study of elastoplasticity**Variable**Solids are suffering.**The outer load is in or the temperature changes.**And that's what happens when you have to do with the effects of the factors.**Stress, strain, displacement and its distribution patterns**A science. So what's the elastics and plastic mechanics that are included in this term?

Flexibility mainly addresses the question of the ideal elasticity in solid materials and the mechanics of the elastic transformation phase of solid materials, while the question of the mechanics of the plastic transformation phase of solid materials is addressed by the elasticity metchanics.

The object is often deformed through the elastic and plastic stages. Their concepts are as follows:

elastic phase: When the external force is less than a limit value (often called a elastic limit load), the object can recover its original shape after the external force that causes the deformation is removed. This recoverable transformation is called a elastic transformation, and the stage at which the object produces the elastic transformation is called a elastic phase.

Plastic phase: When the outer force exceeds the elastic limit load, then the discharge of the object cannot be restored to the state of the present state and a portion of the deformation cannot disappear, the permanent transformation that is retained is called a plastic transformation, which is called a plastic phase.

### The elastoplasticity subject -- what are we working on?
We have learned about material mechanics and structural mechanics, which study the various poles in the main engineering work, namely, one-dimensional components, while structural mechanics study the pole system.

For the elastoplasticity, the subjects studied are not subject to geometry and morphology, are able to adapt to the needs of engineering and technology issues and are more general physical structures.

## Elastoplastitice research thinking and methodology
### The analysis of the elastoplasticity
The basic idea of the solution to the problem is that
1. The object.**Geostatic Analysis**: what conditions should be met (static balance) when the object is in a balanced state of reaction
2. The object.**Geometric deformation analysis**: i.e. materials are continuous before and after deformation, no cracks or overlaps are created within the object, so what conditions are met for material deformation (geometric compatibility conditions)
3. The object's receptor and deformation.**Physical relationship analysis**: Solid material receptors produce corresponding deformations, so that different materials are subject to different deformations and different physical relationships, and how the physical relationship between force and deformation is described (the present equation)

## The basic hypothesis of elastoplasticity
In order to better define the nature of the subject and to delimit the scope of the study, the elalastaplasticity ignores minor, localized, and less influential factors and presents the following assumptions.
1. **Continuity assumptions**
Assuming that the substance is filled with the entire space occupied by the object without leaving any gaps. This is also a basic assumption of continuous medium mechanics, by which we can use a continuous function of coordinates to express the physical amount within the object.
2. **Equivalence assumption**
Assuming that the material is identical at each point within the object, the assumption specifies that the material ' s material material is not subject to the coordinates ' position.
3. **Same-sex assumptions, by sex**
Assuming that the physical properties of the direction of the points within the object are identical, the hypothesis specifies that the material ' s physical parameters will not vary according to the direction of the coordinates.
4. Simplified assumptions of the mechanics model
**Full flexibility.**Assumption: Assuming that the deformed object that causes the outer outer force of the object is capable of restitution and does not leave any residual deformation, and assuming that the material is subject to the law of Hook. The correspondence between stress and strain can be ensured at this time.

Plastics hypothesis:

5. **Small deformation**Assumptions
The transformation of an object by its external forces is much smaller than the original size before the object is deformed. First, it is possible to discuss the balance and deformation of the object.**No consideration of the size changes caused by the deformation**，**Analysis and calculation using original dimensions before the object is deformed**; second, it can be used to deduce formulae**Ignore the upper Quantum**, Simplified problem.

6. No starting stress hypothesis
Component has no start-up stress at the beginning
## Two important experiments.
### Metal polycrystal material monoaxis pull-off experiment
Set the axis of the test to $P$ , the initial length of the test is $l_{0}$, the length after deformation is $l$ , the initial cross-section area is $A_{0}$, the area to be crossed after the deformation $A$, and can be defined as$\sigma =P/A_{0}$, nominally strain is$\varepsilon=(l-l_{0})/l_{0}$

> Conclusions
> 1. In the plastic transformation of materials, there is no single correspondence between stressstrain and there is no direct function.$\varepsilon^p$w is internal variable, there is
>$$\varepsilon=\frac{\sigma}{E}+\varepsilon^p$$
>2. When in plastic stage loading, internal variables$\varepsilon^p$Growing, stress and strain are not linear relationships; when materials are uninloaded, the internal variable$\varepsilon^p$As constants, the time is linear between stress and strain.
### Bridgeman Still Water Pressure Experiment
Bridgeman conducted tests of metal material under static water pressure (all-round pressure) and found the following conclusions
1. For metal materials, the static water pressure and volume changes appear to be in line with linear elasticity;
2. The static water pressure is not related to the material yield limit.


## Simplified model for stressstrain
### Ideal plastic model (materials with lower intensity)


### Ideal plastic model (plastic transformation is much greater than elastic transformation)

### Linear Enhanced Plastic Model (bilinear Enhanced Model, for higher intensity)

### Linear Enhanced Plastic Model (reformable to ignore)
### Modular reinforcement model
The disadvantage of the model is that the rate of change at the point of origin is calculated as$\infty$, the completion effect is not good.
### General Loading Method
