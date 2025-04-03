export class CreateCommentDto {
  text: string;
  rating?: number;
  buildId: string;
  userId: string;
}
