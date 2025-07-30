export interface ResourceDetailModel {
    id: number;
    title: string;
    description: string;
    technical_data: [{label: string; value: string}];
    src: string;
}