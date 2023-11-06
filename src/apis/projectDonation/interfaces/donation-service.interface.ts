import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDonationDTO } from '../dto/create-projectDonation.dto';
import { CreateProjectDonationForMobileDTO } from '../dto/create-projectDonationForMobile.dto';

export interface IProjectDonationServiceCreateProjectDonation {
  createProjectDonationDTO: CreateProjectDonationDTO;
  context: IContext;
}

export interface IProjectDonationServiceCreateProjectDonationForMobile {
  createProjectDonationForMobileDTO: CreateProjectDonationForMobileDTO;
  context: IContext;
}

export interface IProjectDonationServiceFetchProjectDonationsUserLoggedIn {
  offset: number;
  context: IContext;
}
