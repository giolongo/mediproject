export interface ResourceModel {
    id: string;
    name: string;
    description: string;
    priority: number;
    details: {
        id: number;
        label: string;
        description: string;
    }[];
    files: {
        id: number;
        name: string;
        location: string;
        type: 'pdf' | 'image';
    }[];
}