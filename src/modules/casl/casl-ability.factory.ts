import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';
import { Action } from './constant/casl.constant';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/interface/user.interface';

type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
      can(Action.Read, User);
    }
    can(Action.Manage, 'all');
    can(Action.Update, User, { id: user.id });
    can(Action.Read, User, { id: user.id });
    cannot(Action.Delete, User, { role: Role.User });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
