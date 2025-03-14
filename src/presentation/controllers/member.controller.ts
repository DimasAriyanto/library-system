import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckMemberUseCase } from '../../application/use-cases/check-member.use-case';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { ZodValidationPipe } from '../../shared/middleware/zod-validation.middleware';
import {
  CreateMemberDto,
  CreateMemberDtoClass,
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
  @ApiOperation({ summary: 'Tambah anggota baru ke sistem perpustakaan' })
  @ApiBody({
    type: CreateMemberDtoClass,
    description: 'Data anggota yang akan ditambahkan',
  })
  @ApiResponse({
    status: 201,
    description: 'Anggota berhasil ditambahkan.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Member "Angga" successfully added.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Data tidak valid.',
  })
  async addMember(
    @Body(new ZodValidationPipe(CreateMemberSchema)) dto: CreateMemberDto,
  ) {
    const result = await this.createMemberUseCase.execute(dto);
    return { status: 'success', message: result };
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
          code: { type: 'string', example: 'JK-45' },
          title: { type: 'string', example: 'Harry Potter' },
          author: { type: 'string', example: 'J.K Rowling' },
          availableStock: { type: 'number', example: 5 },
        },
      },
    },
  })
  async getMembers() {
    const result = await this.checkMemberUseCase.execute();
    return {
      status: 'success',
      message: 'Daftar anggota berhasil dimuat.',
      data: result,
    };
  }
}
