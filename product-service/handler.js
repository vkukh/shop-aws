import { handler as getProductsListHandler } from "./handlers/getProductsList.js";
import { handler as getProductsByIdHandler } from "./handlers/getProductsById.js";

export const getProductsList = getProductsListHandler;
export const getProductsById = getProductsByIdHandler;
