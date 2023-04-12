/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import { Router, Request, Response } from "express";
import "dotenv/config"
import fetch from "node-fetch";
import { parse } from "csv-parse";
import { Readable } from "stream";

import multer from "multer";

const multerConfig = multer();

const router = Router();

interface Reviews {
  productId: string;
  rating: number;
  reviewerName: string;
  text: string;
  reviewDateTime: string;
  verifiedPurchaser: boolean;
  approved: boolean;
  shopperId: string;
  title: string;
}

router.post(
  "/reviews",
  multerConfig.single("file"),
  async (request: Request, response: Response) => {
    const { file }: any = request;
    const { buffer } = file;

    const data: Promise<Reviews[]> = new Promise((resolve) => {
      const readableFile = new Readable();

      readableFile.push(buffer);
      readableFile.push(null);

      const reviews: Reviews[] = [];

      readableFile
        .pipe(parse({ delimiter: "," }))
        .on("data", (dataRow: string[]) => {
          function getDateValidDate(date: string) {
            const oldDate = date.split("/");

            const newDate = `${oldDate[1]}/${oldDate[0]}/${oldDate[2]}`;

            return newDate;
          }

          reviews.push({
            productId: dataRow[12],
            title: "sem titulo",
            text: dataRow[3],
            rating: Number(dataRow[1]),
            reviewerName: dataRow[5],
            shopperId: dataRow[6],
            reviewDateTime: getDateValidDate(dataRow[4]),
            verifiedPurchaser: true,
            approved: true,
          });
        })
        .on("end", async () => {
          reviews.forEach(async (item) => {
            try {
              const url =
                "https://www.livreeleve.com.br/reviews-and-ratings/api/reviews";
              const options = {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "X-VTEX-API-AppKey": process.env.VTEX_APPKEY ? process.env.VTEX_APPKEY : '',
                  "X-VTEX-API-AppToken":
                    process.env.VTEX_APPTOKEN ? process.env.VTEX_APPTOKEN : '',
                },
                body: JSON.stringify([
                  {
                    productId: item.productId,
                    title: item.title,
                    text: item.text,
                    rating: item.rating,
                    reviewerName: item.reviewerName,
                    shopperId: item.shopperId,
                    reviewDateTime: item.reviewDateTime,
                    verifiedPurchaser: true,
                    approved: true,
                  },
                ]),
              };
              const response = await fetch(url, options);
              const data = await response.json();

              console.log(data);
            } catch (error) {
              console.log("deu ruim ===> ", error);
            }
          });

          resolve(reviews);
        });
    });

    const reviews = await data;

    return response.json(reviews);
  }
);

export { router };
