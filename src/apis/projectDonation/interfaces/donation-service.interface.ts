import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDonationDTO } from '../dto/create-projectDonation.dto';
import { FetchUserLoggedInDonationsDTO } from 'src/apis/user/dto/fetch-user-loggedIn-donations/fetch-user-loggedIn-donations.dto';
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
  fetchUserLoggedInDonationsDTO: FetchUserLoggedInDonationsDTO;
  context: IContext;
}
