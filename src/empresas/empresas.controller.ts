import { Controller, Post, Body, Headers, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { imageFileFilter } from './utils/file-upload.utils';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documento_obrigatorio', maxCount: 1 },
      { name: 'documento_opcional', maxCount: 1 },
    ], {
      fileFilter: imageFileFilter, 
    }),
  )
  async create(
    @Body() createEmpresaDto: CreateEmpresaDto,
    @UploadedFiles() files: { documento_obrigatorio?: Express.Multer.File[], documento_opcional?: Express.Multer.File[] },
    @Headers('user-type') userType: 'interno' | 'externo' = 'externo'
  ) {
    if (!files.documento_obrigatorio) {
      throw new BadRequestException('É necessário enviar os arquivos obrigatórios para prosseguir');
    }

    if (files.documento_opcional && 
        files.documento_obrigatorio[0].originalname === files.documento_opcional[0].originalname) {
      throw new BadRequestException('Arquivo duplicado');
    }

    return this.empresasService.create(createEmpresaDto, userType);
  }
}