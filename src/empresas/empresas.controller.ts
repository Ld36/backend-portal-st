import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles, BadRequestException, Param, Patch, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { imageFileFilter } from './utils/file-upload.utils';
import { UserType } from '../common/decorators/user-type.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @ApiOperation({ summary: 'Realiza o cadastro de uma nova empresa' })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documento_obrigatorio', maxCount: 1 },
      { name: 'documento_opcional', maxCount: 1 },
    ], {
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por arquivo
    }),
  )
  async create(
    @Body() dto: CreateEmpresaDto,
    @UserType() userType: string, 
    @UploadedFiles() files: { documento_obrigatorio?: Express.Multer.File[], documento_opcional?: Express.Multer.File[] },
  ) {
    if (!files.documento_obrigatorio) {
      throw new BadRequestException('É necessário enviar os arquivos obrigatórios para prosseguir');
    }

    if (files.documento_opcional && 
        files.documento_obrigatorio[0].originalname === files.documento_opcional[0].originalname) {
      throw new BadRequestException('Arquivo duplicado');
    }

    return this.empresasService.create(dto, userType);
  }

  @ApiOperation({ summary: 'Lista todas as empresas para administração' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@UserType() userType: string) {
    if (userType !== 'interno') {
      throw new BadRequestException('Acesso negado para este perfil');
    }
    return this.empresasService.findAll();
  }
  
  @ApiOperation({ summary: 'Atualiza os dados de uma empresa' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: Partial<CreateEmpresaDto>) {
    return this.empresasService.update(id, dto);
  }

  @ApiOperation({ summary: 'Retorna estatísticas para o Dashboard' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/stats')
  async getStats() {
    return this.empresasService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Aprova uma empresa e atribui responsável' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/aprovar')
  async aprovar(
    @Param('id') id: number,
    @Body('responsavel_externo') responsavel: string,
    @UserType() userType: string,
  ) {
    if (userType !== 'interno') {
      throw new BadRequestException('Acesso negado: Requer perfil Interno ');
    }
    return this.empresasService.aprovar(id, responsavel);
  }

  @ApiOperation({ summary: 'Reprova uma empresa com justificativa' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reprovar')
  async reprovar(
    @Param('id') id: number,
    @Body('motivo') motivo: string,
    @UserType() userType: string,
  ) {
    if (userType !== 'interno') {
      throw new BadRequestException('Acesso negado: Requer perfil Interno ');
    }
    return this.empresasService.reprovar(id, motivo);
  }
}