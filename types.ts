import { DefaultCtx, SessionContext, DefaultPublicData } from "blitz"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    userId: string,
    avatar: string,
    stripeId: string
  }
}
