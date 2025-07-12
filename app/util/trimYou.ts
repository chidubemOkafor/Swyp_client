export function trimYou(text: string) {
    return text.replace(/\(you\)/gi, '').trim();
}