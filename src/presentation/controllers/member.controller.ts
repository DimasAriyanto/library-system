import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckMemberUseCase } from '../../application/use-cases/check-member.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { ZodValidationPipe } from '../../shared/middleware/zod-validation.middleware';
import {
  CreateMemberDto,
  CreateMemberSchema,
} from '../../application/dtos/create-member.dto';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(
    private readonly checkMemberUseCase: CheckMemberUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
  ) {}

  @Post('/add')
  async addMember(
    @Body(new ZodValidationPipe(CreateMemberSchema)) dto: CreateMemberDto,
  ) {
    return this.createMemberUseCase.execute(dto);
  }

  @Get('/check')
  @ApiOperation({ summary: 'Cek daftar anggota yang terdaftar' })
  @ApiResponse({
    status: 200,
    description: 'Daftar buku berhasil dimuat.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'B001' },
          title: { type: 'string', example: 'Laskar Pelangi' },
          author: { type: 'string', example: 'Andrea Hirata' },
          availableStock: { type: 'number', example: 5 },
        },
      },
    },
  })
  async getMembers() {
    return this.checkMemberUseCase.execute();
  }
}
