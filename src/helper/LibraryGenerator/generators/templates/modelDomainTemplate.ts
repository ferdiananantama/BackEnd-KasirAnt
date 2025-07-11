const modelTemplate = `
import { Entity } from "./entity";

export interface I%%entityName%% {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class %%entityName%% extends Entity<I%%entityName%%> {
    constructor(props: I%%entityName%%) {
        super(props);
    }

    public static create(props: I%%entityName%%): %%entityName%% {
        return new %%entityName%%(props);
    }

    public unmarshal(): I%%entityName%% {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string | undefined {
        return this.props.id;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }
}
`;

module.exports = { modelTemplate };
