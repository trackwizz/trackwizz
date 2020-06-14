import QueryString from "qs";

type requestQueryValue = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;

export const transformTypingRequest = (requestQueryValue: requestQueryValue): string | undefined => {
  return typeof requestQueryValue === "string" || typeof requestQueryValue === "undefined" ? requestQueryValue : undefined;
};
