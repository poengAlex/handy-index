import type { MessageSchema } from "./index";

// Teaches `$t` / `t` the real key set: a typo is a compile error and editors
// autocomplete the namespaces.
declare module "vue-i18n" {
  // oxlint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
