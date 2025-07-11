import { Company, ICompany } from "@/domain/models/app-management/company";
import BaseRepository from "../base-repository";
import { BaseQueryOption } from "../types";

export interface CompanyRepository extends BaseRepository<Company, ICompany> {
  seedCompany(option: Partial<BaseQueryOption>): Promise<void>;
}
