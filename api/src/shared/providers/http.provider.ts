import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export type AsyncResponse<T> = Promise<[T | null, any | null]>;

@Injectable()
export class HttpProvider {
  constructor(private readonly httpService: HttpService) { }

  async request<T>(config: AxiosRequestConfig): AsyncResponse<T> {
    try {
      const response = await firstValueFrom(this.httpService.request<T>(config));
      return [response.data, null];
    } catch (error) {
      const axiosError = error as AxiosError;

      const errorPayload = {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        code: axiosError.code,
      };

      return [null, errorPayload];
    }
  }
}