export interface ResourceDetailModel {
    id: number;
    title: string;
    description: string;
    techical_data: [{label: string; value: string}];
    src: string;
}