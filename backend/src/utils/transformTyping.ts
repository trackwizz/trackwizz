// eslint-disable-next-line @typescript-eslint/no-explicit-any
type requestQueryValue = any;
// TODO : import QueryString so that any type can be removed and type can be as above
// type requestQueryValue = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;

export const transformTypingRequest = (requestQueryValue: requestQueryValue): string | undefined => {
  return typeof requestQueryValue === "string" || typeof requestQueryValue === "undefined" ? requestQueryValue : undefined;
};
