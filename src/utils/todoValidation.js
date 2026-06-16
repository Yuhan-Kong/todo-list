import DOMPurify from 'dompurify';

export function isValidTodoTitle(title) {
    return title.trim() !== '';
}

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};