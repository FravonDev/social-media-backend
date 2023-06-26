import { IsUUID } from "class-validator";

export class readMessagesDto {
    @IsUUID()
    recipientId: string;
}