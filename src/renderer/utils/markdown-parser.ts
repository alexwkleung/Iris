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

/**
 * @param content HTML string to sanitize
 * @returns Sanitized HTML string
 */
function sanitizeHtml(content: string): string {
    return DOMPurify.sanitize(String(content), {
        FORBID_TAGS: ["script", "button", "iframe", "style"],
        FORBID_ATTR: ["onclick"],
        //https://github.com/cure53/DOMPurify#control-permitted-attribute-values
        ALLOWED_URI_REGEXP: new RegExp(/^(?:(?:(?:f|ht)tps?|local|):|[^a-z]|[a-z+./-]+(?:[^a-z+.\-:]|$))/i),
    });
}

/**
 * @param content Markdown string to parse into HTML
 * @returns Sanitized HTML string of parsed Markdown
 */
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
            ignoreMissing: true,
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

    return sanitizeHtml(String(parseContent));
}
