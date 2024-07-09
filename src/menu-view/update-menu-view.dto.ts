import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuViewDto } from './create-menu-view.dto';

export class UpdateMenuViewDto extends PartialType(CreateMenuViewDto) {}
