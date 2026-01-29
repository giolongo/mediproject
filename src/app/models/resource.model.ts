export interface ResourceModel {
    id?: number;
    name: string;
    description: string;
    priority: number;
    details: {
        id?: number;
        label: string;
        description: string;
    }[];
    files?: ResourceFileModel[];
}

export interface ResourceFileModel {
    id: number;
    name: string;
    location: string;
}
