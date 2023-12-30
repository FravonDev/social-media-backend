import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CheckUsernameAvailabilityBody {
    @ApiProperty({
        description: 'username',
      })
      @IsNotEmpty()
      @IsString()
      username: string;
    
    
}