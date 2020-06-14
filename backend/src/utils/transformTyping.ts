// eslint-disable-next-line @typescript-eslint/no-explicit-any
type requestQueryValue = any;
// type requestQueryValue = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;

export const transformTypingRequest = (requestQueryValue: requestQueryValue): string | undefined => {
  return typeof requestQueryValue === "string" || typeof requestQueryValue === "undefined" ? requestQueryValue : undefined;
};
