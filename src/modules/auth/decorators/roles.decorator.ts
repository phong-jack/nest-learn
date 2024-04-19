import { SetMetadata } from '@nestjs/common';
import { Role } from '../interface/user.interface';

export const Roles = (...args: string[]) => SetMetadata('roles', args);
