import { Category, ICategory } from "@/domain/models/app-management/category";
import BaseRepository from "../base-repository";

export interface CategoryRepository
  extends BaseRepository<Category, ICategory> {}
