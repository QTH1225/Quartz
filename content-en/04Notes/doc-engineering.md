---
title: "Document Engineering: Introduction and Writing"
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
tags:
  - docs
  - document engineering
  - AI
translations:
  zh: /04notes/doc-engineering
lang: en-US
---

## Why Document Engineering Is Needed

Document engineering is not about producing files. It is about giving knowledge **structure, boundaries, an evolution path, and traceability**.

Documentation in most projects tends to drift toward two extremes:

1. There is almost no documentation, and knowledge lives only in code, chat records, and the minds of a few people.
2. Many documents exist, but they are only a pile of static files without clear responsibilities or an evolution mechanism.

This style of documentation greatly increases the cost for new project members to understand the system and get started. In today's AI-assisted development environment, this problem is amplified. Therefore, document engineering is not only meant to help people understand the overall architecture, process, and call relationships of a project. It is also meant to help AI understand project boundaries, clarify development goals, and reduce the probability of bugs. In other words, document engineering does not solve the problem of document quantity; it solves the problem of knowledge organization. It answers several questions:

1. What information should be recorded?
2. Where should that information be recorded?
3. When code or related business logic changes, which documents should change with it?

Therefore, document engineering should first satisfy structural design requirements, and only then should content be filled in.

## Layers of Document Engineering

### Specification Layer

This layer mainly answers:

- How should documents be written?
- How should directories be divided?
- Which changes should trigger documentation updates?
- Where should templates and constraints be placed?

The specification layer is not a project deliverable, nor is it a task record. It is an architectural constraint for all documentation and for the project itself.

### Process Layer

This layer mainly answers:

- What was done in this task?
- Which modules were affected by this change?
- What verification was performed?
- Did the change involve databases, interfaces, business rules, or technical architecture?

The process layer is not written for long-term external reading. It provides later reference and traceability evidence for development and execution.

### Product Layer

This layer mainly answers:

- What does the system currently expose externally?
- What are the interfaces, business rules, and architectural boundaries of a module?
- Which formal document should product, testing, implementation, and development teams read?

The product layer needs to be stable, clear, and readable, so that project members can understand it as quickly as possible. It should not mix in troubleshooting records, temporary decision fragments, or draft-style notes.

## Why the Three Layers Should Be Separated

These three layers should be written separately because they describe completely different and independent things. When we mix them together, **the project is no longer reasoned about cleanly**. Reasonability here means:

- When you see a change, you can know which type of document should be updated.
- When you see a document, you can know whether it describes a rule, a process, or a product.
- When you see a directory, you can know whom it serves.

The value of document engineering is built on this reasonability.

## Reference

1. [Linuxdo - I want to become a documentation expert](https://linux.do/t/topic/1725744)
