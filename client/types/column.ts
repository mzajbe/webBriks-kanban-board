export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnPayload {
  name: string;
}

export interface UpdateColumnPayload {
  name: string;
}

export interface ReorderColumnsPayload {
  columnIds: string[];
}

export interface ColumnResponse {
  success: boolean;
  message: string;
  data: Column;
}

export interface ColumnsListResponse {
  success: boolean;
  message: string;
  data: Column[];
}
