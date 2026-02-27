import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { imageFileFilter } from './utils/file-upload.utils';
import { UserType } from '../common/decorators/user-type.decorator'; // Ajuste o caminho se necessário

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documento_obrigatorio', maxCount: 1 },
      { name: 'documento_opcional', maxCount: 1 },
    ], {
      fileFilter: imageFileFilter, // Trata FE10 [cite: 118]
    }),
  )
  async create(
    @Body() dto: CreateEmpresaDto,
    @UserType() userType: string, // Utiliza o novo decorador customizado
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

  @Get()
  async findAll(@UserType() userType: string) {
    if (userType !== 'interno') {
      throw new BadRequestException('Acesso negado para este perfil');
    }
    return this.empresasService.findAll();
  }
}