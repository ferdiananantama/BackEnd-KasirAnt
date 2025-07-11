import { Entity, IBaseDomainProperty } from "../entity";

export interface ICompany extends IBaseDomainProperty {
  name: string;
  logoPath: string | null | undefined;
  address: string;
}

export class Company extends Entity<ICompany> {
  private constructor(props: ICompany) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ICompany): Company {
    return new Company(props);
  }

  public unmarshal(): ICompany {
    return {
      id: this._id,
      name: this.props.name,
      logoPath: this.props.logoPath,
      address: this.props.address,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      deletedAt: this.props.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get logoPath(): string | null | undefined {
    return this.props.logoPath;
  }

  get address(): string {
    return this.props.address;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined | null {
    return this.props.deletedAt;
  }
}
