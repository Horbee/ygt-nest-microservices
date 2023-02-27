export interface AttachmentDto {
  id: string;
  public_id: string;
  width: number | null;
  height: number | null;
  format: string;
  resource_type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
