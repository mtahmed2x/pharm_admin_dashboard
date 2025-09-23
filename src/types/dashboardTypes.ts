export type UserTableData = {
  _id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  status: boolean;
  postCode: string;
  joinedOn: string;
  gender: string;
  address: string;
  sexAssigned: string;
  nhs: string;
  gpSurgery: string;
  contraception: string;
  ID: string;
};

export type UserFormData = {
  fullName: string;
  email: string;
  phone: string;
  postCode: string;
  joinedOn: string;
  gender: string;
  address: string;
  sexAssigned: string;
  nhs: string;
  gpSurgery: string;
  contraception: string;
  image?: string;
};

export type ServiceData = {
  _id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  status: boolean;
  postCode: string;
  joinedOn: string;
  gender: string;
  address: string;
  sexAssigned: string;
  nhs: string;
  gpSurgery: string;
  contraception: string;
  ID: string;
  serviceType: string;
};
