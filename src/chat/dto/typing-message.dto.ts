import { IsUUID } from "class-validator";

export class TypingDto {
    @IsUUID()
    recipientId: string;
}