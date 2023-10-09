export interface ICommonServiceFindUserOneByEmail {
  email: string;
}

export interface ICommonServiceCreateUserWithGoogle {
  name: string;
  email: string;
}

export interface ICommonServiceFindOneUserById {
  user_id: string;
  onlyUser?: boolean;
}
