import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaidjs";
import remarkEmoji from "remark-emoji";
import DOMPurify from "dompurify";

export async function markdownParser(content: string): Promise<string> {
    const parseContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, {
            allowDangerousHtml: true,
        })
        .use(rehypeStringify, {
            allowDangerousHtml: true,
        })
        .use(rehypeHighlight, {
            plainText: ["mermaid", "txt", "text", "", "katex", "plain", "plaintext"],
        })
        .use(remarkMath)
        .use(rehypeKatex)
        .use(rehypeMermaid, {
            strategy: "inline-svg",
        })
        .use(remarkEmoji)
        .process(content)
        .catch((e) => {
            throw console.error(e);
        });

    //sanitize html
    const purify: string = DOMPurify.sanitize(String(parseContent), {
        FORBID_TAGS: ["script"],
        FORBID_ATTR: ["onclick"],
        ALLOW_UNKNOWN_PROTOCOLS: true,
    });

    return purify;
}
