import { IsUUID } from "class-validator";

export class GetChatMessagesDto {
    @IsUUID()
    recipientId: string;
}