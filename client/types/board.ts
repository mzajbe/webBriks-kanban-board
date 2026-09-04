export interface BoardOwner {
  id: string;
  name: string;
  email: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string | null;
  owner: BoardOwner;
  memberCount?: number;
  isOwner?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BoardMemberUser {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
}

export interface CreateBoardPayload {
  name: string;
  description?: string;
}

export interface UpdateBoardPayload {
  name?: string;
  description?: string;
}

export interface BoardResponse {
  success: boolean;
  message: string;
  data: Board;
}

export interface BoardsListResponse {
  success: boolean;
  message: string;
  data: Board[];
}

export interface BoardMembersResponse {
  success: boolean;
  message: string;
  data: BoardMemberUser[];
}

export interface AddMemberResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}
