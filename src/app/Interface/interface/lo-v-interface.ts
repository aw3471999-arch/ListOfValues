export interface LovType {
  lovTypeId: number;
  title: string;
  titleArabic?: string;
  description?: string;
  descriptionArabic?: string;
  status?: string;
}

export interface LovItem {
  lovId: number;
  lovTypeId: LovType | number;
  parentLovId?: LovItem | number | null;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  status: string;
  displayCategory?: string;
  displayParent?: string;
}

export interface ApiResponse<T> {
  data: T[];
  message?: string;
  status?: string;
}

export interface LoginResponse {
  data: {
    verification: {
      token: string;
      case?: string;
    };
  }[];
}
