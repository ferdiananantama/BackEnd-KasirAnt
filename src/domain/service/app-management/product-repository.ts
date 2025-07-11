import { IProduct, Product } from "@/domain/models/app-management/product";
import BaseRepository from "../base-repository";

export interface ProductRepository extends BaseRepository<Product, IProduct> {}
