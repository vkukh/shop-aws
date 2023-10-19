import { handler as getProductsListHandler } from "./handlers/getProductsList.mjs";
import { handler as getProductsByIdHandler } from "./handlers/getProductsById.mjs";
import { handler as createProductHandler } from "./handlers/createProduct.mjs";

export const getProductsList = getProductsListHandler;
export const getProductsById = getProductsByIdHandler;
export const createProduct = createProductHandler;
