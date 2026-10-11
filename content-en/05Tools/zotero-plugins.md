---
title: A Detailed Guide to Zotero Plugins
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: A detailed guide to Zotero plugins and their installation.
published: 2026-03-09
tags:
- Zotero
translations:
  zh: /05tools/zotero-plugins
lang: en-US
---

# Detailed Guide for the Zoero Plugin

## General

Zotero is a powerful open source document management tool that can be greatly expanded by installing various plugins. This paper details the Zotero plugins used by the Atuthor, including functional descriptions, installation methods, use techniques and practical applications.

## Zotero 7.0.13

This is the main program version of Zotero. Version 7.0 is a major update of Zotero, moving from an XUL structure to WebExtension, bringing about performance enhancement and better compatibility. 64 versions make better use of memory and are suitable for handling a large number of references and PDF files.

**Download links:**
- [Zero Web download](https://www.zotero.org/)
- [Zotero Chinese Community](https://zotero-chinese.com/)
- [Introduction by PKMer_Zotero](https://pkmer.cn/Pkmer-Docs/11-zotero/zotero/)

**Installation method:**
1. Download installation packages for the corresponding operating system
2. Run installation program, complete installation as per the hint
3. Configure Synchronization Account on First Start (optional)
4. Install browser connector to retrieve literature from the web page

## Plugin Details
The Zotero plugins used by the author are described in detail below. These plugins play an important role in literature management and research, helping users to organize and utilize documentation resources more efficiently.
### General method for plugin installation
All plugins are installed similarly:
1. Download plugin xpi files
2. Open the Zotero  Tools  Plugins  Install Plugins
3. Select xpi files and install them
4. Reboot Zotero for effect

### 1. Action and Tags for Zotero 2.1.1
Action and Tags plugins are a powerful label management and batch operation tool that allows users to perform various automated operations based on labels. The plugin provides a batch label management function that quickly adds, deletes or changes labels to multiple document entries, while supporting conditions to perform such operations as moving literature to specific folders automatically according to label conditions. Smart label functions can automatically generate labels based on literature content, while label group management facilitates user classification management of labels, which greatly improves the efficiency of the documentation organization.

**Use:** Right-key literature selection "label operation" for batch processing
**Compatibility:** Zotero 6.x (Zotero 7 needs to check for updates)
**Apply:** Auto-classify Bibliography, Bulk Tag Management

### 2. Add-on Market for Zotero 2.1.1
Add-on Market is a built-in plugin market that allows users to browse, install, update and manage plugins directly in the Zotero interface. This plugin greatly simplifys the process of obtaining plugins, without having to download xpi files manually, and can only be deployed by clicking on the installation in the market. It can automatically detect plugin updates and provide a key update, while also supporting the viewing of installed plugins ' status and enable/disable management.

**Use:** Tools  Plugin  Market Tab
**Compatibility:** Zotero 6.x/7.x
**Apply:** Quick Discover and Install New Plugins

### 3. Better Notes for Zotero 2.5.1
Better Notes is a powerful notebook management plugin that provides a more abundant feature than the original Zotero notes. It fully supports Markdown grammar, which allows users to use standard Markdown tags to prepare formatted notes. The plugins internalize templates that users can create and use, and significantly improve the efficiency of notemaking. The Note Link function allows for linking notes to specific literature entries, while the Note Organization function supports the creation of notebook folders and hierarchical structures that facilitate the management of a large number of research notes.

**Use:** Right-key bibliographer Better Notes
**Compatibility:** Zotero 7.x
**Apply:** Read notes, study the books of thought

### 4. Del Item with Attachment 0.4.0
Del Item with Attachment plugin automatically removes the attachment file when deleting the document entry, avoiding the creation of isolated files that occupy storage space. This plugin addresses a painful point of the Zotero original removal function, i.e., that attachment files remain in the repository directory after deleting the document entry. It provides a secure confirmation dialogue box to prevent the user from deleting important documents while supporting the batch processing function, which allows the deletion of multiple document entries and their associated attachments at one time.

**Use:** Right key selects "Deleting Entry and Attachments"
**Compatibility:** Zotero 6.x (Zotero 7 may be integrated)
**Apply:** Clear duplicates and manage storage space

### 5. Easier Citation 0.5.0
The Easier Citation plugin simplifys the literature reference process and provides faster references to inserts. It quickly inserts references through shortcuts or right-click menus, which allow a preview of the reference format to ensure that the style meets the requirements. The plugin supports the batch reference function, which allows users to insert multiple references in one-time documents, thus greatly improving the efficiency of academic writing. The custom shortcut allows users to further optimize workflows by setting individualized reference shortcuts.

**Use:** Insert reference in shortcut or right-click menu
**Compatibility:** Zotero 6.x (to be accompanied by word-processing software)
**Apply:** Writing of papers, bulk reference management

### 6. Ethereal Reference 1.4.5
The plugin optimizes the visual presentation of the reference, allows users to create individualized styles of references that meet the format requirements of different academic journals. It provides the appropriate format for the various academic journals, while improving the format and quality of the reference exports and ensuring that the final output of the reference is professionally visible and standardized.

**Use:** Select Etheeal Styles by Reference Style Manager
**Compatibility:** Zotero 6.x/7.x
**Apply:** Formatting of academic papers, periodical fit-out

### 7. Ethereal Style 5.6.2
The Etheal Style is a GUI-beautiful plugin for Zotero, which provides rich themes and custom options. It supports the transition of multiple colour themes and interface styles, and users can choose different visual styles depending on their preferences. The plugin allows custom-defined interface fonts and sizes, adjusts the layout of the Zoero interface elements, and also provides dark mode support to protect users ' visual health during long periods of use. These glorification features not only enhance user experience but also make the research environment more personal.

**Use:** Configure the Etheeal Style options in settings
**Compatibility:** Zotero 7.x
**Apply:** Personalized interface, eye-guarding themes

### 8. Jasminum 1.1.17
Jasminum is a plugin designed for Chinese users, which optimizes the identification and management of Chinese literature. It automatically identifies and captures metadata from the web-based literature, optimizing the presentation of titles and author names in Chinese. The plugins are intelligently renaming PDF annexes according to the Chinese rules, supporting bulk processing of Chinese-language literature, and significantly improving the efficiency of Chinese literature management.

**Use:** Right-click after importing Chinese literature
**Compatibility:** Zotero 6.x (Zotero 7 Part Limited)
**Apply:** Chinese Document Management, WebIndition Import

### 9. Linter for Zotero 1.24.5
The Linter plugin is used to check and fix metadata problems in the literature entries to ensure the accuracy and consistency of the repository. It can scan the metadata integrity of the literature entries, identify possible duplicate entries, and provide a key to repair common metadata problem functions. The plugin also supports the standardization of formats, harmonizing author names, titles, etc., and helping users maintain a clean and standardized database of literature.

**Use:** Right-click Linter to check metadata
**Compatibility:** Zotero 6.x/7.x
**Apply:** Regular repository maintenance, metadata restoration

### 10. Sci-PDF 1.3.0
Sci-PDF focuses on the processing of scientific PDF files, providing enhanced PDF reading and content extraction. The plugin improves the PDF reading experience, providing better tagging tools and content extraction capabilities. It automatically extracts important elements such as graphs, formulas, and identifies references in PDFs, and integrates this information into Zotero. The enhanced PDF tagging allows users to manage reading notes and important information more effectively.

**Use:** Open PDF Use Enhancement Tool
**Compatibility:** Zotero 6.x
**Apply:** Scientific PDF processing, content extraction

### 11. Translate for Zotero 2.2.18
Translate plugins provide a translation function for the content of the literature, which helps users read foreign literature. They support the translation of titles and abstractes in Chinese, providing multilingual translation support, and allow users to translate multiple documents on a single basis. This plugin is particularly suitable for researchers who need to read a large amount of foreign literature and is able to quickly understand the main elements of the literature and improve reading efficiency.

**Use:** Right-click to select the translation function
**Compatibility:** Zotero 6.x (network connection required)
**Apply:** Foreign literature reading, bulk translation

### 12. Zoplicate 3.0.8
Zoplicate is dedicated to detecting and removing duplicate entries and maintaining the brevity of the repository. It identifies duplicate entries by smart algorithms, supports batch detection and deletion of duplicates by combining multiple entries. Users can set the sensitivity of duplicate tests and adjust the rules of the test to their individual needs. Regular use of Zoplicate can effectively clean duplicates imported from multiple databases and maintain the efficient operation of the repository.

**Use:** Run scan for duplicate entries
**Compatibility:** Zotero 6.x/7.x
**Apply:** Library clean-up, duplication

### 13. Zotero Attanger 1.3.5
Zotero Attanger is the attachment management tool, providing a powerful attachment organization and processing function. It supports bulk renaming of attachment files, collating of attachments ' storage locations, converting attachment formats and providing attachment usage statistics. This plugin addresses the shortcomings of Zotero in attachment management, allowing users to manage a large number of PDF and other attachment files more effectively, maintaining the standardization and rational storage structure of attachment naming.

**Use:** Selecting literature to use Attanger functionality
**Compatibility:** Zotero 6.x (Zotero 7 Part Integration)
**Apply:** Annex standardization, batch processing

### 14. Zotero Better Author 5.0.0
Better Author plugin optimizes the display and formatting of author names and provides more professional author information management. It harmonizes the display format of author names, intelligently parsing complex author names and supports bulk changes in author name formats. Users can create personalized author name formatting rules, especially suitable for handling multi-language author names with special characters. This plugin helps to enhance the professionalism and consistency of reference literature.

**Use:** Apply formatting after configuration preferences
**Compatibility:** Zotero 6.x/7.x
**Apply:** Standardized author name, multilingual processing

### 15. Zotero Debug Bridge 1.0
Debug Bridge is a tool for developing tools that are primarily used to debug Zotero and plugins. It provides detailed debugging logs and information to help locate plugin conflicts and errors and analyze Zotero performance problems. This plugin is primarily for developers and advanced users, providing debugging support for plugin development. When you have a plugin conflict or compatibility problem, the use of Debug Bridge can help to quickly locate the cause of the problem.

**Use:** Mainly used to develop debug scenes
**Compatibility:** Zoero 6.x (for developers)
**Apply:** Plugin debug, performance optimization

### 16. Zotero Reading List 1.5.10
Reading List plugins help users create and manage reading lists and plan reading progress. They can create lists of documents to read, mark the reading status of the literature, prioritize reading tasks, and provide reminder functions and timing.

**Use:** Create Read List Management Progress
**Compatibility:** Zotero 6.x/7.x
**Apply:** Research programmes, curriculum reading management

### 17. Zotero annotation manage 0.7.38
Annotation Manage plugin is dedicated to managing notes and labels in PDFs, providing a centralized comment management interface. It allows automatic extraction of all notes in PDF, provides a powerful comment search function based on literature or subject-organization notes, and supports exporting notes to available formats. This plugin allows users to centralize the reading notes of all literature, quickly search relevant notes on specific topics, and facilitates the extraction of key points and references for the paper.

**Use:** Open Annotation Manage
**Compatibility:** Zotero 6.x
**Apply:** Read Note Management, Comment Sum
