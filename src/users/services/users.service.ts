import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { BaseService } from '../../shared/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel('User') readonly userModel: Model<User>,
  ) {
    super();
    this.model = userModel;
  }
}
