import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  privyId: z.string(),
  name: z.string().min(3),
  email: z.string().email(),
  username: z.string().min(3),
  accountType: z.enum(['PF', 'PJ']),
  walletAddress: z.string().nullable().optional(),
  walletIndex: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProps = z.infer<typeof UserSchema>;

export class UserEntity {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = UserSchema.parse(props);
  }

  get id() { return this.props.id; }
  get privyId() { return this.props.privyId; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get username() { return this.props.username; }
  get accountType() { return this.props.accountType; }
  get walletAddress() { return this.props.walletAddress; }
  get walletIndex() { return this.props.walletIndex; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  changeName(newName: string) {
    const validName = z.string().min(3).parse(newName);
    this.props.name = validName;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
