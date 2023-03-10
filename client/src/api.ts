import axios from "axios";
import { APIRootPath } from "@fed-exam/config";

export type Ticket = {
  id: string;
  title: string;
  content: string;
  creationTime: number;
  userEmail: string;
  labels?: string[];
};

export type ApiClient = {
  getTickets: (search:string,page:number) => Promise<Ticket[]>;
};

export const createApiClient = (): ApiClient => {
  return {
    getTickets: async (search,page) => {
      const res = await axios.get(APIRootPath,{ params: { search,page } });
      return res.data;
    },
  };
};
