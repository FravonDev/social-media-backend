import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CheckUsernameDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    @ApiProperty({ description: 'The username to check' })
    username: string;
}  
