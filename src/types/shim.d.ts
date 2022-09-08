import { AttributifyAttributes } from "windicss/types/jsx";

declare module "*.vue" {
    type HTMLAttributes<T> = AttributifyAttributes;
}
