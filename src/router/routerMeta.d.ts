// This can be directly added to any of your `.ts` files like `router.ts`
// It can also be added to a `.d.ts` file, in which case you will need to add an export
// to ensure it is treated as a module
export {};

import 'vue-router';

import { ListDataTypesFunctions, ObjectDataTypes, ObjectDataSaveFunctions, ObjectDataTypesFunctions, type RouteLink } from "src/logic/types";
import { CancelablePromise, Partner } from 'src/api/_SCRIPTAPI_ADM';
import { PartnerVideo } from 'src/_SCRIPTAPIINDEX';

declare module 'vue-router' {
  interface RouteMeta {
	video?: PartnerVideo
  }
}
