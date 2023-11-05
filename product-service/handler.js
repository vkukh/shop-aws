import { handler as getProductsListHandler } from "./handlers/getProductsList.mjs";
import { handler as getProductsByIdHandler } from "./handlers/getProductsById.mjs";
import { handler as createProductHandler } from "./handlers/createProduct.mjs";
import { handler as catalogBatchProcessHandler } from './handlers/catalogBatchProcess.mjs';

export const getProductsList = getProductsListHandler;
export const getProductsById = getProductsByIdHandler;
export const createProduct = createProductHandler;
export const catalogBatchProcess = catalogBatchProcessHandler;
