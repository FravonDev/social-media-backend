import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateMessageDto {
    @IsUUID()
    recipientId: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(4096)
    text: string;
}