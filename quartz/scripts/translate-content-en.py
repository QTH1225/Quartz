from __future__ import annotations

import os
import re
import shutil
import sys
from pathlib import Path
from typing import Iterable

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = PROJECT_ROOT / "content"
LEGACY_EN_ROOT = PROJECT_ROOT / "content-en"
OUTPUT_ROOT = PROJECT_ROOT / "quartz" / ".quartz-cache" / "content-en-generated"
RUNTIME_ROOT = PROJECT_ROOT / "quartz" / ".quartz-cache" / "translation-runtime"
HF_HOME = PROJECT_ROOT / "quartz" / ".quartz-cache" / "huggingface"

sys.path.insert(0, str(RUNTIME_ROOT))
os.environ.setdefault("HF_HOME", str(HF_HOME))
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

import yaml

MODEL_NAME = "Helsinki-NLP/opus-mt-zh-en"
FIELD_ORDER = [
    "title",
    "draft",
    "author",
    "authorLink",
    "description",
    "published",
    "tags",
    "aliases",
    "pinned",
    "image",
    "translations",
    "lang",
]
IGNORED_PARTS = {".obsidian", "Attachments", "Template"}
CJK_RE = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff]")
GLOSSARY = {
    "中国矿业大学": "China University of Mining and Technology",
    "力学与土木工程学院": "School of Mechanics and Civil Engineering",
    "硕士研究生": "master's student",
    "毕业设计": "undergraduate thesis project",
    "毕设": "undergraduate thesis project",
    "弹塑性力学": "elastoplasticity",
    "塑性力学": "plasticity mechanics",
    "张量分析": "tensor analysis",
    "二阶张量": "second-order tensor",
    "一阶张量": "first-order tensor",
    "张量": "tensor",
    "应力": "stress",
    "应变": "strain",
    "下标": "subscript",
    "本构关系": "constitutive relation",
    "坐标系": "coordinate system",
    "克罗内克": "Kronecker",
    "排列符号": "permutation symbol",
    "屈服": "yield",
    "水工碾压混凝土": "hydraulic roller-compacted concrete",
    "碾压混凝土": "roller-compacted concrete",
    "混凝土": "concrete",
    "含气量": "air content",
    "水泥水化": "cement hydration",
    "水泥基": "cement-based",
    "聚合物改性": "polymer-modified",
    "超级电容器": "supercapacitor",
    "剪力墙": "shear wall",
    "建筑图": "architectural drawing",
    "配筋": "reinforcement detailing",
    "结构工程": "structural engineering",
    "文档工程": "document engineering",
    "科研笔记": "research notes",
    "美赛": "MCM/ICM",
    "图床": "image hosting",
    "小狼毫输入法": "Weasel input method",
    "小狼毫": "Weasel",
    "尹世平": "Shiping Yin",
    "乔亚宁": "Yaning Qiao",
    "秦天浩": "Tianhao Qin",
    "博主": "the author",
    "代码块": "code block",
}
TITLE_OVERRIDES = {
    "index.md": "Welcome to Tianhao's Lab",
    "00Aboutme/AboutSite.md": "About This Site",
    "00Aboutme/Awards.md": "Awards and Honors",
    "00Aboutme/Hobbies.md": "Hobbies",
    "00Aboutme/index.md": "About Me",
    "00Aboutme/MyCV.md": "Curriculum Vitae",
    "00Aboutme/Papers.md": "Publications",
    "00Aboutme/Projects.md": "Projects",
    "05Tools/claude-code-config.md": "A Simple Claude Code Configuration",
    "01Code/github-profile.md": "Configuring a GitHub Profile",
    "01Code/index.md": "Code and Development",
    "01Code/latex-notes.md": "LaTeX Notes I",
    "05Tools/latex-snippets.md": "Using Snippets in LaTeX",
    "05Tools/linux-setup.md": "Getting Started with Linux",
    "01Code/markdown-basics.md": "Markdown Writing and Extended Syntax",
    "05Tools/mcm-template.md": "An EasyMCM-based LaTeX Template for MCM/ICM",
    "05Tools/obsidian-mizuki.md": "Publishing a Blog with Obsidian and Mizuki",
    "05Tools/pc-software.md": "Recommended PC Software",
    "05Tools/piclist-github.md": "Setting Up PicList with GitHub as an Image Host",
    "05Tools/rime-input.md": "Configuring the Weasel Input Method",
    "05Tools/terminal-config.md": "Configuring Windows Terminal",
    "05Tools/word-layout.md": "The Art of Word Typesetting",
    "02Engineering/index.md": "Engineering",
    "02Engineering/Materials/cement-battery.md": "Concepts and Background of Cement-Based Batteries",
    "02Engineering/Materials/cement-hydration.md": "Cement Hydration Process and Products",
    "02Engineering/Materials/index.md": "Composite Materials",
    "02Engineering/Materials/polymer-cement.md": "Polymer-Modified Cement-Based Materials",
    "02Engineering/Materials/rcc-air-content.md": "Test | Measuring Air Content in Hydraulic Roller-Compacted Concrete",
    "02Engineering/Materials/supercapacitor-basics.md": "Supercapacitor Fundamentals",
    "02Engineering/Structure/ansys-notes.md": "ANSYS Study Notes I",
    "02Engineering/Structure/drawing-notes.md": "Architectural Drawing Notes",
    "02Engineering/Structure/index.md": "Structural Engineering",
    "02Engineering/Structure/plasticity-1.md": "Elastoplasticity | Introduction and Basic Concepts",
    "02Engineering/Structure/plasticity-2.md": "Elastoplasticity | An Introduction to Tensor Analysis",
    "02Engineering/Structure/plasticity-3.md": "Elastoplasticity | Stress Analysis",
    "02Engineering/Structure/shear-wall-layout.md": "Shear Wall Layout Requirements",
    "03Notes/ask-questions.md": "Reading | The Art of Asking Questions",
    "03Notes/citespace-notes.md": "Bibliometrics I | Using CiteSpace",
    "01Code/doc-engineering.md": "Introduction to Document Engineering and How to Write Documents",
    "01Code/doc-project.md": "Building a Document Engineering Project",
    "01Code/harness-engineering.md": "Harness Engineering: A Comprehensive Overview",
    "03Notes/index.md": "Research Notes",
    "03Notes/Signs of AI writing.md": "Signs of AI Writing",
    "05Tools/zotero-plugins.md": "A Detailed Guide to Zotero Plugins",
    "04Blog/23-birthday.md": "At 23 | Staying Curious, Trying, and Moving Forward",
    "04Blog/index.md": "Personal Essays",
    "04Blog/reflections-on-the-ai-era.md": "Reflections on the AI Era",
    "04Blog/treasure-in-the-tomb.md": "Fable | Treasure in the Tomb",
    "04Blog/weisheng-holds-the-bridge-pillar.md": "Flash Fiction | Weisheng Holds the Bridge Pillar",
    "05Tools/index.md": "Tools and Practice",
    "06Misc/index.md": "Miscellaneous",
}
DESCRIPTION_OVERRIDES = {
    "00Aboutme/AboutSite.md": "Information about this site.",
    "00Aboutme/Awards.md": "Competitions I have participated in and honors I have received.",
    "00Aboutme/Hobbies.md": "A brief overview of my hobbies.",
    "00Aboutme/MyCV.md": "A concise overview of my education, experience, and achievements.",
    "00Aboutme/Papers.md": "A list of my publications.",
    "00Aboutme/Projects.md": "Projects I have participated in.",
    "05Tools/claude-code-config.md": "Notes on a simple Claude Code configuration.",
    "01Code/github-profile.md": "How to create an attractive GitHub profile.",
    "05Tools/linux-setup.md": "Installing Linux and completing the basic setup.",
    "01Code/markdown-basics.md": "A quick reference for Markdown basics, extended syntax, and Mermaid diagrams.",
    "05Tools/mcm-template.md": "A comprehensive EasyMCM-based MCM/ICM template with multiple typesetting options.",
    "05Tools/obsidian-mizuki.md": "A workflow for publishing a blog with Obsidian and Mizuki.",
    "05Tools/pc-software.md": "Recommended desktop software for everyday use.",
    "05Tools/terminal-config.md": "Notes on configuring Windows Terminal.",
    "05Tools/word-layout.md": "Practical techniques for professional typesetting in Microsoft Word.",
    "02Engineering/Materials/rcc-air-content.md": "Principles and procedures for measuring the air content of roller-compacted concrete.",
    "02Engineering/Structure/plasticity-1.md": "An introduction to elastoplasticity and its basic concepts.",
    "02Engineering/Structure/plasticity-2.md": "An introduction to tensor analysis for elastoplasticity.",
    "02Engineering/Structure/plasticity-3.md": "Notes on stress analysis in elastoplasticity.",
    "03Notes/ask-questions.md": "How to ask better questions and obtain useful answers.",
    "05Tools/zotero-plugins.md": "A detailed guide to Zotero plugins and their installation.",
    "04Blog/23-birthday.md": "Reflections on my twenty-third year and a reminder to keep moving forward at my own pace.",
}
INLINE_RE = re.compile(
    r"!?\[[^\]]*\]\([^)]+\)"
    r"|!?\[\[[^\]]+\]\]"
    r"|`+[^`\n]*`+"
    r"|\$[^$\n]+\$"
    r"|https?://[^\s<>]+"
    r"|<[^>]+>"
    r"|\[![^\]]+\]"
    r"|[*_~]{1,3}"
    r"|\|"
)


def split_frontmatter(source: str) -> tuple[dict, str]:
    match = re.match(r"^---\r?\n(.*?)\r?\n---(?:\r?\n|$)(.*)$", source, re.S)
    if not match:
        raise ValueError("missing YAML frontmatter")
    return yaml.safe_load(match.group(1)) or {}, match.group(2)


def page_url(relative_path: Path, english: bool = False) -> str:
    parts = list(relative_path.with_suffix("").parts)
    slug_parts = [re.sub(r"\s+", "-", part).lower() for part in parts]
    if slug_parts[-1] == "index":
        slug_parts.pop()
        suffix = "/"
    else:
        suffix = ""
    prefix = "/en/" if english else "/"
    path_value = "/".join(slug_parts)
    return f"{prefix}{path_value}{suffix}" if path_value else prefix


def legacy_relative_path(relative_path: Path) -> Path | None:
    # Prefer the current mirrored layout so future runs reuse reviewed English notes.
    if (LEGACY_EN_ROOT / relative_path).exists():
        return relative_path
    parts = list(relative_path.parts)
    if not parts:
        return None
    if parts == ["index.md"]:
        return Path("index.md")
    mappings = {
        "01Code": "01Code",
        "03Notes": "04Notes",
        "04Blog": "05Random",
        "06Misc": "06Misc",
    }
    if parts[0] == "02Engineering" and len(parts) > 1:
        if parts[1] == "Materials":
            return Path("02Composite", *parts[2:])
        if parts[1] == "Structure":
            return Path("03Construction", *parts[2:])
        return None
    if parts[0] in mappings:
        mapped = Path(mappings[parts[0]], *parts[1:])
        if relative_path.as_posix() == "03Notes/ask-questions.md":
            return Path("04Notes/question-guide.md")
        return mapped
    return None


def markdown_files() -> list[Path]:
    files = []
    for file_path in CONTENT_ROOT.rglob("*.md"):
        relative = file_path.relative_to(CONTENT_ROOT)
        if any(part in IGNORED_PARTS for part in relative.parts):
            continue
        if relative.as_posix().startswith("03Notes/文献精读/"):
            continue
        files.append(file_path)
    return sorted(files)


class Translator:
    def __init__(self) -> None:
        import torch
        from transformers import MarianMTModel, MarianTokenizer

        print("Loading local translation model...", flush=True)
        self.torch = torch
        self.tokenizer = MarianTokenizer.from_pretrained(MODEL_NAME, local_files_only=True)
        self.model = MarianMTModel.from_pretrained(MODEL_NAME, local_files_only=True)
        self.model.eval()
        self.cache: dict[str, str] = {}

    @staticmethod
    def apply_glossary(text: str) -> str:
        for chinese, english in GLOSSARY.items():
            text = text.replace(chinese, english)
        return text

    @staticmethod
    def chunks(text: str, limit: int = 220) -> list[str]:
        if len(text) <= limit:
            return [text]
        sentences = re.split(r"(?<=[。！？；.!?;])", text)
        chunks: list[str] = []
        current = ""
        for sentence in sentences:
            if len(current) + len(sentence) <= limit:
                current += sentence
                continue
            if current:
                chunks.append(current)
            while len(sentence) > limit:
                split_at = sentence.rfind("，", 0, limit)
                if split_at < limit // 2:
                    split_at = sentence.rfind(",", 0, limit)
                if split_at < limit // 2:
                    split_at = limit
                else:
                    split_at += 1
                chunks.append(sentence[:split_at])
                sentence = sentence[split_at:]
            current = sentence
        if current:
            chunks.append(current)
        return chunks

    def translate_batch(self, texts: Iterable[str]) -> None:
        pending = []
        for text in texts:
            prepared = self.apply_glossary(text)
            if CJK_RE.search(prepared):
                pending.extend(chunk for chunk in self.chunks(prepared) if chunk not in self.cache)
        pending = list(dict.fromkeys(pending))
        for start in range(0, len(pending), 16):
            batch = pending[start : start + 16]
            encoded = self.tokenizer(
                batch,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512,
            )
            with self.torch.inference_mode():
                generated = self.model.generate(**encoded, max_length=384, num_beams=1)
            decoded = self.tokenizer.batch_decode(generated, skip_special_tokens=True)
            self.cache.update(zip(batch, decoded, strict=True))

    def translate(self, text: str) -> str:
        if not CJK_RE.search(text):
            return text
        leading = text[: len(text) - len(text.lstrip())]
        trailing = text[len(text.rstrip()) :]
        core = self.apply_glossary(text.strip())
        if not CJK_RE.search(core):
            return f"{leading}{core}{trailing}"
        pieces = self.chunks(core)
        self.translate_batch(pieces)
        translated = " ".join(self.cache.get(piece, piece) for piece in pieces)
        return f"{leading}{translated}{trailing}"


def line_tokens(line: str) -> list[tuple[str, str]]:
    prefix_match = re.match(r"^(\s*(?:(?:#{1,6}|>|[-+*]|\d+\.)\s+)+)", line)
    tokens: list[tuple[str, str]] = []
    position = 0
    if prefix_match:
        tokens.append(("literal", prefix_match.group(1)))
        position = prefix_match.end()

    for match in INLINE_RE.finditer(line, position):
        if match.start() > position:
            tokens.append(("translate", line[position : match.start()]))
        value = match.group(0)
        markdown_link = re.fullmatch(r"(!?)\[([^\]]*)\]\(([^)]+)\)", value)
        wiki_link = re.fullmatch(r"(!?)\[\[([^\]]+)\]\]", value)
        if markdown_link:
            tokens.append(("literal", f"{markdown_link.group(1)}["))
            tokens.append(("translate", markdown_link.group(2)))
            tokens.append(("literal", f"]({markdown_link.group(3)})"))
        elif wiki_link and "|" in wiki_link.group(2):
            target, alias = wiki_link.group(2).split("|", 1)
            tokens.append(("literal", f"{wiki_link.group(1)}[[{target}|"))
            tokens.append(("translate", alias))
            tokens.append(("literal", "]]"))
        else:
            tokens.append(("literal", value))
        position = match.end()
    if position < len(line):
        tokens.append(("translate", line[position:]))
    return tokens


def translate_body(body: str, translator: Translator) -> str:
    prepared: list[list[tuple[str, str]]] = []
    translatable: list[str] = []
    in_fence = False
    fence_character = ""
    in_math = False

    for line in body.splitlines(keepends=True):
        content = line.rstrip("\r\n")
        ending = line[len(content) :]
        fence = re.match(r"^\s*(`{3,}|~{3,})", content)
        if fence:
            character = fence.group(1)[0]
            if not in_fence:
                in_fence = True
                fence_character = character
            elif character == fence_character:
                in_fence = False
            prepared.append([("literal", line)])
            continue
        if in_fence:
            prepared.append([("literal", line)])
            continue
        if content.strip().startswith("$$"):
            if content.strip().count("$$") < 2:
                in_math = not in_math
            prepared.append([("literal", line)])
            continue
        if in_math:
            prepared.append([("literal", line)])
            continue
        tokens = line_tokens(content)
        if ending:
            tokens.append(("literal", ending))
        prepared.append(tokens)
        translatable.extend(value for kind, value in tokens if kind == "translate" and CJK_RE.search(value))

    translator.translate_batch(translatable)
    output = []
    for tokens in prepared:
        output.append(
            "".join(translator.translate(value) if kind == "translate" else value for kind, value in tokens)
        )
    return "".join(output)


def legacy_content(relative_path: Path) -> tuple[dict, str] | None:
    legacy_relative = legacy_relative_path(relative_path)
    if legacy_relative is None:
        return None
    legacy_path = LEGACY_EN_ROOT / legacy_relative
    if not legacy_path.exists():
        return None
    return split_frontmatter(legacy_path.read_text(encoding="utf-8-sig"))


def reusable_legacy_body(chinese_body: str, legacy_body: str) -> bool:
    chinese_length = len(chinese_body.strip())
    legacy_length = len(legacy_body.strip())
    if chinese_length < 100:
        return legacy_length > 0 or chinese_length == 0
    return legacy_length >= max(120, int(chinese_length * 0.55))


def ordered_frontmatter(data: dict) -> dict:
    ordered = {key: data[key] for key in FIELD_ORDER if key in data}
    ordered.update({key: value for key, value in data.items() if key not in ordered})
    return ordered


def translate_frontmatter(
    chinese: dict,
    legacy: dict | None,
    relative_path: Path,
    translator: Translator,
) -> dict:
    result = dict(chinese)
    legacy = legacy or {}
    relative_key = relative_path.as_posix()
    result["title"] = TITLE_OVERRIDES.get(relative_key) or legacy.get("title") or translator.translate(
        str(chinese.get("title", ""))
    )
    if chinese.get("description"):
        legacy_description = legacy.get("description")
        result["description"] = DESCRIPTION_OVERRIDES.get(relative_key) or (
            legacy_description
            if isinstance(legacy_description, str)
            and not re.match(r"^(?:your description|todo|tbd)", legacy_description, re.I)
            else translator.translate(str(chinese["description"]))
        )
    if isinstance(chinese.get("tags"), list):
        legacy_tags = legacy.get("tags")
        result["tags"] = (
            legacy_tags
            if isinstance(legacy_tags, list) and len(legacy_tags) == len(chinese["tags"])
            else [translator.translate(str(tag)) for tag in chinese["tags"]]
        )
    result["translations"] = {"zh": page_url(relative_path, english=False)}
    result["lang"] = "en-US"
    return ordered_frontmatter(result)


def finalize_existing_output() -> None:
    changed = 0
    for chinese_path in markdown_files():
        relative_path = chinese_path.relative_to(CONTENT_ROOT)
        output_path = OUTPUT_ROOT / relative_path
        if not output_path.exists():
            raise FileNotFoundError(f"Missing generated English file: {relative_path.as_posix()}")
        chinese_frontmatter, _ = split_frontmatter(chinese_path.read_text(encoding="utf-8-sig"))
        english_frontmatter, english_body = split_frontmatter(output_path.read_text(encoding="utf-8-sig"))
        relative_key = relative_path.as_posix()
        english_frontmatter["title"] = TITLE_OVERRIDES[relative_key]
        if chinese_frontmatter.get("description"):
            english_frontmatter["description"] = DESCRIPTION_OVERRIDES[relative_key]
        english_frontmatter["translations"] = {"zh": page_url(relative_path, english=False)}
        english_frontmatter["lang"] = "en-US"
        english_body = (
            english_body.replace("/attachments/04notes/", "/attachments/03notes/")
            .replace("/attachments/01dev/", "/attachments/01code/")
            .replace("/Attachments/04Notes/", "/Attachments/03Notes/")
            .replace("Attachments/04Notes/", "Attachments/03Notes/")
            .replace("../Attachments/01Dev/", "../Attachments/01Code/")
        )
        yaml_text = yaml.safe_dump(
            ordered_frontmatter(english_frontmatter),
            allow_unicode=True,
            sort_keys=False,
            width=10_000,
        ).rstrip()
        output_path.write_text(f"---\n{yaml_text}\n---\n\n{english_body.lstrip()}", encoding="utf-8")
        changed += 1
    print(f"Finalized {changed} generated English files.", flush=True)


def main() -> None:
    if "--finalize-only" in sys.argv[1:]:
        finalize_existing_output()
        return
    files = markdown_files()
    resume = "--resume" in sys.argv[1:]
    if OUTPUT_ROOT.exists() and not resume:
        shutil.rmtree(OUTPUT_ROOT)
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    translator = Translator()
    reused = 0
    translated = 0

    for index, chinese_path in enumerate(files, start=1):
        relative_path = chinese_path.relative_to(CONTENT_ROOT)
        output_path = OUTPUT_ROOT / relative_path
        if resume and output_path.exists():
            print(f"[{index:02d}/{len(files)}] skip      {relative_path.as_posix()}", flush=True)
            continue
        chinese_frontmatter, chinese_body = split_frontmatter(
            chinese_path.read_text(encoding="utf-8-sig")
        )
        legacy = legacy_content(relative_path)
        legacy_frontmatter, legacy_body = legacy if legacy else ({}, "")
        if legacy and reusable_legacy_body(chinese_body, legacy_body):
            english_body = legacy_body
            reused += 1
            method = "reuse"
        else:
            english_body = translate_body(chinese_body, translator)
            translated += 1
            method = "translate"

        english_frontmatter = translate_frontmatter(
            chinese_frontmatter,
            legacy_frontmatter,
            relative_path,
            translator,
        )
        yaml_text = yaml.safe_dump(
            english_frontmatter,
            allow_unicode=True,
            sort_keys=False,
            width=10_000,
        ).rstrip()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(f"---\n{yaml_text}\n---\n\n{english_body.lstrip()}", encoding="utf-8")
        print(f"[{index:02d}/{len(files)}] {method:9s} {relative_path.as_posix()}", flush=True)

    print(
        f"Generated {len(files)} English files: reused {reused}, translated {translated}.\n"
        f"Staging directory: {OUTPUT_ROOT}",
        flush=True,
    )


if __name__ == "__main__":
    main()
