import { Model } from 'mongoose';
import { BaseService } from '../../shared/base.service';
import { VerificationToken } from '../models/verification-token.model';
import { InjectModel } from '@nestjs/mongoose';

export class VerificationTokenService extends BaseService<VerificationToken> {
  constructor(
    @InjectModel('VerificationToken') readonly verificationTokenModel: Model<VerificationToken>,
  ) {
    super();
    this.model = verificationTokenModel;
  }
}