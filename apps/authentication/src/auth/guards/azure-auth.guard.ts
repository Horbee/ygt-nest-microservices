import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AzureAuthGuard extends AuthGuard('azure-ad') {}
