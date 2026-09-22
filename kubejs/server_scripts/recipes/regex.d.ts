export type CaptureGroupsFor<S extends string> = { [K in ParseRegexCapture<S, never>]: string };

export type ParseRegexCapture<
  String extends string,
  Groups extends string,
> = String extends `${string}(?<${infer GroupName}>${infer Rest}`
  ? ParseRegexCapture<Rest, Groups | GroupName>
  : Groups;
