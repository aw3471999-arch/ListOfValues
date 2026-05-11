export interface FieldConfig{
    key : string;
    label : string;
    type: 'text' | 'dropdown' | 'image';
    required? : boolean;
    visibleInTable: boolean;
    visibleInDialog: boolean;
}

export const LOV_SCHEMA:FieldConfig[] = [
    { key: 'title', label: 'Title', type: 'text', required: true, visibleInTable: true, visibleInDialog: true },
  { key: 'titleArabic', label: 'Title Arabic', type: 'text', required: true, visibleInTable: true, visibleInDialog: true },
  { key: 'displayCategory', label: 'Category', type: 'dropdown', required: true, visibleInTable: true, visibleInDialog: true },
  { key: 'displayParent', label: 'Parent', type: 'dropdown', required: false, visibleInTable: true, visibleInDialog: true },
  { key: 'description', label: 'Description', type: 'text', required: true, visibleInTable: false, visibleInDialog: true },
  { key: 'descriptionArabic', label: 'Description Arabic', type: 'text', required: true, visibleInTable: false, visibleInDialog: true },
  { key: 'image', label: 'Image', type: 'image', required: true, visibleInTable: true, visibleInDialog: false },

];
