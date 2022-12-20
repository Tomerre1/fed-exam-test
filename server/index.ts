import express from "express";
import bodyParser = require("body-parser");
import { tempData } from "./temp-data";
import { serverAPIPort, APIPath } from "@fed-exam/config";
import { Ticket } from "../client/src/api";

console.log("starting server", { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const findBy = (tickets:Ticket[],search:any)=>{
  console.log(tickets.length)
  if (search) {
      const res = tickets.filter((ticket:Ticket) => {
      return ticket.title?.toLowerCase().includes(search.toLowerCase()) || ticket.content?.toLowerCase().includes(search.toLowerCase())
    });
    return res;
  } 
  return tickets
}

app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = req.query.page;
  const {search} = req.query
  const filteredResults = findBy(tempData,search);
  const paginatedData = filteredResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(paginatedData);
});

app.listen(serverAPIPort);
console.log("server running", serverAPIPort);
