import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';
import { Action } from './constant/casl.constant';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/interface/user.interface';

type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);
    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
      can(Action.Read, User);
    }
    can(Action.Manage, 'all');
    can(Action.Update, User, { id: user.id });
    can(Action.Read, User, { id: user.id });
    cannot(Action.Delete, User, { role: Role.User });
    const conditionsMatcher = (rule, conditions, doc) => {
      // Thực hiện logic kiểm tra điều kiện và trả về true hoặc false
      // Ví dụ: return doc.authorId === conditions.authorId;
      return true; // Trả về true mặc định
    };
    return build();
  }
}
