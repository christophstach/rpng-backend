import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Inject, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { PubSub } from 'graphql-subscriptions';


@Resolver('User')
export class UsersResolver {
  static readonly USER_CREATED = 'userCreated';
  static readonly USER_UPDATED = 'userUpdated';
  static readonly USER_DELETED = 'userDeleted';

  constructor(
    private readonly usersService: UsersService,
    @Inject('PubSub') private readonly pubSub: PubSub,
  ) {
  }

  @Query('getUsers')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async getUsers(obj, args, context, info) {
    return await this.usersService.findAll();
  }

  @Query('getUser')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async getUser(obj, args, context, info) {
    const { id } = args;

    return await this.usersService.findById(id);
  }

  @Mutation('createUser')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async createUser(incomingMessage, args) {
    const { email, username, firstName, lastName } = args;
    const user = await this.usersService.create({ email, username, firstName, lastName });
    this.pubSub.publish(UsersResolver.USER_CREATED, { [UsersResolver.USER_CREATED]: user });
    return user;
  }

  @Mutation('updateUser')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async updateUser(incomingMessage, args) {
    const { id, email, username, firstName, lastName } = args;
    const user = await this.usersService.update(id, { email, username, firstName, lastName });

    this.pubSub.publish(UsersResolver.USER_UPDATED, { [UsersResolver.USER_UPDATED]: user });
    return user;
  }

  @Mutation('deleteUser')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async deleteUSer(incomingMessage, args) {
    const { id } = args;
    const user = await this.usersService.delete(id);

    this.pubSub.publish(UsersResolver.USER_DELETED, { [UsersResolver.USER_DELETED]: user });
    return user;
  }

  @Subscription()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  userCreated() {
    return {
      subscribe: () => this.pubSub.asyncIterator(UsersResolver.USER_CREATED),
    };
  }

  @Subscription()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  userUpdated() {
    return {
      subscribe: () => this.pubSub.asyncIterator(UsersResolver.USER_UPDATED),
    };
  }

  @Subscription()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  userDeleted() {
    return {
      subscribe: () => this.pubSub.asyncIterator(UsersResolver.USER_DELETED),
    };
  }
}