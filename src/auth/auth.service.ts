import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email, isActive: true }
    });

    if (!admin || !await bcrypt.compare(loginDto.password, admin.password)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
      email: admin.email, 
      sub: admin.id, 
      name: admin.name 
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email }
    });

    if (existingAdmin) {
      throw new ConflictException('Admin com este email já existe');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword
    });

    const savedAdmin = await this.adminRepository.save(admin);

    const { password, ...result } = savedAdmin;
    return result;
  }

  async validateUser(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id, isActive: true }
    });

    if (!admin) {
      throw new UnauthorizedException('Admin não encontrado');
    }

    const { password, ...result } = admin;
    return result;
  }
}