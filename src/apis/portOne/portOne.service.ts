import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import {
  IPortOneServiceCheckPaid,
  IPortOneServiceCheckPaidAmount,
} from './interfaces/portOne-service.interface';

@Injectable()
export class PortOneService {
  async getAccessToken(): Promise<string> {
    const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
      imp_key: process.env.PORTONE_IMP_KEY,
      imp_secret: process.env.PORTONE_IMP_SECRET,
    });
    return result.data.response.access_token;
  }

  async checkDonated({
    imp_uid,
    amount,
  }: IPortOneServiceCheckPaid): Promise<void> {
    const access_token = await this.getAccessToken();
    if (!access_token)
      throw new UnprocessableEntityException(
        'An error occurred during the donation, please try again',
      );

    const result = await axios.get(
      `https://api.iamport.kr/payments/${imp_uid}`,
      {
        headers: {
          Authorization: access_token,
        },
      },
    );

    if (amount !== result.data.response.amount)
      throw new UnprocessableEntityException('Invalid donation information');
  }

  async checkDonatedAmount({
    imp_uid,
  }: IPortOneServiceCheckPaidAmount): Promise<number> {
    const access_token = await this.getAccessToken();
    if (!access_token)
      throw new UnprocessableEntityException(
        'An error occurred during the donation, please try again',
      );

    const result = await axios.get(
      `https://api.iamport.kr/payments/${imp_uid}`,
      {
        headers: {
          Authorization: access_token,
        },
      },
    );

    return result.data.response.amount;
  }
}
