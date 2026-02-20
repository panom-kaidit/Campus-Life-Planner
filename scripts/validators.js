// validators.js

export const patterns = {
  title: /^\S(?:.*\S)?$/,
  duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i
};

export function validateTitle(value) {
  if (!patterns.title.test(value)) {
    return "Title cannot start or end with spaces.";
  }

  if (patterns.duplicateWord.test(value)) {
    return "Title contains duplicate consecutive words.";
  }

  return "";
}

export function validateDuration(value) {
  if (!patterns.duration.test(value)) {
    return "Enter a valid duration (positive number, up to 2 decimals).";
  }
  return "";
}

export function validateDate(value) {
  if (!patterns.date.test(value)) {
    return "Date must be in YYYY-MM-DD format.";
  }
  return "";
}

export function validateTag(value) {
  if (!patterns.tag.test(value)) {
    return "Tag may contain letters, spaces, or hyphens only.";
  }
  return "";
}