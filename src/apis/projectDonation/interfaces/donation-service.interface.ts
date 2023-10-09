import { IContext } from 'src/common/interfaces/context';
import { CreateProjectDonationDTO } from '../dto/create-projectDonation.dto';

export interface IProjectDonationServiceCreateProjectDonation {
  createProjectDonationDTO: CreateProjectDonationDTO;
  context: IContext;
}
