import { IsNumber, IsUUID, Min } from "class-validator";

export class GetChatMessagesDto {
    @IsUUID()
    recipientId: string;

    @IsNumber()
    @Min(1)
    @Min(50)
    offset: number;

    @IsNumber()
    @Min(1)
    @Min(50)
    limit: number;
}