export function handleCopy (textToCopy: string) {
    navigator.clipboard.writeText(textToCopy)
      .catch((err) => console.error("Failed to copy: ", err));
};