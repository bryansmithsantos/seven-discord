
export class EmbedParser {
    static parse(content: string): { embed: any, cleanContent: string } {
        const embed: any = {};
        let cleanContent = content;

        // 1. Simple Parser for our custom embed syntax (s.title -> EMBED_TITLE)
        const titleMatch = cleanContent.match(/EMBED_TITLE::(.*?)::END/s);
        if (titleMatch) {
            embed.title = titleMatch[1];
            cleanContent = cleanContent.replace(titleMatch[0], "");
        }

        const descMatch = cleanContent.match(/EMBED_DESC::(.*?)::END/s);
        if (descMatch) {
            embed.description = descMatch[1];
            cleanContent = cleanContent.replace(descMatch[0], "");
        }

        const colorMatch = cleanContent.match(/EMBED_COLOR::(.*?)::END/s);
        if (colorMatch) {
            embed.color = parseInt(colorMatch[1].replace("#", ""), 16);
            cleanContent = cleanContent.replace(colorMatch[0], "");
        }

        const imgMatch = cleanContent.match(/EMBED_IMAGE::(.*?)::END/s);
        if (imgMatch) {
            embed.image = { url: imgMatch[1] };
            cleanContent = cleanContent.replace(imgMatch[0], "");
        }

        const thumbMatch = cleanContent.match(/EMBED_THUMB::(.*?)::END/s);
        if (thumbMatch) {
            embed.thumbnail = { url: thumbMatch[1] };
            cleanContent = cleanContent.replace(thumbMatch[0], "");
        }

        const footerMatch = cleanContent.match(/EMBED_FOOTER::(.*?)::END/s);
        if (footerMatch) {
            embed.footer = { text: footerMatch[1] };
            cleanContent = cleanContent.replace(footerMatch[0], "");
        }

        const urlMatch = cleanContent.match(/EMBED_URL::(.*?)::END/s);
        if (urlMatch) {
            embed.url = urlMatch[1];
            cleanContent = cleanContent.replace(urlMatch[0], "");
        }

        const tsMatch = cleanContent.match(/EMBED_TIMESTAMP::(.*?)::END/s);
        if (tsMatch) {
            embed.timestamp = tsMatch[1] === "now" ? new Date().toISOString() : tsMatch[1];
            cleanContent = cleanContent.replace(tsMatch[0], "");
        }

        const authorMatch = cleanContent.match(/EMBED_AUTHOR::(.*?)::(.*?)::(.*?)::END/s);
        if (authorMatch) {
            embed.author = {
                name: authorMatch[1],
                icon_url: authorMatch[2] || undefined,
                url: authorMatch[3] || undefined
            };
            cleanContent = cleanContent.replace(authorMatch[0], "");
        }

        // Fields (Global Search)
        const fieldRegex = /EMBED_FIELD::(.*?)::(.*?)::(.*?)::END/gs;
        let fMatch;
        const fields = [];
        while ((fMatch = fieldRegex.exec(cleanContent)) !== null) {
            fields.push({
                name: fMatch[1],
                value: fMatch[2],
                inline: fMatch[3] === "true"
            });
        }
        if (fields.length > 0) embed.fields = fields;
        cleanContent = cleanContent.replace(fieldRegex, "");

        // Check if embed is empty
        if (Object.keys(embed).length === 0) {
            return { embed: null, cleanContent: content }; // Return original if no embed found
        }

        return { embed, cleanContent: cleanContent.trim() };
    }
}
